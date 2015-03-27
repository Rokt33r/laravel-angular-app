angular.module('lrng.home')
    .config(function($stateProvider){
        $stateProvider.state('home', {
            url:'/',
            templateUrl:'home/home.tpl.html',
            controller:'HomeController',
            controllerAs:'homeCtrl'
        });
    })
    .controller('HomeController', function(Inspiring){
        var vm = this;
        vm.getInspiring = function(){
            Inspiring.get().success(function(data){
                vm.message = data.message;
            });
        };
    });
