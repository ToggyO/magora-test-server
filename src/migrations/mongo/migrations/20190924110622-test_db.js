/* eslint-disable indent */
module.exports = {
  async up(db) {
    try {
      await db.collection('users').updateMany({}, {
        $set: {
          email: '',
          password: '',
        },
      });
    } catch (err) {
      throw new Error('Server error');
    }
  },

  async down(db) {
    try {
      await db.collection('users').updateMany({}, {
        $unset: {
          email: '',
          password: '',
        },
      });
    } catch (err) {
      throw new Error('Server error');
    }
    // return db.collection('users').updateMany({}, { $unset: { blacklisted: false } });
  },
};
