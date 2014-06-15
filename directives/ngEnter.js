(function() {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('ngEnter', ['$window', ngEnter]);
    
    function ngEnter() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }

})();