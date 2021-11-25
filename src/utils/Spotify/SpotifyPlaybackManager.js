import SpotifyPlaylistManager from "./SpotifyPlaylistManager";

const BASE_URL = 'https://api.spotify.com/v1/me/player/play?';

export class SpotifyPlaybackManager {

    static playSong(uri, position) {
        return fetch(BASE_URL + 'device_id=' + this.deviceId, {
          method: 'PUT',
          body: JSON.stringify({
              position_ms: position,
              uris: [uri]
            }),
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
