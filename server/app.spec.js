'use strict';

var app = require('./app');
var websocket = require('./websocket/startWebSocket');
var should = require('should');
var sinon = require('should-sinon');
var request = require('supertest');

describe('Server websocket', function() {

  var tweets;

  beforeEach(function(done){
    tweets = {
       "data": {
          "statuses":[
          {
            "id": 250075927172759561,
            "text": "text new tweet 1"
          },
          {
            "id": 250075927172759562,
            "text": "text new tweet 2"
          },
          {
            "id": 250075927172759563,
            "text": "text new tweet 3"
          },
          {
            "id": 250075927172759564,
            "text": "text new tweet 4"
          },
          {
            "id": 250075927172759565,
            "text": "text new tweet 5"
          },
          {
            "id": 250075927172759566,
            "text": "text new tweet 6"
          },
          {
            "id": 250075927172759567,
            "text": "text new tweet 7"
          },
          {
            "id": 250075927172759568,
            "text": "text new tweet 8"
          },
          {
            "id": 250075927172759569,
            "text": "text new tweet 9"
          },
          {
            "id": 250075927172759570,
            "text": "text new tweet 10"
          }
        ],
        "search_metadata":{
          "count": 10,
          "query": "%23freebandnames"
        }
      }
    }

    done();

  });

  it('should open connection', function(done) {

    console.log('valor:',sinon);
    var callback = sinon.spy();
      var obj = {};
      callback.call(obj);
      callback.should.be.alwaysCalledOn(obj);

    done();
  });


});
