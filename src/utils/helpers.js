/**
 * Given an array of playlists, it filters out any that do not
 * contain a monthly playlist
 * @param {Array of playlists} playlists
 */

const EXACT_MONTH_MATCH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const SOFT_MONTH_MATCH = /^January|February|March|April|May|June|July|August|September|October|November|December$/;

/**
 * Filters the given playlists by month. The playlist name must match a month.
 * @param {Array} playlists Array of playlist objects with a "name" field.
 * @returns {Array} A copy of the given array that only match month names.
 */
export function filterPlaylistsByMonth(playlists) {
  let copy = playlists.slice();
  let regex = SOFT_MONTH_MATCH;
  for (let i = playlists.length - 1; i >= 0; i--) {
    if (!regex.test(playlists[i].name)) {
      copy.splice(i, 1);
    }
  }
  return copy;
}

/**
 * Filters playlists out that are in the ids array
 * @param {Array} ids A list of playlist ids to delete.
 * @param {Array} playlists A list of playlist objects.
 * @returns {Array} A copy of the given playlists array with the playlists that
 * match the ids filtered out.
 */
export function filterDeletedPlaylists(ids, playlists) {
  let copy = playlists.slice();
  // Remove deleted playlists from state playlist array
  for (let i = ids.length - 1; i >= 0; i--) {
    copy.splice(ids[i], 1);
  }
  return copy;
}

/**
 * Returns true if the given song is not in the song list.
 * @param {JSON} song Song object with an id field.
 * @param {Array} songList Array of song objects with an id field.
 * @returns {boolean} Returns whether the song given is new or not.
 */
export function isSongNew(song, songList) {
  if (!songList) {
    return false;
  }

  return songList.find(x => x.id === song.id) === undefined;
}