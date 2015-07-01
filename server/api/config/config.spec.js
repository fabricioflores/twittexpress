'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var fs = require('fs');

describe('GET /api/configs', function() {

  it('should respond with JSON Object', function(done) {
    request(app)
      .get('/api/configs')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});

/*
 * salvar las configuraciones y reiniciar
 *       los servicios
 **/
describe('POST /api/configs', function() {

  beforeEach(function(done){
    // create an empty config
    var appdata = {"users":{"wList":["patovala","ingemurdok","lmejia"],"bList":["ingemurdok"]},"query":"#mundial2018"};
    fs.writeFile('./server/config/environment/appdata-test.json', JSON.stringify(appdata), done);
  });

  afterEach(function(done){
    // restore the config
    var appdata = {"users":{"wList":["patovala","ingemurdok","lmejia"],"bList":["ingemurdok"]},"query":"#mundial2018"};
    fs.writeFile('./server/config/environment/appdata-test.json', JSON.stringify(appdata), done);
  });

  it('should save the config locally', function(done) {
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
        // The response is a JSON already
        var response = res.body;
        response.resp.should.equal('query updated');
        //TODO: test emiter to have been called
        done();
      });
  });

  /*
   * We need to check if ACL works, this test is for
   *       checking if addWhiteListUser works
   **/
  it('should not allow a repeated user', function(done) {
    request(app)
      .post('/api/configs?acl=whitelist')
      .set('Content-Type', 'application/json')
      .send({user: 'lmejia'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err){
            console.log('error in /api/configs?acl=whitelist ', err);
        }
        res.body.resp.should.equal('user already in acl');
        done();
      });
  });

  /*
   * We need to check if ACL works, this test is for
   *       checking if addWhiteListUser works
   **/
  it('should accept new users', function(done) {
    request(app)
      .post('/api/configs?acl=whitelist')
      .set('Content-Type', 'application/json')
      .send({user: 'newuser'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err){
            console.log('error in /api/configs?acl=whitelist ', err);
        }
        res.body.resp.should.equal('user added');
        done();
      });
  });
});
