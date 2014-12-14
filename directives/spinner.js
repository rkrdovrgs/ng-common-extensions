(function () {
    'use strict';


    angular.module('ngCommonExtensions').directive('spinner', ['$window', spinner]);

    function spinner($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {
            var opts = {
                lines: 10, // The number of lines to draw
                length: 2, // The length of each line
                width: 2, // The line thickness
                radius: 4, // The radius of the inner circle
                corners: 0, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: attrs.top || '50%', // Top position relative to parent
                left: attrs.left || '50%' // Left position relative to parent
            };
            var sp = new Spinner(opts).spin(element[0]);
        }
    }

})();