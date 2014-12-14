(function () {
    'use strict';

    var serviceId = 'autocompleteService';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').factory(serviceId, ['$http', '$q', autocompleteService]);

    function autocompleteService($http, $q) {
        var auRequestCanceler = {};        

        //#region Internal Methods        
        function autocompleteService(configs) {
            var s = this;
            angular.forEach(configs, function (value, key) {
                s[key] = function (term) {
                    return autocompleteRequest(value, term);
                }
            });
        }


        
        function autocompleteRequest(url, term) {
            if (!Object.isNullOrUndefined(auRequestCanceler[url])) {
                auRequestCanceler[url].resolve();
            }

            auRequestCanceler[url] = $q.defer();
            return $http.get(url, {
                params: {
                    $filter: String.format("substringof('{0}', Text) eq true", term),
                    term: term
                },
                cache: true,
                timeout: auRequestCanceler[url].promise
            })
            .then(function (resp) {
                auRequestCanceler[url] = undefined;
                return resp.data;
            });
        }
        //#endregion




        return autocompleteService;
    }
})();