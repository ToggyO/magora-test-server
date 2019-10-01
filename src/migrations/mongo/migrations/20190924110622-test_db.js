/* eslint-disable indent */
module.exports = {
  up(db) {
    return db.collection('users').updateMany({}, {
      $set: {
        email: '',
        password: '',
      },
    });
  },

  down(db) {
    // return db.collection('users').updateMany({}, { $unset: { blacklisted: false } });
    return db.collection('users').updateMany({}, {
      $unset: {
        email: '',
        password: '',
      },
    });
  },
};
