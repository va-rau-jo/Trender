/**
 * Given an array of playlists, it filters out any that do not
 * contain a monthly playlist
 * @param {Array of playlists} playlists
 */
export function filterPlaylistsByMonth(playlists) {
  let copy = playlists.slice();
  let regex = /^January|February|March|April|May|June|July|August|September|October|November|December$/;
  for (let i = playlists.length - 1; i >= 0; i--) {
    if (!regex.test(playlists[i].name)) {
      playlists.splice(i, 1);
    }
  }
  return copy;
}


export function filterDeletedPlaylists(ids, playlists) {
  let copy = playlists.slice();
  // Remove deleted playlists from state playlist array
  for (let i = ids.length - 1; i >= 0; i--) {
    copy.splice(ids[i], 1);
  }
  return copy;
}