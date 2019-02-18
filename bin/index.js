#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const { onlyTypeDefs } = require('../index');

// eslint-disable-next-line no-console
const log = console.log.bind(console);

const args = yargs
  .usage('Usage: $0 [options]')
  .option('root', {
    alias: 'r',
    default: '.',
    describe: 'Root folder of your gql definitions and resolvers',
  })
  .option('output', {
    alias: 'o',
    default: './schema.gql',
    describe: 'Output file for type definitions',
  })
  .example(
    '$0 -r . -o ./schema.gql',
    'Create the gql type definition file for your definitions from the current directory',
  )
  .help('h')
  .alias('h', 'help').argv;

log('Thank you for using this package!');
log('I wish you have a grat day!');

const typeDefs = onlyTypeDefs(args.root);
const destination = path.resolve(args.root, args.output);

fs.writeFileSync(destination, typeDefs);
log('Your gql file is ready');
