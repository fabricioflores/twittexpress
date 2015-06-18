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
var currentDate=new Date();
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
      //console.log('Abriendo el websocket desde el spec:');
      done();
    });

    sinon.stub(fs, 'exists').yields(true);
    tweets = [{timestamp: new Date().getTime()}, {timestamp: new Date().getTime()},
                  {timestamp: 12362716271}, {timestamp: 12362716123}];
    sinon.stub(fs, 'readFile').yields(null, JSON.stringify(tweets));

    sinon.stub(fs, 'writeFile').yields(null);

    spy = sinon.spy(Twit.prototype, 'stream');

    //config for test if we get a query
    config.query = '#copaAmerica';
  });

  afterEach(function(done){
    fs.exists.restore();
    fs.readFile.restore();
    fs.writeFile.restore();
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

    websocketHandler.init({});
    var c = websocketHandler.getConfig();
    assert.equal(c.port, '9000');
    assert.equal(c.ip, '127.0.0.1');
    assert.equal(c.consultTime, '5');
   // assert.equal(c.query.currentDate, new Date().toJSON().slice(0,10));
    done();
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


describe('Test part 2', function() {

  var ws, tweets, spy_stream, spy, tweet;

  beforeEach(function(done){

    ws = new WebSocket('ws://localhost:9000');

    ws.on('open', function open() {
     // ws.send('something');
      console.log('Abriendo el websocket desde el spec:');
      done();
    });

    sinon.stub(fs, 'exists').yields(true);

    tweets = [{timestamp: new Date().getTime()}, {timestamp: new Date().getTime()},
                  {timestamp: 12362716271}, {timestamp: 12362716123}];

    sinon.stub(fs, 'readFile').yields(null, JSON.stringify(tweets));

    tweet = {message: 'good'};

    spy_stream = sinon.spy(Twit.prototype, 'stream');

    spy = sinon.spy(fs, 'writeFile');

  });

  afterEach(function(done){
    fs.exists.restore();
    fs.readFile.restore();
    fs.writeFile.restore();
    Twit.prototype.stream.restore();
    done();
  });

  //que guardemos una lista de tweets en disco
  it('save the list of tweets to disk ', function(done) {
      websocketHandler.init();
      //var tweet = {message: 'new tweet arrived'};
      //websocketHandler.processTweet(tweet);
      var tweet_trigger = spy_stream.returnValues[0];

      console.log('debug:', tweet_trigger);

      sinon.stub(tweet_trigger, 'on').yields(tweet);

      //expect(tweets.length).to.equal(5);
      //expect(fs.writeFile).to.have.been.called;
      expect(Twit.prototype.stream).to.have.been.called;
      done();
  });

});
