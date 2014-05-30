# ignore-file

Compile an ignore file (similar to .gitignore) to a Javascript function that returns `true` or `false` given a filename

```
npm install ignore-file
```

[![build status](http://img.shields.io/travis/mafintosh/ignore-file.svg?style=flat)](http://travis-ci.org/mafintosh/ignore-file)

## Usage

Assuming you have a `.gitignore` file in your current working directory that contains `node_modules` do

``` js
var ignore = require('ignore-file')

ignore('.gitignore', function(err, filter) {
  if (err) throw err
  console.log(filter('index.js'))     // returns false
  console.log(filter('node_modules')) // returns true
})
```

You can also use `ignore.sync(filename)` to synchroniously compile an ignore file
If the file doesn't exist `null` is returned. This allows you easily implement fallbacks

``` js
var filter = ignore.sync('.npmignore') || ignore.sync('.gitignore') || ignore.compile('node_modules')
```

The above will use `.npmignore` if it exists, else `.gitignore` and finally just ignore all `node_modules` folders

## License

MIT