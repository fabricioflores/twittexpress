'use strict';

var config = require('../../config/environment/query.json');
var fs = require('fs');

var _ = require('lodash');

// Get list of configs
exports.index = function(req, res) {
  if (req.method == 'POST') {
    console.log('config actual:', config);
    var q = req.body;
    config.query = q.query;
    fs.writeFile('../../config/environment/query.json', JSON.stringify(config), function(err){
      if(err){
        console.log('murio');
      }
      res.status(200).send({resp: 'query updated'});
    });
  }
  res.json([]);
};
