(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('ngCalendar', ['$window', ngCalendar]);

    function ngCalendar($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                dt: '=ngModel',
            },
            templateUrl: '/ng-common/directives/ngCalendar.tmpl.html'
        };
        return directive;

        function link(scope, element, attrs) {

            scope.format = 'dd-MMM-yyyy';

            scope.open = function ($event) {



                $event.preventDefault();
                $event.stopPropagation();

                scope.opened = true;
            };
                        

            element.find('input')
                .focus(function () {
                    var x = angular.element(this);
                    if (x.attr('disabled-calendar-tab-event')) return;
                    x.attr('disabled-calendar-tab-event', true);
                    angular.element('ul[datepicker-popup-wrap] button').attr('tabindex', -1);
                })
                .blur(function () {
                    //hide calender if tab event
                });

        }
    }

})();