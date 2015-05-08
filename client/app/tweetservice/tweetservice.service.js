'use strict';

angular.module('twittexpressApp')
.service('tweetservice', function ($http) {

    return {
        asyncSearch: function(query, since) {	
            var data = {query: query};				

            var queryUrl = '/search'; 
            var promise = $http.post(queryUrl, data).then(function (response) {						
                return response;
            });
            return promise;
        }				
    };
});
