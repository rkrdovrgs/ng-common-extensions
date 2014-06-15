(function () {
    'use strict';

    var providerId = 'routeConfig';


    angular.module('ngCommonExtensions').provider(providerId, ['$routeProvider', routeConfigProvider]);

    function routeConfigProvider($routeProvider) {
        var p = this,
            _baseViewUrl = '',
            _loginUrl = '/',
            _globalAuthUrl,
            _globalResolves = [];

        angular.extend(p, $routeProvider);

        var _routeDefaults = {
            caseInsensitiveMatch: true,
        };

        p.when = function (path, route) {
            var toResolve = [];
            if (_globalResolves)
                angular.copy(_globalResolves, toResolve);
            route = angular.extend(route, _routeDefaults);

            //#region route.templateUrl
            if (route.templateUrl)
                route.templateUrl = _baseViewUrl + route.templateUrl;
            //#endregion

            //#region route.authUrl

            if (route.authUrl || _globalAuthUrl) {
                route.authUrl = route.authUrl || _globalAuthUrl;
                toResolve.push(authorize(route.authUrl));
            }

            //#endregion

            //#region route.resolve
            if (route.resolve)
                toResolve.push(route.resolve);
            if (toResolve.length > 0)
                route.resolve = resolve(toResolve);
            //#endregion

            $routeProvider.when(path, route);

            return p;
        }

        p.setBaseTemplateUrl = function (baseViewUrl) {
            _baseViewUrl = baseViewUrl;
        }

        p.setLoginUrl = function (loginUrl) {
            _loginUrl = loginUrl;
        }

        p.registerGlobalResolve = function (globalResolve) {
            _globalResolves.push(globalResolve);
        }

        p.setRouteDefaults = function (routeDefaults) {
            _routeDefaults = routeDefaults;
        }

        p.setGlobalAuthUrl = function (globalAuthUrl) {
            _globalAuthUrl = globalAuthUrl;
        }

        var resolve = function (toResolve) {
            return ["$injector", "$q", function ($injector, $q) {
                var proms = [];
                angular.forEach(toResolve, function (r) {
                    var prom = $injector.invoke(r);
                    if (prom && prom.then)
                        proms.push(prom);
                });

                if (proms.length > 0)
                    return $q.all(proms);

            }];
        }

        var authorize = function (authUrl) {
            return ['$http', '$window', function ($http, $window) {
                return $http({ method: 'GET', url: authUrl, cache: true })
                   .success(function (data, status, headers, config) {
                       // this callback will be called asynchronously
                       // when the response is available
                   })
                   .error(function (data, status, headers, config) {
                       if (status == 401)
                           $window.location.href = _loginUrl;
                   });
            }];
        }

    }
})();