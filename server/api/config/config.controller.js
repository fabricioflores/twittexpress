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
  if (req.method === 'POST') {
    var q = req.body;
    /*
     * switch(req.query.acl)
     *  case: whitelist:
     *     var lista = appdata.users.wList
     *  case: blacklist
     *     var lista = appdata.users.bList
     *  case: default: el query
     *
     * if(_.contains(lista, user)
     *   lista.push(user)
     *   resp = {}
     * else
     *
     * write una vez
     *
     * res.json( una vez )
     *
     * */
    if(req.query && req.query.acl === 'whitelist' ){
      // test with curl: curl -X POST -d '{"user":"panchovilla"}' localhost:9000/api/configs?acl=whitelist --header "Content-Type:application/json"
      // test with curl: curl -X POST -d '{"query":"#noalpapa"}' localhost:9000/api/configs --header "Content-Type:application/json"
      if (!_.contains(appdata.users.wList, q.user)){
        appdata.users.wList.push(q.user);
        fs.writeFile('./server/config/environment/' + config.appdata, JSON.stringify(appdata), function(err){
          if(err){
            console.log('error saving white list into appdata ', err);
          }
          resp = {resp: 'user added'};
          emiter.emit('updateacl', {'list': 'whitelist', 'user': q.user,
                     'action': 'add'});

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
            emiter.emit('reloadtweeter', appdata);
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
