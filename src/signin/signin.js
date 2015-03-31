angular.module('lrng.signin')
    .config(function($stateProvider){
        $stateProvider.state('signin', {
            url:'/signin',
            templateUrl:'signin/signin.tpl.html',
            controller:'SignInController',
            controllerAs:'vm',
            data:{
                guest:true
            }
        });
    })
    .controller('SignInController', function(Auth){
        var vm = this;

        vm.signIn = function(){
            Auth.attempt(vm.email, vm.password);
        };
    });
