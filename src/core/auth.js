angular.module('lrng.auth')
    .factory('Auth', function($http, Config, $rootScope, $state){

        /**
         * Auth state
         * states [idle, auth, user, guest]
         * @type {String}
         */
        var state = 'idle';

        var currentUser = null;

        var authenticateToken = function(cbSuccess, cbError){
            console.log('authenticating token');
            state = 'auth';
            $rootScope.$broadcast('StartAuthenticating');

            var url = Config.rootUrl + 'auth';

            return $http.get(url).success(function(data){
                console.log(data.user);
                state = 'user';
                currentUser = data.user;

                $rootScope.$broadcast('EndAuthenticating', currentUser);
                angular.isFunction(cbSuccess)?cbSuccess(data):null;
            }).error(function(data){
                console.log(data.error);
                currentUser = null;
                state = 'guest';

                $rootScope.$broadcast('EndAuthenticating', null);
                angular.isFunction(cbError)?cbError(data):null;
            });
        };

        var attempt = function(email, password, cbSuccess, cbError){
            var url = Config.rootUrl + 'auth';

            return $http.post(url, {
                email:email,
                password:password
            })
            .success(function(data){
                console.log('Success');
                localStorage.setItem('id_token', data.token);
                authenticateToken(cbSuccess, cbError);
            })
            .error(function(data, status){
                console.log('Error occurs :' + status);
                angular.isFunction(cbError)?cbError(data):null;
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

        var isPending = false;
        var pendingState = null;
        var pendingParams = null;

        var setPendingState = function(state, params){
            isPending = true;
            pendingState = state;
            pendingParams = params;
        };
        var releasePendingState = function(){
            var result = {
                state:pendingState,
                params:pendingParams
            };

            isPending = false;
            pendingState = null;
            pendingParams = null;

            return result;
        };
        var hasPendingState = function(){
            return isPending;
        };

        return {
            authenticateToken:authenticateToken,
            attempt:attempt,
            signOut:signOut,
            getAuthState:function(){
                return state;
            },
            getCurrentUser:function(){
                return currentUser;
            },
            setPendingState:setPendingState,
            releasePendingState:releasePendingState,
            hasPendingState:hasPendingState
        };
    });