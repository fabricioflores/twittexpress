'use strict';

describe('Service: tweetservice', function () {

  // load the service's module
  beforeEach(module('twittexpressApp'));

  // instantiate service
  var tweetservice, $websocket, mockConf, scope;

  beforeEach(inject(function (_tweetservice_, _$websocket_, $rootScope) {
    tweetservice = _tweetservice_;
    $websocket = _$websocket_;
    scope = $rootScope.$new();
    mockConf = {
          openTimeout     : 0,
          closeTimeout    : 0,
          messageInterval : 0,
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

  /*
   * Deberia llamar al websocket service por defecto
   * */
  it('should set ws.$new on load', function() {
    spyOn($websocket, '$new').andCallThrough();
    tweetservice.init(mockConf);
    expect($websocket.$new).toHaveBeenCalled();
  });

  /*
   * deberia crear un evento on open, para esto necesitamos espiar si el
   * $on ha sido llamado con '$open'
   * */
  iit('should get a list of tweets on load', function() {
    spyOn($websocket, '$new').andReturn({$on: jasmine.createSpy('$on')});
    tweetservice.init(mockConf);
    expect($websocket.$new().$on).toHaveBeenCalledWith('$open', jasmine.any(Function));
    expect($websocket.$new().$on).toHaveBeenCalledWith('init_tweets', jasmine.any(Function));
    expect($websocket.$new().$on).toHaveBeenCalledWith('new_tweets', jasmine.any(Function));

  });

  /*
   * Deberia obtener una lista con n tweets si el
   * websocket tiene algo al levantarse osea $open
   * */
  iit('should get a list of tweets on load', function() {

    //waitsFor(function() {
      tweetservice.init(mockConf);
      scope.$digest();
      scope.$apply();
      //if(tweetservice.getTweets()){
        //return true;
      //}
    //},1000);

    //runs(function() {
      expect(tweetservice.getWs().$OPEN).toBe(1);
      expect(tweetservice.getTweets()).not.toBe(undefined);
    //});

  });


  it('should broadcast a new_tweets if the websocket receives tweets', function() {

    waitsFor(function() {
      tweetservice.init(mockConf);
      if(tweetservice.getNewTweets()){
        return true;
      }
    },1000);

    runs(function() {
      expect(tweetservice.getNewTweets()).not.toBe('undefined');
    });

  });

  /*
   * We should have a list of tweets somewhere, empty at the begining
   * */
  it('should have a list of tweets', function() {
    expect(tweetservice.getTweets()).toEqual([]);
  });

  /*
   * Si el websocket contesta $new_tweets, deberiamos
   * poder capturarlos y guardarlos en nuestra lista
   * de tweets
   * */
  it('should get tweets on $new_tweets', function() {
    expect(tweetservice.getTweets().length > 0).toBe(true);
  });

  /*
   * If the tweetservice has been configured to hold
   * 10 tweets, free the space and holds the new tweets
   * */
  it('should free the space if maxTweets', inject(function(CONFIG){

    waitsFor(function() {
      tweetservice.init(mockConf);
      if(tweetservice.getNewTweets()){
        return true;
      }
    },1000);
    expect(tweetservice.getTweets().length > CONFIG.maxTweets).toBe(true);
  }));
});
