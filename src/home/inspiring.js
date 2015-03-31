angular.module('lrng.inspiring')
    .factory('Inspiring', function($http, Config){

        var get = function(){
            var url = Config.rootUrl;

            return $http.get(url);
        };

        return {
            get:get
        }
    });
