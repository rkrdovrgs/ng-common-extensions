(function () {
    'use strict';

    angular
        .module('ngCommonExtensions')
        .directive('selectList', ['$window', defaultSelect]);

    function defaultSelect($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            template: '<select ng-model="selectedValue.Value" ng-options="s.Value as s.Text for s in $items"><option value="0">- Select -</option></select>',
            scope: {
                selectedValue: '=',
                defaultItem: '=',
                items: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            var defaultItem = { Value: 0, Text: '- Select -' };
            if (attrs.defaultItem) defaultItem = scope.defaultItem;
            scope.$items = [defaultItem];


            var unregisterItems = scope.$watch('items', function (items) {
                if (items && items.length > 0) {
                    angular.copy(items, scope.$items);
                    if (defaultItem)
                        scope.$items.unshift(defaultItem);
                    if (!scope.selectedValue) {
                        scope.selectedValue = {};
                        angular.extend(scope.selectedValue, defaultItem);
                    }

                    scope.$watch('selectedValue', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            if (!scope.selectedValue) angular.extend(scope.selectedValue, defaultItem);
                            if (!newVal) angular.extend(scope.selectedValue, defaultItem);
                            else {
                                var newSelectedValue = Enumerable.From(scope.$items)
                                    .Where(function (x) { return x.Value === newVal.Value; })
                                    .FirstOrDefault();
                                angular.extend(scope.selectedValue, newSelectedValue);
                            }
                        }
                    }, true);

                    unregisterItems();
                }
            });
        }
    }

})();