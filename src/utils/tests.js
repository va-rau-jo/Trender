
import { filterDeletedPlaylists, filterPlaylistsByMonth } from './helpers.js';

/**
 * Returns true if the two arrays are equal.
 * NOTE: some unexpected behavior if you are comparing deep arrays. Best
 * used for shallow comparisons.
 * @param {Array} a1
 * @param {Array} a2
 * @returns {boolean} Whether the two arrays are equal.
 */
function arrayEquals(a1, a2) {
  return JSON.stringify(a1) == JSON.stringify(a2);
}

function assert(value) {
  if (!value) {
    throw "Assert failed";
  }
}

function testUtils() {
  try {
    console.log('\nTesting helper methods');
    testFilterByMonthName();
    testFilterDeletedPlaylists();
    console.log('\nHelper methods tests all passed!');
  } catch (e) {
    console.log('ERROR: Error running helper method tests');
    console.log(' - ' + e);
  }
}

function testFilterByMonthName() {
  console.log(' - Testing "testFilterByMonthName"');

  let playlists = [
    { 'name': 'January' },
    { 'name': 'February 2022' },
    { 'name': 'March21' },
    { 'name': 'April' },
    { 'name': 'May' },
    { 'name': 'June' },
    { 'name': 'July' },
    { 'name': 'August' },
    { 'name': 'September' },
    { 'name': 'October' },
    { 'name': 'November' },
    { 'name': 'December' }];

  let filtered = filterPlaylistsByMonth(playlists);
  assert(filtered.length === 12);

  playlists = playlists.concat(playlists);

  filtered = filterPlaylistsByMonth(playlists);
  assert(filtered.length === 24);

  let invalid = [
    { 'name': 'Jnuary' },
    { 'name': 'test' },
    { 'name': 'Aril' },
    { 'name': 'Jne' },
    { 'name': 'wow' },
    { 'name': 'Agust' },
    { 'name': 'Weekly' },
    { 'name': 'New Music Friday' },
    { 'name': 'Noveber' },
    { 'name': '' }];
  playlists = playlists.concat(invalid);

  filtered = filterPlaylistsByMonth(playlists);
  assert(filtered.length === 24);
}

function testFilterDeletedPlaylists() {
  console.log(' - Testing "testFilterDeletedPlaylists"');

  let playlists = [
    { 'id': 100 },
    { 'id': 101 },
    { 'id': 102 },
    { 'id': 103 },
    { 'id': 104 },
    { 'id': 105 },
    { 'id': 106 },
    { 'id': 107 },
    { 'id': 108 }];
  let toDelete = [0, 4, 5, 8]; // Indices we are deleting
  let expected = [
    { 'id': 101 },
    { 'id': 102 },
    { 'id': 103 },
    { 'id': 106 },
    { 'id': 107 }];
  let filtered = filterDeletedPlaylists([], playlists); // Delete with empty list

  assert(filtered.length === 9);
  assert(arrayEquals(filtered, playlists));

  filtered = filterDeletedPlaylists(toDelete, playlists);

  assert(filtered.length === 5);
  assert(arrayEquals(filtered, expected));
}

testUtils();