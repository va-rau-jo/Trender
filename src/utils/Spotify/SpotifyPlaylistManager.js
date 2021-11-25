import { filterPlaylistsByMonth } from '../helpers';

const BASE_URL = 'https://api.spotify.com/v1/';

// The number of playlists returned from the Spotify API per request. Need to
// set an offset to get all playlists. MAX is 50
const PLAYLISTS_PER_REQUEST = 50;

// The number of songs to send per add request to the Spotify API. Max is 100.
const SONGS_PER_ADD_REQUEST = 100;

// Arbitrary number of fetches per batch and batches per second. Low enough so the
// Spotify API doesn't give us a 429 error.
const MAX_REQUESTS_PER_BATCH = 10;
const REQUEST_SLEEP_TIMEOUT = 1000;
// Timer to sleep before making another request.
const SLEEP_TIMER = () => new Promise(res => setTimeout(res, REQUEST_SLEEP_TIMEOUT))

export default class SpotifyPlaylistManager {
  /**
   * Given a playlist id and a list of songs of the form ['spotify:track:___'],
   * make POST requests to add those songs to the playlist. Spotify API
   * restricts the number of songs added per request to 100. Ensures that the
   * songs are added in the correct order.
   * @param {string} playlistId The id of the playlist.
   * @param {Array} songUris Array of song uris.
   * @returns {Promise} A promise that resolves when the songs are added.
   */
  static addSongsToPlaylist(playlistId, songUris) {
    const url = BASE_URL + 'playlists/' + playlistId + '/tracks';
    const divided = this.divideArray(songUris, SONGS_PER_ADD_REQUEST);

    return new Promise(async (resolve, _) => {
      // For loop used instead of Promise.all to ensure the correct order of
      // songs. Promise.all interleaves the song blocks.
      for (let i = 0; i < divided.length;) {
        await fetch(url, {
          body: JSON.stringify({ 'uris': divided[i] }),
          headers: { Authorization: 'Bearer ' + this.accessToken },
          method: 'POST'
        }).then(() => { i++; })
      }
      resolve();
    });
  }

  /**
   * Given many details about the new playlist, make a POST request to the
   * Spotify API to create this new playlist.
   * @param {string} name Name of the new playlist
   * @param {string} description Description of the new playlist (optional)
   * @param {boolean} isPublic Is the playlist public or not
   * @param {boolean} collaborative Is the playlist collaborative (cannot be set
   * to true if the playlist is also public)
   * @returns {Promise} A promise resolving with the API response of creating a
   * playlist, holding the new playlist's ID, etc.
   */
  static createPlaylist (name, description, isPublic, collaborative) {
    const url = BASE_URL + 'me/playlists';

    return new Promise(async (resolve, _) => {
      await fetch(url, {
        body: JSON.stringify({
          'collaborative': collaborative,
          'description': description,
          'name': name,
          'public': isPublic,
        }),
        headers: { Authorization: 'Bearer ' + this.accessToken },
        method: 'POST'
      })
        .then(res => { return res.json(); })
        .then(json => { resolve(json); });
    });
  }

