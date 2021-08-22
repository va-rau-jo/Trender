/**
 * Given an array of playlists, it filters out any that do not
 * contain a monthly playlist
 * @param {Array of playlists} playlists
 */
export function filterPlaylistsByMonth(playlists) {
  let regex = /^January|February|March|April|May|June|July|August|September|October|November|December$/;
  for (let i = playlists.length - 1; i >= 0; i--) {
    if (!regex.test(playlists[i].name)) {
      playlists.splice(i, 1);
    }
  }
  console.log(playlists);
}

/**
 * Helper function that copies the array provided and removes
 * the element at the selected index
 * @param {Array to be spliced} array
 * @param {Index to be removed} index
 */
export function copyAndRemoveItem(array, index) {
  let a = array.slice();
  a.splice(index, 1);
  return a;
}
