angular.module('lrng.home')
    .config(function($stateProvider){
        $stateProvider.state('mypage', {
            url:'/mypage',
            templateUrl:'mypage/mypage.tpl.html',
            controller:'MyPageController',
            controllerAs:'myPageCtrl',
            data:{
                auth:true
            }
        });
    })
    .controller('MyPageController', function(){
        var vm = this;
    });
