angular.module('lrng.about')
    .config(function($stateProvider){
        $stateProvider.state('about', {
            url:'/about',
            templateUrl:'about/about.tpl.html',
            controller:'AboutController',
            controllerAs:'vm'
        });
    })
    .controller('AboutController', function(){

    });
