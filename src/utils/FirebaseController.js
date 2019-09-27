import { Component } from "react";

class FirebaseController extends Component {
  constructor(props) {
    super(props);
    this.database = props;
  }

  /**
   * Add's a user entry to the Firebase DB
   * @param {Spotify ID} userId
   * @param {Diplay name} name
   * @param {Email} email
   */
  addUser(userId, name, email) {
    let db = this.database;
    db.collection("users").add({
      userId,
      name,
      email
    });
  }

  /**
   * Accessor for the internal database, needed because
   * adding an event listener for the hasUser call seems
   * overly complicated
   */
  getDatabase() {
    return this.database;
  }

  /**
   * Get rankings for playlist songs from firebase.
   */
  getRankingData() {
    let db = this.database;
    if (db) {
      db.collection("rankings")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(doc.data());
          });
        });
    }
  }

  // TODO: remove
  // for debugging purposes
  printDb() {
    console.log(this.database);
  }

  /**
   * Saves/updates the song rankings for a
   * monthly playlist on the Firebase DB. If
   * there are duplicate monthly playlists, it
   * uses the most recent one.
   * @param {Name of the playlist} playlistName
   * @param {Array of song rankings} newRankings
   */
  saveRankings(playlistName, newRankings) {
    let db = this.database;
    let songs = [];
    newRankings.forEach(function(song) {
      songs.push(song.name);
    });

    if (db) {
      db.collection("rankings")
        .where("playlistName", "==", playlistName)
        .get()
        .then(querySnapshot => {
          let docs = querySnapshot.docs;
          // updated existing document
          if (docs.length > 0) {
            console.log(docs[0]);
            docs[0].ref.set({
              playlistName,
              songs
            });
          } else {
            db.collection("rankings").add({
              playlistName,
              songs
            });
          }
        });
    }
  }
}

export default FirebaseController;
