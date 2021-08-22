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
          // Add other fields here if necessary.
          added_at: song.added_at,
          artists: song.track.artists,
          duration: song.track.duration_ms / 1000,
          explicit: song.track.explicit,
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

  static getAccessToken() {
    return this.accessToken;
  }

  static setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
}

export default SpotifyAPIManager;
