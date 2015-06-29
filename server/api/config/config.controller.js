'use strict';
var config = require('../../config/environment/query.json');
var fs = require('fs');
var wsh = require('../../components/webSocket/webSocketHandler.js');
var _ = require('lodash');
// Get list of configs
exports.index = function(req, res) {
  var resp = [];
  var q = req.body;
  if (req.method === 'POST') {
    if(req.query.acl === 'whitelist' ){
      if (_.contains(config.users.wList, q.user)){
        fs.writeFile('./server/config/environment/query.json', JSON.stringify(config), function(err){
        if(err){
        console.log('murio ', err);
        }
        //res.status(200).send({resp: 'query updated'});
        resp = {resp: 'user added'};
        res.json(resp);
        });
      }else{
        config.users.wList.push(q.user);
        fs.writeFile('./server/config/environment/query.json', JSON.stringify(config), function(err){
        if(err){
        console.log('murio ', err);
      }
      //res.status(200).send({resp: 'query updated'});
      resp = {resp: 'user added'};
      res.json(resp);
    });
    }
    }else{
    config.query = q.query;
    fs.writeFile('./server/config/environment/query.json', JSON.stringify(config), function(err){
      if(err){
        console.log('murio ', err);
      }
      //res.status(200).send({resp: 'query updated'});
      resp = {resp: 'query updated'};
      res.json(resp);
    });
  }
  }
};
