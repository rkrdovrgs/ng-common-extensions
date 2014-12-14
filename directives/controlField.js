(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('controlField', ['$window', bootstrap]);

    function bootstrap($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: '/ng-common-extensions/templates/controlField.tmpl.html',
            scope: {
                controlModel: '=controlModel',
                controlField:'=controlField',
                controlType: '=controlType',
                colspan: '=colspan',
            }
        };
        return directive;

        function link(scope, element, attrs) {

            scope.controlField = scope.controlField || attrs.controlField;
            scope.controlType = scope.controlType || attrs.controlType;
            scope.colspan = scope.colspan || attrs.colspan;
            scope.controlPlaceholder = attrs.controlPlaceholder;
            scope.controlLabel = attrs.controlLabel;

        }
    }

})();