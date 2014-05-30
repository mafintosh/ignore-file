var tape = require('tape')
var path = require('path')
var ignore = require('./')

tape('node_modules', function(t) {
  var filter = ignore.sync(path.join(__dirname, '.gitignore'))
  t.ok(filter('node_modules'))
  t.end()
})

tape('index.js', function(t) {
  var filter = ignore.sync(path.join(__dirname, '.gitignore'))
  t.notOk(filter('index.js'))
  t.end()
})