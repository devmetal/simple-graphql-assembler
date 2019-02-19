const yargs = jest.genMockFromModule('yargs');

yargs.argv = { root: '/test', output: './schema.gql' };

function _mock() {
  return this;
}

yargs.usage = _mock.bind(yargs);
yargs.option = _mock.bind(yargs);
yargs.example = _mock.bind(yargs);
yargs.help = _mock.bind(yargs);
yargs.alias = _mock.bind(yargs);

module.exports = yargs;
