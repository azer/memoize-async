var memoize = require("./");

it('memoizes functions with callbacks', function(done){
  var cached, memoized;

  cached   = [];
  memoized = memoize(work);

  asyncExpect(memoized, 10, 20);
  asyncExpect(memoized, 10, 20);
  asyncExpect(memoized, 20, 30);
  asyncExpect(memoized, 20, 30);

  process.nextTick(done);

  function work(n, callback){
    expect(cached).to.not.include(n);
    cached.push(n);

    process.nextTick(function(){
      callback(undefined, n + 10);
    });
  }

  function asyncExpect(fn, n, expected){
    fn(n, function(error, result){
      expect(result).to.equal(expected);
    });
  }
});

it('may work with a function that takes no parameter', function(done){
  var memoized = memoize(now);
  var ref = Date.now();

  memoized(function (error, ts) {
    expect(ts).to.not.below(ref);
    done();
  });

  function now (callback) {
    callback(undefined, Date.now());
  }
});


it('takes a hasher function optionally', function(){
  var cached, memoized;

  cached   = [];
  memoized = memoize(work, hasher);

  asyncExpect(memoized, ['hello', 'world'], 'hello, world');
  asyncExpect(memoized, ['hello', 'world'], 'hello, world');
  asyncExpect(memoized, ['hello', 'kitty'], 'hello, kitty');
  asyncExpect(memoized, ['hello', 'kitty'], 'hello, kitty');

  function asyncExpect(fn, args, expected){
    function cb(error, result){
      expect(result).to.equal(expected);
    };

    fn.apply(undefined, args.concat([cb]));
  }

  function hasher(first, last){
    return first + ', ' + last;
  }

  function work(first, last, callback){
    var result = first + ', ' + last;
    expect(cached).to.not.include(result);
    cached.push(result);
    callback(undefined, result);
  }
});

it('optionally takes read & write methods for storage', function(done){
  var now = memoize(callNow, { read: read, write: write });
  var mem = {};
  var ref = Date.now();

  now(0, function (error, ts) {
    expect(ts).to.be.above(ref);
    expect(mem['0'][1]).to.equal(ts);

    now(1, function (error, ts) {
      expect(ts).to.be.above(ref);
      expect(mem['1'][1]).to.equal(ts);
      done();
    });
  });

  function callNow (n, callback) {
    setTimeout(function () {
      callback(undefined, Date.now() + n);
    }, 100);
  }

  function read (key, callback) {
    if (key in mem) return callback(undefined, mem[key]);
    callback(true);
  }

  function write (key, value, callback) {
    mem[key] = value;
    callback();
  }

});
