(function () {
    'use strict';

    var serviceId = 'autocompleteService';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').factory(serviceId, ['$http', autocompleteService]);

    function autocompleteService($http) {
        // Define the functions and properties to reveal.
        return autocompleteService;

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
            return $http.get(url, {
                params: {
                    $filter: String.format("substringof('{0}', Text) eq true", term)
                }
            })
            .then(function (resp) {
                return resp.data;
            });
        }
        //#endregion
    }
})();