module.exports.normalizeProp = name =>
  name
    .replace(/([A-Z])/g, '.$1')
    .replace(/[-_.]+/g, ' ')
    .trim()
    .toLowerCase();

module.exports.isObject = value => {
  const type = typeof value;
  return value != null && type === 'object';
};
