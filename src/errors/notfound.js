angular.module('lrng.errors.notfound')
    .config(function($stateProvider){
        $stateProvider.state('notfound', {
            url:'/notfound',
            templateUrl:'errors/notfound.tpl.html'
        });
    });
