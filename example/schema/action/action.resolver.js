// eslint-disable-next-line
const sid = require('shortid');
const heroDb = require('../heroDb');

module.exports = {
  __name: 'Action',

  hero(parent) {
    return heroDb.find(h => h.actions.find(a => a.id === parent.id));
  },

  Mutation: {
    addAction(_, args) {
      const { heroId, desc, time } = args.action;

      const heroIndex = heroDb.findIndex(h => h.id === heroId);

      const newAction = {
        id: sid.generate(),
        desc,
        time,
      };

      heroDb[heroIndex].actions.push(newAction);

      return newAction;
    },
  },
};
