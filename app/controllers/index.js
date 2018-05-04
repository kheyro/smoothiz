const fs = require('fs');

let fileName;
const controllers = {};

fs.readdirSync(__dirname).forEach(function(file) {
  if (file === "index.js") return;
  fileName = file.substr(0, file.indexOf('.'));
  controllers[fileName] = require('./' + fileName);
});

module.exports = controllers;