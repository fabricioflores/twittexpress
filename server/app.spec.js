/*jshint expr: true*/
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
//var request = require('supertest');
var Twit = require('twit');
//var T = new Twit(config);
var fs = require('fs');

chai.use(sinonChai);

describe('Server websocket', function() {

  var ws, tweets, spy;

  beforeEach(function(done){

    ws = new WebSocket('ws://localhost:9000');

    ws.on('open', function open() {
      //ws.send('something');
      console.log('Abriendo el websocket desde el spec:');
      done();
    });

    sinon.stub(fs, 'exists').yields(true);
    tweets = [{timestamp: new Date().getTime()}, {timestamp: new Date().getTime()},
                  {timestamp: 12362716271}, {timestamp: 12362716123}];
    sinon.stub(fs, 'readFile').yields(null, JSON.stringify(tweets));

    spy = sinon.spy(Twit.prototype, 'stream')

    //config for test if we get a query
    config.query = '#copaAmerica';
  });

  afterEach(function(done){
    fs.exists.restore();
    fs.readFile.restore();
    Twit.prototype.stream.restore();
    done();
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

    //var spy = sinon.spy(ws, 'on');
    //ws.should.have.property('url');
    websocketHandler.init({});
    var c = websocketHandler.getConfig();
    assert.equal(c.port, '9000');
    //expect(c.wsport).toEqual(4444);
    done();
  });



  /*
   * testear:
   * - que guardemos una lista de tweets en disco
   * - verificar que el server esta consultando a tweeter de acuerdo al API
   *   y a las opciones de configuracion
   * - que permita enviar una config especifica a todos y a cada server
   **/

  /* - que podamos enviar la lista de recolectados por defecto quiero
  * que sean los de este dia*/
  it('get the list of collected tweets from the server', function(done) {
      var tweet_list;

      ws.on('message', function(data) {
          var tweet_list = JSON.parse(data);

          expect(fs.exists).to.have.been.called;
          expect(fs.readFile).to.have.been.called;
          expect(tweet_list.length).to.equal(2);
          done();
      });

      websocketHandler.init();
      ws.send('get_tweets');
  });

  /* test we have our own query when we send it using config */
  it('change the query', function(done) {
      config.query = '#copaAmerica';

      //var tweet_list;
      ws.on('message', function(data) {
          var tweet_list = JSON.parse(data);

          expect(tweet_list.length).to.equal(2);
          expect(Twit.prototype.stream).to.have.been.calledWith(
              'statuses/filter', {track: "#copaAmerica"});

          done();
      });

      websocketHandler.init();
      ws.send('get_tweets');
  });

});
