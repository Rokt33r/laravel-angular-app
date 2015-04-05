angular.module('lrng.init')
    .run(function(Auth, $urlRouter, $rootScope, $state){
        Auth.authenticateToken(function(){
            $urlRouter.sync();
        },function(){
            $urlRouter.sync();
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams){

            var go = function(state, params){
                event.preventDefault();
                $state.go(state, params);
            };

            // return if target state need no filtering
            if(!angular.isObject(toState.data) || (!toState.data.auth && !toState.data.guest)) return;

            var authState = Auth.getAuthState();

            // if on attempting, ignore state change
            if(authState=='auth') {
                event.preventDefault();
                return;
            }

            // only for authenticated user
            if(angular.isObject(toState.data) && toState.data.auth){
                switch(authState){
                    case 'user':
                        return;
                    case 'guest':
                    case 'init':
                        console.log('redirect signin');
                        Auth.setPendingState(toState.name, toParams);
                        go('signin');
                        return;
                }
            }

            // only for guest
            if(angular.isObject(toState.data) && toState.data.guest){
                switch(authState){
                    case 'user':
                        console.log('redirect home');
                        go('home');
                        return;
                }
            }


        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState){
            if(Auth.hasPendingState() && toState.name!=='signin') Auth.releasePendingState();
        });

        $urlRouter.listen();
    });