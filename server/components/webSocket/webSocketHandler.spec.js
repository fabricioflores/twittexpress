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

    mockwss = {on: function(m, cb){cb('get_tweets');}, send: function(){}};
    //sinon.mock(mockwss);
    sinon.stub(fs, 'exists').yields(true);
    sinon.stub(fs, 'readFile').yields(null, JSON.stringify(tweets));
    //sinon.stub(mockwss, 'on').yields(JSON.stringify(tweet));
    wshs = websocketHandler({server: 9000}, mockwss);
    done();

  });

  afterEach(function(done){
    fs.exists.restore();
    fs.readFile.restore();
    fs.exists('tweets-test.json', function(exists){
        if(exists) {
            fs.unlinkSync('tweets-test.json');
        }
    });
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

      wshs.addWhiteListUser('patovala');
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
      wshs.addWhiteListUser('patovala');
      wshs.init(stream);
      sinon.stub(mockwss, 'on').yields('get_tweets');

      expect(fs.exists).to.have.been.called;
      expect(fs.readFile).to.have.been.called;

      //expect(tweet_list.length).to.equal(2);
      assert(spy.calledWith(JSON.stringify(tweets.slice(0,2))), 'Not expected tweets');
      done();

  });

  /*
   * Test the acl, this is only one user allowed [patovala]
   * */
  it('should forward an incomming tweet from user in white list', function() {
    var acl = {wList: ['patovala','ingemurdok','darwingualito'], bList: ['ingemurdok']};

    var whitetweet = {'message': 'ok', 'user': {'screen_name': 'patovala'}};
    var spy = sinon.spy(mockwss, 'send');

    wshs.addWhiteListUser('patovala');
    sinon.stub(stream, 'on').yields(whitetweet);
    wshs.init(stream);

    assert(spy.calledWith(whitetweet), 'not expected tweet');

  });

  it('should forward an incomming tweet and discriminate it by * user in white list and * user in blackList', function() {
    var acl = {wList: ['patovala','ingemurdok','darwingualito'], bList: ['ingemurdok']};

    var whitetweet = {'message': 'ok', 'user': {'screen_name': 'algo'}};
    var spy = sinon.spy(mockwss, 'send');

    wshs.addWhiteListUser('patovala');
    wshs.addWhiteListUser('*');
    wshs.addBlackListUser('*');
    sinon.stub(stream, 'on').yields(whitetweet);
    wshs.init(stream);

    assert(spy.neverCalledWith(whitetweet), 'not expected tweet');

  });

  it('Deny all tweets by * user in blackList', function() {

    var whitetweet = {'message': 'ok', 'user': {'screen_name': 'patovala'}};
    var spy = sinon.spy(mockwss, 'send');

    wshs.addWhiteListUser('patovala');
    wshs.addBlackListUser('*');
    sinon.stub(stream, 'on').yields(whitetweet);
    wshs.init(stream);

    assert(spy.neverCalledWith(whitetweet), 'not expected tweet');

  });

  it('Deny a user tweet if user is in white and blackList at same time', function() {

    var whitetweet = {'message': 'ok', 'user': {'screen_name': 'patovala'}};
    var spy = sinon.spy(mockwss, 'send');

    wshs.addWhiteListUser('patovala');
    wshs.addBlackListUser('patovala');
    sinon.stub(stream, 'on').yields(whitetweet);
    wshs.init(stream);

    assert(spy.neverCalledWith(whitetweet), 'not expected tweet');

  });

  it('Allow a user tweet only if user is in whiteList', function() {

    var whitetweet = {'message': 'ok', 'user': {'screen_name': 'user123'}};
    var spy = sinon.spy(mockwss, 'send');

    wshs.addWhiteListUser('user123');
    sinon.stub(stream, 'on').yields(whitetweet);
    wshs.init(stream);

    assert(spy.calledWith(whitetweet), 'not expected tweet');

  });

});
