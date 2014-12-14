(function () {
    'use strict';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').directive('ngCalendar', ['$filter', ngCalendar]);

    function ngCalendar($filter) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                dtVal: '=ngModel',
                ngReadonly: '='
            },
            templateUrl: '/ng-common-extensions/templates/ngCalendar.tmpl.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.dt = scope.dtVal;
            if (!scope.dt) {
                var unregisterDtWatch = scope.$watch('dtVal', function (newVal) {
                    if (!newVal) return;

                    var dtDate = new Date(scope.dtVal);
                    var hrs = dtDate.getTimezoneOffset() * 6 / 360;
                    if (hrs > 0)
                        dtDate.setHours(dtDate.getHours() + hrs);
                    scope.dt = dtDate;
                    unregisterDtWatch();
                });
            }
            var momentFormats = {
                'dd-MMM-yyyy': 'DD-MMM-YYYY'
            };

            scope.format = attrs.format || 'dd-MMM-yyyy';

            scope.open = function ($event) {

                if (scope.ngReadonly) return;

                $event.preventDefault();
                $event.stopPropagation();

                scope.opened = true;
            };

            var inp = element.find('input');
            scope.updateDate = function (val) {

                scope.dtVal = $filter('date')(val, 'yyyy-MM-ddTHH:mm:ss');
            }



            inp
                .keydown(function (e) {
                    if (e.which === 9) {
                        scope.opened = false;
                        ngExtensions.scopeApply(scope);
                        inp.next().focus();
                    }
                })
                .click(function (event) {
                    if (scope.ngReadonly) {
                        scope.opened = false;

                        event.preventDefault();
                        event.stopPropagation();

                        ngExtensions.scopeApply(scope);

                    }
                })
                .keyup(function () {

                    var inpDate = moment(inp.val(), momentFormats[scope.format], true);

                    if (inpDate.isValid()) {
                        scope.updateDate(inpDate.toDate());
                        ngExtensions.scopeApply(scope);
                    }

                })
                .change(function () {
                    if (scope.dt) return;

                    var inpDate = moment(inp.val(), momentFormats[scope.format], true);

                    if (!inpDate.isValid()) {
                        inp.val(null);
                        scope.dt = null;

                    }
                    else {
                        scope.updateDate(inpDate.toDate());

                    }
                    ngExtensions.scopeApply(scope);
                });




        }
    }

})();