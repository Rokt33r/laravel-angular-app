/**
 * Events
 * StartAuthenticating
 * EndAuthenticating
 */

angular.module('lrng.auth')
    .factory('Auth', function($http, Config, $rootScope, $state){

        /**
         * Auth state
         * states [idle, auth, user, guest]
         * @type {String}
         */
        var state = 'idle';

        var currentUser = null;

        var authenticateToken = function(cb){
            console.log('authenticating token');
            state = 'auth';
            $rootScope.$broadcast('StartAuthenticating');

            var url = Config.rootUrl + 'auth';

            return $http.get(url).success(function(data){
                console.log(data.user);
                state = 'user';
                currentUser = data.user;

                $rootScope.$broadcast('EndAuthenticating', currentUser);
                if(angular.isFunction(cb)) cb();
            }).error(function(data){
                console.log(data.error);
                currentUser = null;
                state = 'guest';

                $rootScope.$broadcast('EndAuthenticating', null);
            });
        };

        var attempt = function(email, password){
            var url = Config.rootUrl + 'attempt';

            return $http.post(url, {
                email:email,
                password:password
            })
            .success(function(data){
                console.log('Success');
                localStorage.setItem('id_token', data.token);
                authenticateToken();
            })
            .error(function(data, status){
                console.log('Error occurs :' + status);
                console.log(data);
            });
        };

        var signOut = function(){
            console.log('Sign out');
            localStorage.removeItem('id_token');
            currentUser = null;
            state = 'guest';
            $rootScope.$broadcast('EndAuthenticating', null);
            $state.go('home');
        };

        var pending = false;
        var pendingState = null;
        var pendingParams = null;

        var setPendingState = function(state, params){
            pending = true;
            pendingState = state;
            pendingParams = params;
        };
        var releasePendingState = function(){
            var result = {
                state:pendingState,
                params:pendingParams
            }

            pending = false;
            pendingState = null;
            pendingParams = null;

            return result;
        };
        var hasPendingState = function(){
            return pending;
        };

        return {
            authenticateToken:authenticateToken,
            attempt:attempt,
            signOut:signOut,
            getState:function(){
                return state;
            },
            getCurrentUser:function(){
                return currentUser;
            },
            setPendingState:setPendingState,
            releasePendingState:releasePendingState,
            hasPendingState:hasPendingState
        };
    })
    .run(function(Auth, $rootScope, $state){
        Auth.authenticateToken();

        $rootScope.$on('EndAuthenticating', function(){
            if(!Auth.hasPendingState()) {
                var currentState = $state.current;

                if(currentState.data == undefined) return;

                if(currentState.data.guest && Auth.getState() == 'user'){
                    $state.go('home');
                    return;
                }

                if(currentState.data.auth && Auth.getState() == 'guest'){
                    $state.go('home');
                    return;
                }
                return;
            };

            console.log('pending ends');
            var result = Auth.releasePendingState();
            var toState = $state.get(result.state);
            if(toState.data.auth){
                if(Auth.getState() == 'user'){
                    console.log('go state : '+result.state+' directly');
                    $state.go(result.state, result.params);
                    return;
                }
                console.log('go signIn');
                $state.go('signin');
            }
            if(toState.data.guest){
                if(Auth.getState() == 'guest'){
                    console.log('go state : '+result.state+' directly');
                    $state.go(result.state, result.params);
                    return;
                }
                console.log('go home');
                $state.go('home');
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            console.log('current Auth State :'+ Auth.getState());
            // console.log('toState : ', toState);
            // console.log('fromState : ', fromState);
            if(toState.data!==undefined && toState.data.auth){
                switch(Auth.getState()){
                    case 'idle':
                        Auth.authenticateToken();
                    case 'auth':
                        console.log('pending starts');
                        event.preventDefault();

                        Auth.setPendingState(toState.name, angular.copy(toParams));

                        break;
                    case 'user':
                        console.log('go state : '+toState.name+' directly');
                        break;
                    case 'guest':
                        event.preventDefault();
                        console.log('go signIn directly');
                        Auth.setPendingState(toState.name, angular.copy(toParams));
                        $state.go('signin');
                        break;
                }
                return;
            }

            if(toState.data!==undefined && toState.data.guest){
                switch(Auth.getState()){
                    case 'idle':
                        Auth.authenticateToken();
                    case 'auth':
                        console.log('pending starts');
                        event.preventDefault();

                        Auth.setPendingState(toState.name, angular.copy(toParams));

                        break;
                    case 'user':
                        event.preventDefault();
                        $state.go('home');
                        break;
                    case 'guest':
                        console.log('go state : '+toState.name+' directly');
                        break;
                }
            }

        });
    });
