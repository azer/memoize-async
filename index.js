module.exports = memoize;

function memoize(fn, hash){
  var mem = {}, queues = {};

  !hash && ( hash = function(n){ return n; });

  return function(){

    var args     = Array.prototype.slice.call(arguments),
        key      = hash.apply(undefined, args),
        callback = args.pop();

    if( key in mem ){
      callback.apply(undefined, mem[ key ]);
      return;
    }

    if( key in queues){
      queues[key].push(callback);
      return;
    }

    queues[key] = [callback];

    args.push(function(error/*,  result */){

      !error && ( mem[ key ] = arguments );

      run(queues[key], arguments);

      delete queues[key];

    });

    fn.apply(undefined, args);

  };
};

function run(callbacks, args){

  var i = callbacks.length;

  while( i -- ){

    try {
      callbacks[i].apply(undefined, args);
    } catch(err){
      process.nextTick(function(){
        throw err;
      });
    }

  }

}
