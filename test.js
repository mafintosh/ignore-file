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

tape('compile multiple lines with \\r', function(t) {
  var filter = ignore.compile('a\r\nb\nc\r\nd');
  t.ok(filter('a'))
  t.ok(filter('b'))
  t.ok(filter('c'))
  t.ok(filter('d'))
  t.notOk(filter('e'))
  t.end()
})

tape('gitignore glob style', function(t) {
  var filter = ignore.compile('test')
  t.ok(filter('test'))
  t.ok(filter('foo/test'))
  t.ok(filter('test/foo'))
  t.ok(filter('bar/test/foo'))
  t.end()
})

tape('trailing slashes', function(t) {
  var filter = ignore.compile('test/')
  t.ok(filter('test'))
  t.ok(filter('test/'))
  t.ok(filter('foo/test'))
  t.ok(filter('test/foo'))
  t.ok(filter('bar/test/foo'))
  t.end()
})

tape('gitignore inverse style', function(t) {
  var filter = ignore.compile('test\n!foo/test')
  t.ok(filter('test'))
  t.notOk(filter('foo/test'))
  t.ok(filter('test/foo'))
  t.ok(filter('bar/test/foo'))
  t.end()
})

tape('gitignore anchored', function(t) {
  var filter = ignore.compile('/test')
  t.ok(filter('test'))
  t.notOk(filter('foo/test'))
  t.end()
})

tape('comments', function(t) {
  var filter = ignore.compile('#test')
  t.notOk(filter('test'))
  t.notOk(filter('foo/test'))
  t.end()
})
