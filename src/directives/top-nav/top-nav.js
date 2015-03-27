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
    .controller('TopNavController', function($state, $scope){
        var vm = this;

        vm.current = $state.$current.name;

        $scope.$on('$stateChangeSuccess', function(){
            vm.current = $state.$current.name;
        });

        vm.go = function(stateName){
            $state.go(stateName);
        }
    });
