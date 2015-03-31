angular.module('lrng.config')
    .config(function($urlRouterProvider, jwtInterceptorProvider, $httpProvider){

        // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

        $urlRouterProvider
            .when('', '/')
            .otherwise('/notfound');

        jwtInterceptorProvider.tokenGetter = [function() {
            return localStorage.getItem('id_token');
        }];

        $httpProvider.interceptors.push('jwtInterceptor');

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With']
    })
    .factory('Config', function(){
        var rootUrl = 'http://localhost:8000/';

        return {
            rootUrl:rootUrl
        };
    });
