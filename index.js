var minimatch = require('minimatch')
var fs = require('fs')

var ignore = function(filename, def, cb) {
  if (typeof def === 'function') return ignore(filename, null, def)
  fs.readFile(filename, 'utf-8', function(err, src) {
    if (err && err.code !== 'ENOENT') return cb(err)
    if (err) return cb(null, null)
    cb(null, ignore.compile(src))
  })
}

ignore.compile = function(src) {
  src = src.trim()

  var lines = src ? src.split('\n') : []
  if (!lines.length) return function() { return false }

  return lines
    .map(function(line) {
      var m = new minimatch.Minimatch(line.trim())
      return function(filename) {
        return m.match(filename)
      }
    })
    .reduce(function(a, b) {
      return function(filename) {
        return a.match(filename) || b.match(filename)
      }
    })
}

ignore.sync = function(filename, def) {
  try {
    return ignore.compile(fs.readFileSync(filename, 'utf-8'))
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    return null
  }
}

module.exports = ignore