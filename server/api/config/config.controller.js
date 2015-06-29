'use strict';

var config = require('../../config/environment/query.json');
var fs = require('fs');

var _ = require('lodash');

// Get list of configs
exports.index = function(req, res) {
  var resp = [];
  if (req.method === 'POST') {
    var q = req.body;
    config.query = q.query;
    fs.writeFile('./server/config/environment/query.json', JSON.stringify(config), function(err){
      if(err){
        console.log('error saving query into config ', err);
      }
      // restart the twitter service to change the query
      resp = {resp: 'query updated'};
      res.json(resp);
    });
  }else if(req.method === 'GET'){
    if (req.originalUrl === '/api/configs'){
      res.json(config);
    }
  }
};
