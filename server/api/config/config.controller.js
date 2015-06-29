'use strict';
var config = require('../../config/environment');
var appdata = require('../../config/environment/' + config.appdata);
var fs = require('fs');
var wsh = require('../../components/webSocket/webSocketHandler.js');
var _ = require('lodash');
// Get list of configs
exports.index = function(req, res) {
  var resp = [];
  if (req.method === 'POST') {
    var q = req.body;
    if(req.query.acl === 'whitelist' ){
        if (!_.contains(appdata.users.wList, q.user)){
            appdata.users.wList.push(q.user);
            fs.writeFile('./server/config/environment/' + config.appdata, JSON.stringify(appdata), function(err){
                if(err){
                    console.log('error saving white list into appdata ', err);
                }
                //res.status(200).send({resp: 'query updated'});
                resp = {resp: 'user added'};
                res.json(resp);
            });
        }else{
            //user already in the acl
            resp = {resp: 'user already in acl'};
            res.json(resp);
        }
    }else{
        appdata.query = q.query;
        fs.writeFile('./server/config/environment/' + config.appdata, JSON.stringify(appdata), function(err){
            if(err){
                console.log('error saving query into appdata ', err);
            }
            // restart the twitter service to change the query
            resp = {resp: 'query updated'};
            res.json(resp);
        });
    }
  }else if(req.method === 'GET'){
    if (req.originalUrl === '/api/configs'){
      res.json(appdata);
    }
  }
};
