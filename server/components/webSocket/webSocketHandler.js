'use strict';

var config = require('../../config/environment');
var WebSocketServer = require('ws').Server;


module.exports = function(server){
  var wss = new WebSocketServer({ server: server });

  var connect = function(callback){
    wss.on('connection', function connection(ws) {
      callback(ws);
    });
  };

  var init = function(tweets){
    connect(function(ws){
      ws.on('message', function incoming(message) {
        console.log('server:', message);

        /*TODO:
         * - Discriminar el mensaje, que cosa nos llego? y que tenemos
         *   que hacer con esto?
         **/
        switch(message) {
            case 'case':
                // code
                break;
            case 'get_tweets':
                ws.send(JSON.stringify(getTweets()));
                break;

            default:
                // code
                break;
        }
        /*send tweets*/
        //ws.send(JSON.stringify(tweets));
      });

      /*
       * TODO: Instalar un interval para poder iterar x tiempo para
       * buscar los tweets
       * */
      //setInterval(collectTweetsFromTwitter, config.tiempo)
      //OJO que hay que poder cancelar este intervalo para que no se
      //quede pegado todo el tiempo.
    });
  };

  var collectTweetsFromTwitter = function(query, callback){

  };

  // Guardar los tweets en el disco en algun lado que nos diga config.store
  var saveTweetsToDisk = function(tweets){};

  var sendTweets = function(tweets){ /* basicamente usar ws.send stringifiado */ };

  /*PV TODO: get the stored tweets */
  var getTweets = function(){
    return [{'fix': 'me'}];
  };

  return {
    init: init
  }

};
