angular.module('ngCommonExtensions')
    .factory('commonHttp', ['$http',
        function ($http) {

            var commonHttp = function () {
                var result = {};
                result.$promise = $http.apply(this, arguments)
                    .success(function (data) {
                        angular.extend(result, data);
                    });

                return result;
            };

            return commonHttp;

        }]);