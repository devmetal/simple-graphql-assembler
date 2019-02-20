const path = require('path');

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);

// Used for mocking writeSync. The last writeSync call content will be stored here
const writes = {};

function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);

  // eslint-disable-next-line no-restricted-syntax
  for (const file of Object.keys(newMockFiles)) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }

    mockFiles[dir].push({
      name: path.basename(file),
      content: newMockFiles[file],
    });
  }
}

function lstatSync(file) {
  if (mockFiles[file]) {
    return {
      isDirectory() {
        return true;
      },
    };
  }
  return {
    isDirectory() {
      return false;
    },
  };
}

function readdirSync(root) {
  const files = mockFiles[root] || [];

  if (!files.length) {
    return files;
  }

  return files.map(f => f.name);
}

function readFileSync(file) {
  const dir = path.dirname(file);

  if (!mockFiles[dir]) {
    return null;
  }

  const name = path.basename(file);
  const mock = mockFiles[dir].find(f => f.name === name);

  if (!mock) {
    return null;
  }

  return mock.content;
}

function writeFileSync(file, content) {
  writes[file] = content;
}

function __getWrites(file) {
  return writes[file] || '';
}

fs.lstatSync = lstatSync;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.__setMockFiles = __setMockFiles;
fs.__getWrites = __getWrites;

module.exports = fs;
