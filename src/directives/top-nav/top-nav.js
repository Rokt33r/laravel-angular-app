angular.module('lrng.top-nav')
    .directive('topNav', function(){
        return {
            restrict:'E',
            templateUrl:'directives/top-nav/top-nav.tpl.html',
            controller:'TopNavController',
            controllerAs:'vm',
            scope:{}
        }
    })
    .controller('TopNavController', function(Auth, $scope){
        var vm = this;

        vm.collapsed = true;
        vm.currentUser = null;
        vm.onAuthenticating = false;

        $scope.$on('StartAuthenticating', function(){
            vm.onAuthenticating = true;
        });

        $scope.$on('EndAuthenticating', function(event, user){
            vm.onAuthenticating = false;
            vm.currentUser = user;
        });

        vm.signOut = function(){
            Auth.signOut();
        };

    });
