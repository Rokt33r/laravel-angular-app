angular.module('lrng.top-nav')
    .directive('topNav', function(){
        return {
            restrict:'E',
            templateUrl:'directives/top-nav/top-nav.tpl.html',
            controller:'TopNavController',
            controllerAs:'topNav',
            scope:{}
        }
    })
    .controller('TopNavController', function(){
        var vm = this;

        vm.collapsed = true;
    });
