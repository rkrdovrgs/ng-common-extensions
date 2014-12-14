(function () {
    'use strict';

    angular.module('ngCommonExtensions')

        .directive('typeaheadDropdown', ['$timeout',

            function ($timeout) {
                return {
                    require: '?ngModel',
                    link: function (scope, element, attrs, ngModel) {
                        var dropEvent = function () {
                            
                            var inputValue = element.val();
                            if (!String.isNullOrEmpty(inputValue)) return;

                            $timeout(function () { ngModel.$setViewValue(' ') });

                        };

                        //element.focus(dropEvent);
                        element.data('dropEvent', dropEvent);
                    }
                }
            }

        ])

        .directive('typeaheadMultiple', ['$timeout', function ($timeout) {
            // Usage:
            // 
            // Creates:
            // 
            var directive = {
                link: link,
                restrict: 'E',
                scope: {
                    $$selectedValues: '=ngModel',
                    $$source: '=src',
                    $$onSelect: '=onSelect',
                    $$onBlur: '=onBlur',
                    $$onRemove: '=onRemove',
                    $$placeholder: '@placeholder',
                    $$hideClearButton: '=hideClearButton',
                },
                replace: true,
                //templateUrl: '/Scripts/ng-common/directives/typeaheadMultiple.tmpl.html'
                templateUrl: '/ng-common-extensions/templates/typeaheadMultiple.tmpl.html'
            };
            return directive;

            function link(scope, element, attrs) {
                attrs.textProperty = attrs.textProperty || 'Text';
                attrs.valueProperty = attrs.valueProperty || 'Value';
                scope.$$classProperty = attrs.classProperty || 'CssClass';
                scope.$$categoryProperty = attrs.categoryProperty || 'Category';
                if (scope.$$selectedValues && scope.$$selectedValues.$promise)
                    scope.$$selectedValues.$promise.then(function () {
                        scope.$apply();
                    });

                var $ta = element.find('input[data-role="typeahead-multiple"]');
                $ta.blur(function () {
                    $ta.val('');
                    if (scope.$$onBlur)
                        scope.$$onBlur();
                });



                element.click(function () {
                    var dropEvent = $ta.data('dropEvent');
                    if (dropEvent && !maxReached()) dropEvent();
                    $ta.focus();
                });

                scope.$$textProperty = attrs.textProperty;

                scope.$$taSelectedValue = '';

                scope.$$disabled = attrs.disabled != undefined;

                scope.$$maxReached = maxReached;

                scope.selectedValuesToDisplay = getSelectedValuesToDisplay;

                scope.$$pushSelectedValue = function () {

                    if (!Enumerable.From(scope.$$selectedValues)
                        .Any(function (x) { return x[attrs.valueProperty] == scope.$$taSelectedValue[attrs.valueProperty] })) {

                        if (!attrs.maxSelectedValues || attrs.maxSelectedValues > 1)
                            scope.$$selectedValues.push(scope.$$taSelectedValue);
                        else
                            scope.$$selectedValues = scope.$$taSelectedValue;

                        if (scope.$$onSelect)
                            scope.$$onSelect();

                    }
                    scope.$$taSelectedValue = '';



                }

                scope.$$removeSelectedValue = function (idx) {
                    if (attrs.maxSelectedValues == 1)
                        scope.$$selectedValues = null;
                    else
                        scope.$$selectedValues.splice(idx, 1);

                    if (scope.$$onRemove)
                        scope.$$onRemove(idx);

                    $ta.focus();
                }

                scope.$$removeAll = function () {
                    scope.$$selectedValues = [];
                    $ta.focus();
                }


                function maxReached() {
                    return attrs.maxSelectedValues && scope.selectedValuesToDisplay().length >= attrs.maxSelectedValues;
                }

                function getSelectedValuesToDisplay() {
                    if (attrs.maxSelectedValues == 1)
                        return !Object.isNullOrUndefined(scope.$$selectedValues) ? [scope.$$selectedValues] : [];
                    else
                        return scope.$$selectedValues;
                }


            }
        }]);

})();