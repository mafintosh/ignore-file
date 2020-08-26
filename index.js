var minimatch = require('minimatch')
var fs = require('fs')

var toRegExp = function(pattern) {
  // remove trailing slashes
  if (pattern.substr(-1) === '/') {
    pattern = pattern.substr(0, pattern.length - 1)
  }

  var i = pattern.indexOf('/')

  if (i === -1 || i === pattern.length-1) {
    pattern = minimatch.makeRe(pattern, {dot:true}).toString()
      .replace(/^\/\^/, '/(^|\\/)')
      .replace(/\$\/$/, '($|\\/)/')
    return new RegExp(pattern.slice(1,-1), 'i')
  }

  if (i === 0) pattern = pattern.slice(1)

  return minimatch.makeRe(pattern, {dot:true, nocase:true})
}

var falsy = function() {
  return false
}

var toFunction = function(regexp) {
  return function(input) {
    return regexp.test(input)
  }
}

var or = function(a, b) {
  if (a === falsy) return b
  return function(input) {
    return a(input) || b(input)
  }
}

var ignore = function(filename, def, cb) {
  if (typeof def === 'function') return ignore(filename, null, def)
  fs.readFile(filename, 'utf-8', function(err, src) {
    if (err && err.code !== 'ENOENT') return cb(err)
    if (err) return cb(null, null)
    cb(null, ignore.compile(src))
  })
}

ignore.compile = function(src) {
  if (Array.isArray(src)) src = src.join('\n')

  var lines = src.split('\n')
    .map(function(line) {
      return line.trim()
    })
    .filter(function(line) {
      return line && line[0] !== '#'
    })

  var negative = lines
    .filter(function(line) {
      return line[0] !== '!'
    })
    .map(toRegExp)
    .map(toFunction)
    .reduce(or, falsy)

  var positive = lines
    .filter(function(line) {
      return line[0] === '!'
    })
    .map(function(line) {
      return line.slice(1)
    })
    .map(toRegExp)
    .map(toFunction)
    .reduce(or, falsy)

  return function(input) {
    return !positive(input) && negative(input)
  }
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