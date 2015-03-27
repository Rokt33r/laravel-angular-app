angular.module('lrng.inspiring')
    .factory('Inspiring', function($http){

        var get = function(){
            var url = 'http://localhost:8000/';

            return $http.get(url);
        };

        return {
            get:get
        }
    });
