import SpotifyPlaylistManager from "./SpotifyPlaylistManager";

const BASE_URL = 'https://api.spotify.com/v1/me/player/';

export class SpotifyPlaybackManager {

    static playSong(uri) {
        return fetch(BASE_URL + 'play?device_id=' + this.deviceId, {
          method: 'PUT',
          body: JSON.stringify({uris: [uri]}),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SpotifyPlaylistManager.getAccessToken()}`
          }
        });
    }

    static setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }
}

export default SpotifyPlaybackManager;
