
// Regex matches playlist names that match exactly the months of the year.
const EXACT_MONTH_MATCH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;

// Regex matches playlist names that contain months of the year.
// Currently using this so names like "September 22" will pass
const SOFT_MONTH_MATCH = /^January|February|March|April|May|June|July|August|September|October|November|December$/;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

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
 * Formats the given date to a human readable string.
 * Ex input: 2020-11-24T00:41:29Z
 * Ex output: November 24th, 2020
 * @param {string} date Raw date string 
 * @returns {string} A beautified date string with the day, month, and year.
 */
export function formatReadableDate(date) {
  const split = date.split('-');
  const year = split[0];
  const month = MONTH_NAMES[parseInt(split[1]) - 1]; 
  let day = split[2].substring(0, 2);
  const lastDigit = day.charAt(1);

  const suffix = (lastDigit === '1' && day !== '11') ? 'st' :
    (lastDigit === '2' && day !== '12') ? 'nd' : 
    (lastDigit === '3' && day !== '13') ? 'rd' :
    'th'; 

  if (day.charAt(0) ==='0') { // remove starting 0 from day
    day = day.substring(1);
  }
  return month + ' ' + day + suffix + ', ' + year;
}


export function getListenTime(added, removed) {
  const split = added.split('-');
  const addedYear = parseInt(split[0]);
  const addedMonth = parseInt(split[1]); 

  const date = new Date();
  const removedSplit = removed ? removed.split(' ') : null;
  const removedYear = removed ? removedSplit[1] : date.getFullYear();
  const removedMonth = removed ? MONTH_NAMES.indexOf(removedSplit[0]) + 1 : date.getMonth() + 1;

  return (removedYear - addedYear) * 12 + (removedMonth - addedMonth + 1);
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

  return songList.find(x => x.uri === song.uri) === undefined;
}

/**
 * Verifies that the object passed in (song or playlist) has a
 * valid image property. Songs that are local files don't have images,
 * so we replace the url with a blank sound file image.
 * @param {JSON} obj An object with an image property. 
 * @returns {string} Either the song's image url or the default song url.
 */
export function verifyImageUrl(obj) {
  return (obj && obj.image) ? obj.image.url : '/images/sound_file_white.png';
}