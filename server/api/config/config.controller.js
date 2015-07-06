'use strict';
var config = require('../../config/environment');
var appdata = require('../../config/environment/' + config.appdata);
var fs = require('fs');
var _ = require('lodash');
//#var EventEmitter = require('events').EventEmitter;
//#var emiter = new EventEmitter();

// Get list of configs
exports.index = function(req, res) {
  var emiter = require('../../app').emiter;
  var resp = [];

  var saveUser = function(list, user) {
    if (!_.contains(list, user)){
      list.push(user); //appdata.users.wList
      fs.writeFile('./server/config/environment/' + config.appdata, JSON.stringify(appdata), function(err){
        if(err){
          console.log('error saving list into appdata ', err);
        }
        resp = {resp: 'user added'};
        res.json(resp);
        return true;
      });
    }else{
      //user already in the acl
      resp = {resp: 'user already in acl'};
      res.json(resp);
      return false;
    }
  }

  var removeUser = function(list, user) {
    if (_.contains(list, user)){
      //appdata.users.wList
      list = _.remove(list, function(n){
        return n === user;
      });
      fs.writeFile('./server/config/environment/' + config.appdata, JSON.stringify(appdata), function(err){
        if(err){
          console.log('error saving list into appdata ', err);
        }
        resp = {resp: 'user removed'};
        res.json(resp);
      });
      return true;
    }else{
      //user already in the acl
      resp = {resp: 'user not exists in acl'};
      res.json(resp);
      return false;
    }
  }

  var updateQuery = function(query) {
    appdata.query = query;
          fs.writeFile('./server/config/environment/' + config.appdata, JSON.stringify(appdata), function(err){
              if(err){
                  console.log('error saving query into appdata ', err);
              }
              // restart the twitter service to change the query
              emiter.emit('reloadtweeter', appdata);
              resp = {resp: 'query updated'};
              res.json(resp);
          });
  }

  if (req.method === 'POST') {
    var q = req.body;

    //HOTWO test in curl:
    //curl -X POST -d '{"user":"panchovilla"}' localhost:9000/api/configs?acl=whitelist --header "Content-Type:application/json"
    switch (req.query.acl) {
      case 'whitelist':
        if (req.query.action === 'add'){
          if (saveUser(appdata.users.wList, q.user)){
            emiter.emit('updateacl', {'list': req.query.acl, 'user': q.user,
                        'action': req.query.action});
          }
        }else if(req.query.action === 'remove'){
          if (removeUser(appdata.users.wList, q.user)){
          emiter.emit('updateacl', {'list': req.query.acl, 'user': q.user,
                      'action': req.query.action});
          }
        }
      break;

      case 'blacklist':
        if (req.query.action === 'add'){
          if (saveUser(appdata.users.bList, q.user)){
          emiter.emit('updateacl', {'list': req.query.acl, 'user': q.user,
                      'action': req.query.action});
          }
        }else if(req.query.action === 'remove'){
          if (removeUser(appdata.users.bList, q.user)){
          emiter.emit('updateacl', {'list': req.query.acl, 'user': q.user,
                      'action': req.query.action});
          }
        }
      break;

      default:
        updateQuery(q.query);
      break;
    }

  }else if(req.method === 'GET'){
    if (req.originalUrl === '/api/configs'){
      res.json(appdata);
    }
  }
};

exports.test = function(req, res) {
  var emiter = require('../../app').emiter;
  var tweet = {
    message: 'this is a tweet',
    user: {
      screen_name: 'someone'
    }
  };

  emiter.emit('testtweet', tweet);
  var resp = {resp: 'ok'};
  res.json(resp);
};

