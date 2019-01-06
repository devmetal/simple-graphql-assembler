// eslint-disable-next-line
const sid = require('shortid');

module.exports = [
  {
    id: 'foo',
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
    id: 'bar',
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
