'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/pbshows', function() {

  it('should have slides when called', function(done) {
    request(app)
      .get('/api/pbshows')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.slides.should.be.instanceof(Array);
        done();
      });
  });
});
