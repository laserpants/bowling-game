'use strict';

require('./index.html');
var Elm = require('./src/Main.elm').Elm;

Elm.Main.init({ 
  node: document.getElementById('elm-code'),
  flags: { 
    api: 'http://localhost:4399' 
  }
});
