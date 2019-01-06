const heroDb = require('../heroDb');

module.exports = {
  __name: 'Hero',

  actions(h) {
    return h.actions;
  },

  Query: {
    heroes() {
      return [...heroDb];
    },
    hero(_, { id }) {
      return heroDb.find(h => h.id === id);
    },
  },
};
