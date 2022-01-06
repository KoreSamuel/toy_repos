'use strict';

function chunkMain () {
  Promise.resolve().then(function () { return require('./foo-6455b2a9.js'); }).then(({ default: foo }) => console.log(foo));
}

module.exports = chunkMain;