  static deletePlaylists(playlistIds) {
    // Current request count. Hitting MAX_REQUESTS_PER_BATCH sleeps and resets requestCount.
    let requestCount = 0;
    let baseUrl = BASE_URL + "playlists/";

    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < playlistIds.length;) {
        if (requestCount === MAX_REQUESTS_PER_BATCH) { // wait to cool down the Spotify API
          requestCount = 0;
          await SLEEP_TIMER();
        } else {
          await fetch(baseUrl + playlistIds[i] + "/followers", {
            headers: { Authorization: 'Bearer ' + this.accessToken },
            method: 'DELETE'
          }).then(async res => {
            if (!res.ok) {
              // Some other error (API key, API down, etc.) (don't try again)
              reject(res.status);
            } else {
              i++;
              if (i === playlistIds.length) {
                console.log("RESOLVED");
                resolve();
              }
            }
          });
        }
      }
    });
  }

  /**
   * Helper method for the getSongData method to make the fetch request
   * that gets the track data for a given playlist. URL includes offset so we
   * can get all songs.
   * @param {string} url The URL to access the Spotify API with
   * @returns {Promise} A promise that is resolved when the Spotify API responds
   * with the song data. Rejects on any API error.
   */
  static fetchSongs(url) {
    // Fetch until we get less than the max limit (reached the end)
    return new Promise(async (resolve, reject) => {
      await fetch(url, {
        headers: { Authorization: 'Bearer ' + this.accessToken }
      }).then(async res => {
        if (!res.ok) {
          // Some other error (API key, API down, etc.) (don't try again)
          reject(res.status);
        } else {
          return res.json();
        }
      }).then(json => {
        if (json && !json.error && json.items.length > 0) {
          resolve(json.items);
        }
      });
    });
  }

  /**
   * Get playlist data from Spotify API and call API again for each playlist to
   * get the song data.
   *
   * @param {boolean} filterByMonth If true, playlists are filtered to only
   * include month like names.
   * @param {boolean} fetchSongs If true, will also fetch the songs for
   * each playlist.
   * @returns {Promise} A promise that when resolved, contains a map with
   * 'playlist' holding the playlists array and 'songs' holding arrays of songs
   * for each corresponding playlist.
   */
  static getPlaylistData (filterByMonth, fetchSongs) {
    const url = BASE_URL + 'me/playlists';
    return new Promise(async (resolve, reject) => {
      this.repeatedlyFetch(url, PLAYLISTS_PER_REQUEST, 'GET').then(playlists => {
        if (filterByMonth) {
          playlists = filterPlaylistsByMonth(playlists);
        }

        if (fetchSongs) {
          this.getSongData(playlists).then(songs => {
            resolve({
              'playlists': playlists,
              'songs': songs
            });
          }).catch(reject);
        } else {
          resolve({ 'playlists': playlists });
        }
      }).catch(reject);
    });
  }

  /**
   * Get song data using promise from the playlist's link to its
   * details. This only adds the relevant properties to the song list object.
   * @param {Array} playlists An array of playlists.
   * @returns {Array} An array of song objects corresponding to each playlist.
   */
  static getSongData(playlists) {
    let songs = new Array(playlists.length).fill([]);
    this.loadingTotal = playlists.length;
    this.loadingProgress = 0;
    // Current request count. Hitting MAX_REQUESTS_PER_BATCH sleeps and resets requestCount.
    let requestCount = 0;
    const limit = SONGS_PER_ADD_REQUEST;

    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < playlists.length; i++) {
        for (let j = 0; j < playlists[i].tracks.total;) {
          if (requestCount === MAX_REQUESTS_PER_BATCH) { // wait to cool down the Spotify API
            requestCount = 0;
            await SLEEP_TIMER();
          } else {
            let url = playlists[i].tracks.href + '?' + new URLSearchParams({ limit, offset: j });
            j += limit;
            requestCount++;
            this.fetchSongs(url).then(tracks => {
              songs[i] = songs[i].concat(tracks.map(song => ({
                // TODO: Add other fields here if necessary.
                added_at: song.added_at,
                artist: song.track ? this.combineArtists(song.track.artists) : '',
                duration: song.track ? song.track.duration_ms / 1000 : 0,
                // Good for key in React mapping
                id: song.track ? song.track.id : '',
                image: song.track ? song.track.album.images[0] : null,
                isLocalFile: song.is_local,
                name: song.track ? song.track.name : '',
                uri: song.track.uri,
              })));
              this.loadingProgress++;
              if (this.loadingProgress === playlists.length) {
                resolve(songs);
              }
            }).catch(reject);
          }
        }
      }
    });
  }

  /**
   * Method to fetch all the items from an API endpoint (since Spotify limits
   * the items fetched per request). Repeats until the number of items returned
   * is less than the limit.
   * @param {string} baseUrl The base url before adding limit and offset.
   * @param {number} limit The limit of items per request.
   * @returns {Promise} A promise resolving to an array of items.
   */
  static repeatedlyFetch(baseUrl, limit, method) {
    let items = [];
    let nextUrl = baseUrl + '?' + new URLSearchParams({ limit, offset: 0 });

    // Fetch until we get less than the max limit (reached the end)
    return new Promise(async (resolve, reject) => {
      while (nextUrl !== null) {
        const json = await fetch(nextUrl, {
          headers: { Authorization: 'Bearer ' + this.accessToken },
          method: method,
        }).then(async (res, nextUrl) => {
          if (!res.ok) {
            // Some other error (API key, API down, etc.) (don't try again)
            nextUrl = null;
            reject(res.status);
          } else {
            return res.json();
          }
        });

        if (json && !json.error) {
          nextUrl = json.next;
          if (json.items.length > 0) {
            items = items.concat(json.items);
          }
        }
      }
      resolve(items);
    });
  }

  /**
   * Helper function to throw an error if the response from the Spotify API
   * was not OK.
   * @param {object} res Response from our API call.
   * @returns {object} The response object, or throws an error.
   */
  static statusCheck(res) {
    if (!res.ok) {
      throw res.status;
    }
    return res;
  }

  /**
   * Helper function to combine multiple artists into 1 comma separated string.
   * @param {Array} artists Array of artist objects
   * @returns {string} A comma separated string of artist names.
   */
  static combineArtists(artists) {
    if (artists.length === 1) {
      return artists[0].name;
    }

    let joined = '';
    artists.forEach((artist) => {
      joined += artist.name + ', ';
    });

    // Cut out the last ', '
    return joined.substring(0, joined.length - 2);
  }

  /**
   * Helper function to divide the input array into slices that are each
   * 'maxLength' long. This is needed because the Spotify API only accepts up to
   * 100 songs per add attempt, so we have to split it up.
   * @param {Array} array The array to divide
   * @param {number} maxLength The max size of each new smaller array.
   * @returns {Array} An array containing each divided arrray.
   */
  static divideArray(array, maxLength) {
    let newArray = [];
    let start = 0, end = 0, count = 0;
    do {
      start = maxLength * count;
      end = Math.min(maxLength * (count + 1), array.length);
      newArray.push(array.slice(start, end));
      count++;
    } while (end !== array.length);
    return newArray;
  }

  /**
   * Imported songs don't have an id, so we need a dummy id so we can use it as
   * a key. When fetching from the Spotify API, we just check if the value
   * returned is valid since the id won't return anything/
   * @returns {string} A 16 char string.
   */
  static generateRandomId() {
    return Math.floor((1 + Math.random()) * 0x1000000000000)
      .toString(16)
      .substring(1);
  }

  /**
   * Returns the loading total for a playlist loading request.
   * @returns {number} The loading total.
   */
  static getLoadingTotal() {
    return this.loadingTotal;
  }

  /**
   * Returns the loading progress for a playlist loading request.
   * Progress is a number between 0 and loadingTotal.
   * @returns {number} The loading progress.
   */
  static getLoadingProgress() {
    return this.loadingProgress;
  }

  /**
   * Returns the global Spotify access token
   * @returns {string} The Spotify access token
   */
  static getAccessToken() {
    return this.accessToken;
  }

  /**
   * Sets the global access token that all the Spotify fetch requests can use
   * @param {string} accessToken The access token provided by Spotify.
   */
  static setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
}
