'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/configs', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/configs')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

/*
 * TODO: salvar las configuraciones y reiniciar
 *       los servicios
 **/
describe('POST /api/configs', function() {

  it.only('should save the config locally', function(done) {
    request(app)
      .post('/api/configs')
      .set('Content-Type', 'application/json')
      .send({query: '#mundial2018'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err){
            console.log('error in /api/configs');
            return done(err);
        }
        console.log(res.body);
        res.body.should.equal('{resp:"query updated"}');
        done();
      });
  });
});

/*
 * TODO: We need to check if ACL works, this test is for
 *       checking if addWhiteListUser works
 **/
describe('POST /api/configs', function() {

  it('should save the config locally', function(done) {
    request(app)
      .post('/api/configs?acl=whitelist')
      .set('Content-Type', 'application/json')
      .send({user: 'patovala'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err){
            console.log('error in /api/configs?acl=whitelist');
            return done(err);
        }
        console.log(res.body);
        res.body.should.equal('{resp: "user added"}');
        done();
      });
  });
});
