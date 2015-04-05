angular.module('lrng.mypage')
    .config(function($stateProvider){
        $stateProvider.state('mypage', {
            url:'/mypage',
            templateUrl:'mypage/mypage.tpl.html',
            controller:'MyPageController',
            controllerAs:'vm',
            data:{
                auth:true
            }
        });
    })
    .controller('MyPageController', function(){
        var vm = this;
    });
