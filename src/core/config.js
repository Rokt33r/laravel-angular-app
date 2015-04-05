angular.module('lrng.config')
    .config(function($urlRouterProvider, jwtInterceptorProvider, $httpProvider){

        $urlRouterProvider
            .when('', '/')
            .otherwise('/notfound');

        $urlRouterProvider.deferIntercept();

        jwtInterceptorProvider.tokenGetter = [function() {
            return localStorage.getItem('id_token');
        }];

        $httpProvider.interceptors.push('jwtInterceptor');
    })
    .factory('Config', function(){
        var rootUrl = 'http://localhost:8000/';

        return {
            rootUrl:rootUrl
        };
    });
