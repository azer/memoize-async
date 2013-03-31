## memoize-async

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

![](https://dl.dropbox.com/s/9q2p5mrqnajys22/npmel.jpg?token_hash=AAHqttN9DiGl63ma8KRw-G0cdalaiMzrvrOPGnOfDslDjw)
