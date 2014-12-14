(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('regexConstraint', ['$window', numericField]);

    function numericField($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel',
            scope: {
                regex: '=regexConstraint'
            }
        };
        return directive;

        function link(scope, element, attrs, ngModelCtrl) {
            var inpRgx = scope.regex;
            
            function fromUser(text) {
                if (text && !regex.isMatch(text, inpRgx)) {
                    var transformedInput = text.substr(0, text.length - 1);
                    element.val(transformedInput);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;
                }
                return text;  // or return Number(transformedInput)
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    }

})();