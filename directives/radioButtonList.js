angular.module('ngCommonExtensions').directive('radioButtonList',
    [
        '$window',

        function radioButtonList($window) {
            // Usage:
            // 
            // Creates:
            // 
            var directive = {
                link: link,
                restrict: 'E',
                scope: {
                    options: '=',
                    model: '=ngModel',
                    inline: '=',
                    onChange: '='
                },
                templateUrl: '/ng-common-extensions/templates/radioButtonList.tmpl.html'
            };
            return directive;

            function link(scope, element, attrs) {
                scope.groupName = (attrs.name || 'rbl') + '_' + String.random();

                scope.setSelectedValue = function (opt) {
                    scope.model = opt;
                    if (scope.onChange) scope.onChange(opt);
                };

                scope.model = scope.model || {};

            }
        }
    ]
);



