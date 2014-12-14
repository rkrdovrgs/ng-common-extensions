(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('defaultPagination', ['$window', defaultPagination]);

    function defaultPagination($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                pagingOptions: "=defaultPagination"
            },
            templateUrl: '/ng-common-extensions/templates/defaultPagination.tmpl.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.pagingOptions.numPages = 0;
            scope.itemsPerPage = scope.pagingOptions.pageSize || scope.pagingOptions.itemsPerPage;
        }
    }

})();