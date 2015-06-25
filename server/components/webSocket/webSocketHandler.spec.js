/*jshint expr: true*/
'use strict';
var config = require('../../config/environment');
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var assert = chai.assert;
var websocketHandler = require('./webSocketHandler');
var fs = require('fs');
//var Twit = require('twit');
//var T = new Twit(config);


describe('Striped off websockethandler', function() {
  var tweets, tweet, stream, wshs, mockwss;

  beforeEach(function(done){
    //var websocketHandler = require('./webSocketHandler')(server);
    //sinon.stub(fs, 'exists').yields(true);
    tweets = [{timestamp: new Date().getTime()}, {timestamp: new Date().getTime()},
                  {timestamp: 12362716271}, {timestamp: 12362716123}];
    //sinon.stub(fs, 'readFile').yields(null, JSON.stringify(tweets));
    tweet = {message: 'good', user: {screen_name: 'patovala'}};
    config.query = '#copaAmerica';
    config.tweetlog = 'tweets-test.json';

    //stream = T.stream('statuses/filter', {
    //    track: config.query || '@patovala'
    //});
    stream = {on: function(msg, cb){cb(tweet);}};

    //spy = sinon.spy(fs, 'writeFile');
    mockwss = {on: function(m, cb){cb('get_tweets');}, send: function(){}};
    //sinon.mock(mockwss);
    sinon.stub(fs, 'exists').yields(true);
    sinon.stub(fs, 'readFile').yields(null, JSON.stringify(tweets));
    //sinon.stub(mockwss, 'on').yields(JSON.stringify(tweet));
    wshs = websocketHandler({server: 9000}, mockwss);
    done();

  });

  afterEach(function(done){
    //fs.writeFile.restore();
    fs.exists.restore();
    fs.readFile.restore();
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

      wshs.init(stream);
      var c = wshs.getConfig();
      assert.equal(c.port, '9000');
      assert.equal(c.ip, '127.0.0.1');
      assert.equal(c.consultTime, '5');
      done();
  });

  //que guardemos una lista de tweets en disco
  it('save the list of tweets to disk ', function(done) {
      var spy = sinon.spy(fs, 'writeFile');

      sinon.stub(stream, 'on').yields(tweet);
      wshs.init(stream);

      expect(mockwss.on).to.have.been.called;
      expect(stream.on).to.have.been.called;

      tweets.push(tweet);
      //console.log('TWEETS:', tweets);
      assert(spy.calledWith('tweets-test.json', JSON.stringify(tweets)),
             'the fs.writeFile function was called incorrectly');
      fs.writeFile.restore();
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
      var spy = sinon.spy(mockwss, 'send');
      wshs.init(stream);
      sinon.stub(mockwss, 'on').yields('get_tweets');

      expect(fs.exists).to.have.been.called;
      expect(fs.readFile).to.have.been.called;

      //expect(tweet_list.length).to.equal(2);
      assert(spy.calledWith(JSON.stringify(tweets.slice(0,2))), 'Not expected tweets');
      done();

  });
});
