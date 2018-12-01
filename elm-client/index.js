'use strict';

require('./index.html');
var Elm = require('./src/Main.elm').Elm;

Elm.Main.init({ 
  node: document.getElementById('elm-code'),
  flags: { 
    api: process.env.API_URL || 'http://localhost:4399' 
  }
});
