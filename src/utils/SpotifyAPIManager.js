import { filterPlaylistsByMonth } from "./helpers";

const BASE_URL = "https://api.spotify.com/v1/";

class SpotifyAPIManager {
  /**
   * Get playlist data from Spotify API and call API again for each playlist
   * to get the song data
   *
   * @returns {Promise} A promise that when resolved, contains a map with
   * "playlist" holding the playlists array and "songs" holding arrays of songs
   * for each corresponding playlist.
   */
  static getPlaylistData = () => {
    const url = BASE_URL + "me/playlists?" + new URLSearchParams({ limit: 50 });
    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: { Authorization: "Bearer " + this.accessToken }
      })
        .then(res => {
          return res.json();
        })
        .then(playlistData => {
          const playlists = playlistData.items;
          if (playlists) {
            filterPlaylistsByMonth(playlists);

            this.getSongData(playlists).then(songs => {
              resolve({
                "playlists": playlists,
                "songs": songs
              });
            });
          }
        })
        .catch(() => {
          reject("Error fetching playlist data");
        });
    });
  }

  /**
   * Get song data using promise from the playlist's link to its
   * details.
   * @param {Array} playlists An array of playlists.
   * @returns {Array} An array of song objects corresponding to each playlist.
   */
  static async getSongData(playlists) {
    // Only map relevant properties to songs array
    let songs = [];

    await Promise.all(playlists.map(async (playlist, i) => {
      // Fetches more trackData from playlist's details link
      await fetch(playlist.tracks.href, {
        headers: { Authorization: "Bearer " + this.accessToken }
      }).then(res => {
        return res.json();
      }).then(tracks => {
        songs[i] = tracks.items.map(song => ({
          // TODO: Add other fields here if necessary.
          added_at: song.added_at,
          artist: this.combineArtists(song.track.artists),
          duration: song.track.duration_ms / 1000,
          // Good for key in React mapping
          id: song.track.id || this.generateRandomId(),
          image: song.track.album.images[0],
          name: song.track.name,
        }));
      })
    }));
    return songs;
  }

  /**
   * Gets the current user's id from Spotify API, and compares it to ids
   * on Firebase, adding an entry if it does not already exist
   */
  static getUserData = (firebaseController) => {
    fetch(BASE_URL + "me", {
      headers: { Authorization: "Bearer " + this.accessToken }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          // add user if one doesn't exist yet, or set its state
          firebaseController.setCurrentUserId(data.id);
          let db = firebaseController.getDatabase();
          db.collection("users")
            .where("userId", "==", data.id)
            .get()
            .then(querySnapshot => {
              let docs = querySnapshot.docs;
              if (docs.length !== 1 || docs[0] === null) {
                console.log("adding user");
                firebaseController.addUser(
                  data.id,
                  data.display_name,
                  data.email
                );
              }
            });
        }
      });
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

    let joined = "";
    artists.forEach((artist) => {
      joined += artist.name + ", ";
    });

    // Cut out the last ", "
    return joined.substring(0, joined.length - 2);
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

  static getAccessToken() {
    return this.accessToken;
  }

  static setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
}

export default SpotifyAPIManager;
