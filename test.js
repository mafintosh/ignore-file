var tape = require('tape')
var path = require('path')
var ignore = require('./')

tape('node_modules', function(t) {
  var filter = ignore.sync(path.join(__dirname, '.gitignore'))
  t.ok(filter('node_modules'))
  t.notOk(filter('meh'))
  t.end()
})

tape('index.js', function(t) {
  var filter = ignore.sync(path.join(__dirname, '.gitignore'))
  t.notOk(filter('index.js'))
  t.end()
})

tape('default value', function(t) {
  var filter = ignore.sync(path.join(__dirname, 'non-existing')) || ignore.compile('node_modules')
  t.ok(filter('node_modules'))
  t.notOk(filter('meh'))
  t.end()
})

tape('compile multiple lines', function(t) {
  var filter = ignore.compile('a\nb\nc')
  t.ok(filter('a'))
  t.ok(filter('b'))
  t.notOk(filter('d'))
  t.end()
})