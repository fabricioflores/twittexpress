'use strict';

var path = require('path');
var _ = require('lodash');
var fecha = '';

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server ip
  ip: process.env.IP || '127.0.0.1',

  //Serever consultTime
  consultTime: process.env.consultTime || 5,

  // WebSocketPort
  webSocketPort: process.env.WS_PORT || 4444,

  //Query
  //query:{
    //currentDate:new Date().toJSON().slice(0,10)
  //},

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'twittexpress-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

};

// Export the config object based on the NODE_ENV
// ==============================================
try{
  var credentials = require('./credentials.json') || {};
}catch(e){
  console.log('no credentials.');
  //prevent error in mocha test
  var credentials = require('./credentials.example.json')
}
all = _.merge(all, credentials);

module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
