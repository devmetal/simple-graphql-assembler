let __modules = {};

const __setModules = modulesMap => {
  __modules = { ...__modules, ...modulesMap };
};

const include = mName => {
  const jsPath = mName.replace('.js', '');
  return __modules[jsPath];
};

module.exports = include;

module.exports.__setModules = __setModules;
