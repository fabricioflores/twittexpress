'use strict';

describe('Test websocket', function () {

  var runWebSocket,
      $websocket,
      CONFIG,
      twittexpressMain;

  beforeEach(module('twittexpressApp'));

  beforeEach(inject(function (_$websocket_, _CONFIG_) {

    $websocket = _$websocket_;
    CONFIG = _CONFIG_;
    twittexpressMain = angular.module('twittexpressApp');
    runWebSocket = twittexpressMain._runBlocks.shift();

  }));

  it('Should $open', function() {
    spyOn($websocket, '$new').andReturn({$on: jasmine.createSpy('$on')});
    runWebSocket($websocket, CONFIG);
    expect($websocket.$new().$on).toHaveBeenCalledWith('$open', jasmine.any(Function));
  });


});
