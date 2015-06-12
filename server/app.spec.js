'use strict';

var app = require('./app');
var WebSocket = require('ws');
var config = require('./config/environment');
var server = require('http').createServer(app);
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
var websocketHandler = require('./components/webSocket/webSocketHandler')(server);
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var assert = chai.assert;
var request = require('supertest');

chai.use(sinonChai);

describe('Server websocket', function() {

  var tweets;
  var ws;

  beforeEach(function(done){

    ws = new WebSocket('ws://localhost:9000');

    ws.on('open', function open() {
      ws.send('something');

    });

    ws.on('message', function(data) {
      console.log('client:',data);
      done();
    });

  });

  /*
   * QUe hace esto? y que deberia hacer
   * Cuando levanta la conexión deberia probar:
   * - verificar que levante una config con parametros del server
   *   params: wsport, wsip, tiempos de consulta 15 * 60 / 180 por defecto,
   *           tipo de consulta en general (hoy por defecto, ultimos n,
   *           desde x fecha)
   * */
  it.only('should open connection', function(done) {

    var spy = sinon.spy(websocketHandler, "init");

    websocketHandler.init({
      data:'un dato',
      data2:'otro dato'
    });
    assert.isTrue(spy.called);
    done();
  });

  /*
   * testear:
   * - que podamos enviar la lista de recolectados
   * - que guardemos una lista de tweets en disco
   * - verificar que el server esta consultando a tweeter de acuerdo al API
   *   y a las opciones de configuracion
   * - que permita enviar una config especifica a todos y a cada server
   **/

});
