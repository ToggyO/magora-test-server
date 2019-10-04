/* eslint-disable indent */
module.exports = {
  async up(db) {
    try {
      await db.collection('users').updateMany({}, {
        $set: {
          refreshTokenList: [],
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
          refreshTokenList: [],
        },
      });
    } catch (err) {
      throw new Error('Server error');
    }
  },
};
