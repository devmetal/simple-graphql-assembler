// eslint-disable-next-line import/no-extraneous-dependencies
const sid = require('shortid');

const heroesDb = [
  {
    id: sid.generate(),
    name: 'Dennis Ritchie',
    actions: [
      {
        id: sid.generate(),
        desc: 'Create C Language',
        time: '1972',
      },
      {
        id: sid.generate(),
        desc: 'Turing Award',
        time: '1983',
      },
    ],
  },
  {
    id: sid.generate(),
    name: 'Bjarne Stroustrup',
    actions: [
      {
        id: sid.generate(),
        desc: 'Create C++ Language',
        time: '1985',
      },
      {
        id: sid.generate(),
        desc: 'Dahl–Nygaard Prize',
        time: '2015',
      },
    ],
  },
];

const hero = {
  __name: 'Hero',

  actions(h) {
    return h.actions;
  },

  Query: {
    heroes() {
      return [...heroesDb];
    },
    hero(_, { id }) {
      return heroesDb.find(h => h.id === id);
    },
  },
};

const action = {
  __name: 'Action',

  hero(parent) {
    return heroesDb.find(h => h.actions.find(a => a.id === parent.id));
  },

  Mutation: {
    addAction(_, args) {
      const { heroId, desc, time } = args.action;

      const heroIndex = heroesDb.findIndex(h => h.id === heroId);

      const newAction = {
        id: sid.generate(),
        desc,
        time,
      };

      heroesDb[heroIndex].actions.push(newAction);

      return newAction;
    },
  },
};

module.exports = {
  hero,
  action,
};
