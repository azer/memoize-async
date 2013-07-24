## memoize-async [![Build Status](https://travis-ci.org/azer/memoize-async.png?branch=master)](https://travis-ci.org/azer/memoize-async)

Async function memoizer.

### Install

```bash
$ npm install memoize-async
```

### Usage

```js
memoize  = require('memoize-async')
readFile = require('fs').readFile
memoized = memoize(readFile)

memoized('docs/readme', console.log)
// doing some work
// => read me first!

memoized('docs/readme', console.log)
// => read me first!
```

