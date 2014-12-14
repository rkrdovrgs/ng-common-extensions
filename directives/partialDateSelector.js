(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('partialDateSelector', ['$timeout', '$filter', ngCalendar]);

    function ngCalendar($timeout, $filter) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                fullDate: '=',
                year: '='
            },
            templateUrl: '/ng-common-extensions/templates/partialDateSelector.tmpl.html'
        };
        return directive;

        function link(scope, element, attrs) {



            scope.format = attrs.format || 'dd-MMM-yyyy';

            var inp = element.find('input');

            scope.dt = scope.fullDate;



            var unregister = scope.$watch('[fullDate,year]', function () {
                if (scope.fullDate) {

                    var dtDate = new Date(scope.fullDate);
                    var hrs = dtDate.getTimezoneOffset() * 6 / 360;
                    if (hrs > 0)
                        dtDate.setHours(dtDate.getHours() + hrs);
                    scope.dt = dtDate;
                    //scope.dt = scope.fullDate;
                } else if (scope.year)
                    inp.val(scope.year);

                if (scope.fullDate === null || scope.year === null) {
                    unregister();
                }
            }, true);

            var inpValTimer;
            scope.$watch(function () { return inp.val(); }, function (newVal, oldVal) {
                if (inpValTimer) $timeout.cancel(inpValTimer);
                inpValTimer = $timeout(function () {
                    if (newVal === oldVal) return;
                    scope.fullDate = null;
                    scope.year = null;
                    var inpDate = moment(newVal, 'DD-MMM-YYYY');

                    if (regex.isMatch(newVal, '^[1-2][0-9]{3}$'))
                        scope.year = parseInt(newVal);
                    else if (inpDate.isValid()) {
                        scope.fullDate = inpDate.toDate();
                        scope.fullDate = $filter('date')(scope.fullDate, 'yyyy-MM-ddTHH:mm:ss');
                    }

                }, 300);
            }, true);

            scope.open = function ($event) {

                $event.preventDefault();
                $event.stopPropagation();

                scope.opened = true;
            };


            inp.keydown(function (e) {

                //var validKeys = [8, 13, 16, 17, 18, 37, 38, 39, 40];
                if (e.which === 9) {
                    scope.opened = false;
                    ngExtensions.scopeApply(scope);
                    inp.next().focus();
                }

                /*else if (e.which in validKeys)
                return;
            else if (!regex.isMatch(e.key, '([0-9]|/)'))
                e.preventDefault();*/
            });


            /*
            var maskObj = inp.masks([
                { mask: '99/99/9999', placeholder: 'MM/dd/yyyy', regex: '^[1-2][0-9]{3}/[0-1][0-9]/[0-3][0-9]$' },
                { mask: '9999', placeholder: 'yyyy', regex: '^[1-2][0-9]{3}$' }
            ]);

            element.find('i.glyphicon-sort').parent().click(maskObj.switchMask);
            */
        }
    }

})();