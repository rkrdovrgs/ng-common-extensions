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
                    inpRgx = '^(-|\\+)?[0-9]*$';
                    break;
                case 'natural':
                case 'nat':
                case 'positive-integer':
                case 'non-negative-integer':
                    inpRgx = '^[0-9]*$';
                    break;
                case 'positive':
                case 'positive-decimal':
                    inpRgx = String.format('^[0-9]*\\.?{0}$',
                        attrs.numericFieldDecimals ?
                        (new Array(Number(attrs.numericFieldDecimals) + 1)).join('[0-9]?') :
                        '[0-9]*');
                    break;
                default:
                    inpRgx = String.format('^(-|\\+)?[0-9]*\\.?{0}$',
                        attrs.numericFieldDecimals ?
                        (new Array(Number(attrs.numericFieldDecimals) + 1)).join('[0-9]?') :
                        '[0-9]*');
                    break;

            }

            function fromUser(text) {
                if (!text) return text;

                var validValue = false,
                    transformedInput = text;


                for (var i = 0, l = transformedInput.length; i < l && !validValue; i++) {
                    if (!regex.isMatch(transformedInput, inpRgx)
                    || (attrs.numericFieldMax && Number(transformedInput) > Number(attrs.numericFieldMax))
                    ) {
                        transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                    } else {
                        console.log(regex.isMatch(transformedInput, inpRgx));
                        validValue = true;
                        if (i === 0) return text;
                    }
                }

                


                //element.val(transformedInput);

                ngModelCtrl.$setViewValue(transformedInput);
                ngModelCtrl.$render();

                return transformedInput;


            }

            ngModelCtrl.$parsers.push(fromUser);


            element.blur(function () {
                var text = $(this).val();
                if (isNaN(text)) {
                    element.val(null);
                    ngModelCtrl.$setViewValue(null);
                    ngModelCtrl.$render();
                }
            });

        }
    }

})();