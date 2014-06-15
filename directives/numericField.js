(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('numericField', ['$window', numericField]);

    function numericField($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModelCtrl) {
            var inpRgx;
            switch (attrs.numericField.toLowerCase()) {
                case 'int':
                case 'integer':
                    inpRgx = /[^0-9\-]/g;
                    break;
                case 'natural':
                case 'nat':
                case 'positive-integer':
                case 'non-negative-integer':
                    inpRgx = /[^0-9]/g;
                    break;
                default:
                    inpRgx = /[^0-9\.\-]/g;
                    break;

            }
            function fromUser(text) {
                var transformedInput = text.replace(inpRgx, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;  // or return Number(transformedInput)
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    }

})();