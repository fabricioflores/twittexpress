'use strict';

var app = require('./app');
var WebSocket = require('ws');
var config = require('./config/environment');
var server = require('http').createServer(app);
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
var websocketHandler = require('./components/webSocket/webSocketHandler')(server);
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var assert = chai.assert;
var request = require('supertest');
var currentDate=new Date();
var Twitter = require('twitter-node-client').Twitter;
chai.use(sinonChai);

function zfill(num, len) {return (Array(len).join("0") + num).slice(-len);}

describe('Server websocket', function() {

  var tweets;
  var ws;


  beforeEach(function(done){

    ws = new WebSocket('ws://localhost:9000');

    ws.on('open', function open() {
     // ws.send('something');
      console.log('Abriendo el websocket desde el spec:');
      done();
    });
  });

  /*
   * QUe hace esto? y que deberia hacer
   * Cuando levanta la conexión deberia probar:
   * - verificar que levante una config con parametros del server
   *   params: wsport, wsip, tiempos de consulta 15 * 60 / 180 por defecto,
   *           tipo de consulta en general (hoy por defecto, ultimos n,
   *           desde x fecha)
   * */
  it('should open connection', function(done) {

    websocketHandler.init({});
    var c = websocketHandler.getConfig();
    assert.equal(c.port, '9000');
    assert.equal(c.ip, '127.0.0.1');
    assert.equal(c.consultTime, '5');
    assert.equal(c.query.currentDate, new Date().toJSON().slice(0,10));
    done();
  });
  //que guardemos una lista de tweets en disco
  it.only('save the list of tweets on the disk ', function(done) {
    var tweet_list;
     ws.on('message', function() {

      assert.equal(websocketHandler.saveTweetsToDisk(), true);
      done();
    });
        websocketHandler.init({});
    ws.send('saveTweetsToDisks');
  });

 /*
   * testear:
   * -
   * - verificar que el server esta consultando a tweeter de acuerdo al API
   *   y a las opciones de configuracion
   * - que permita enviar una config especifica a todos y a cada server
   **/

  /* - que podamos enviar la lista de recolectados por defecto quiero
  * que sean los de este dia*/

  it('get the list of collected tweets from the server', function(done) {
      /*
       * We need to mock with sinon what we are asking twitter to do
       * */
      sinon.stub(Twitter.prototype, 'getSearch', function(o, success, error) {
          var today = new Date();
          var since = today.getFullYear() + '-' +
                      zfill(today.getMonth() + 1, 2) + '-' +
                      zfill(today.getDate(), 2);
          expect(o.q).to.equal('@patovala since: ' + since);
      });

      var tweet_list;
      ws.on('message', function(data) {
          tweet_list = JSON.parse(data);

          expect(data).to.equal('[{"fix":"me"}]');
          done();
      });

      websocketHandler.init({});
      ws.send('get_tweets');
  });

});
