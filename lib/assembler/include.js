const fs = require('fs');

module.exports = mName => {
  if (!fs.existsSync(mName)) {
    return undefined;
  }
  const jsPath = mName.replace('.js', '');
  // eslint-disable-next-line
  return require(jsPath);
};
