'use strict';

describe('Test websocket', function () {


    var runWebSocket,
        $websocket,
        CONFIG,
        mockConf,
        twittexpressMain,
        ws;

    beforeEach(module('twittexpressApp'));

    beforeEach(inject(function (_$websocket_, _CONFIG_) {

      $websocket = _$websocket_;
      CONFIG = _CONFIG_;
      twittexpressMain = angular.module('twittexpressApp');
      runWebSocket = twittexpressMain._runBlocks.shift();
      mockConf = {
          openTimeout     : 0,
          messageInterval : 100,
          fixtures        : {
            'get_init_tweets'  : {
              event:'init_tweets',
              data: {
                'statuses':[
                  {
                    "id": 250075927172759551,
                    "text": "text tweet 1"
                  },
                  {
                    "id": 250075927172759552,
                    "text": "text tweet 2"
                  },
                  {
                    "id": 250075927172759553,
                    "text": "text tweet 3"
                  },
                  {
                    "id": 250075927172759554,
                    "text": "text tweet 4"
                  },
                  {
                    "id": 250075927172759555,
                    "text": "text tweet 5"
                  },
                  {
                    "id": 250075927172759556,
                    "text": "text tweet 6"
                  },
                  {
                    "id": 250075927172759557,
                    "text": "text tweet 7"
                  },
                  {
                    "id": 250075927172759558,
                    "text": "text tweet 8"
                  },
                  {
                    "id": 250075927172759559,
                    "text": "text tweet 9"
                  },
                  {
                    "id": 250075927172759560,
                    "text": "text tweet 10"
                  }
                ],
                "search_metadata":{
                  "count": 10,
                  "query": "%23freebandnames"
                }
              }
            },
            'get_new_tweets'   : {
              event:'new_tweets',
              data: {
                "statuses":[
                  {
                    "id": 250075927172759561,
                    "text": "text new tweet 1"
                  },
                  {
                    "id": 250075927172759562,
                    "text": "text new tweet 2"
                  },
                  {
                    "id": 250075927172759563,
                    "text": "text new tweet 3"
                  },
                  {
                    "id": 250075927172759564,
                    "text": "text new tweet 4"
                  },
                  {
                    "id": 250075927172759565,
                    "text": "text new tweet 5"
                  },
                  {
                    "id": 250075927172759566,
                    "text": "text new tweet 6"
                  },
                  {
                    "id": 250075927172759567,
                    "text": "text new tweet 7"
                  },
                  {
                    "id": 250075927172759568,
                    "text": "text new tweet 8"
                  },
                  {
                    "id": 250075927172759569,
                    "text": "text new tweet 9"
                  },
                  {
                    "id": 250075927172759570,
                    "text": "text new tweet 10"
                  }
                ],
                "search_metadata":{
                  "count": 10,
                  "query": "%23freebandnames"
                }
              }
            },
            'get_tweet'            : {
                event:'tweet',
                data:{
                  "id": 250075927172759570,
                  "text": "a tweet"
                }
            }
          }
      }

    }));

  iit('Should $open', function() {
    spyOn($websocket, '$new').andReturn({$on: jasmine.createSpy('$on')});
    runWebSocket($websocket,CONFIG);
    expect($websocket.$new().$on).toHaveBeenCalledWith('$open', jasmine.any(Function));
  });


});
