'use strict';

var app = require('./app');
var WebSocket = require('ws');
var config = require('./config/environment');
var websocketHandler = require('./components/webSocket/webSocketHandler')();
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var request = require('supertest');

chai.use(sinonChai);

describe('Server websocket', function() {

  var tweets;
  var ws;

  beforeEach(function(done){

    ws = new WebSocket('ws://localhost:4444');

    ws.on('open', function open() {
      ws.send('something');

    });

    ws.on('message', function(data) {
      console.log('client:',data);
      done();
    });

  });

  it.only('should open connection', function(done) {

    var spy = sinon.spy(websocketHandler, "onStartWS");

    websocketHandler.onStartWS({
      data:'un dato',
      data2:'otro dato'
    });

    expect(spy.called).to.be.true;

    done();
  });


});
