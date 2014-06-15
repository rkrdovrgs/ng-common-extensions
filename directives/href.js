(function () {
    'use strict';

    // Must configure the common service and set its 
    // events via the commonConfigProvider

    angular.module('ngCommonExtensions')
        .directive('ngHref', ["$compile", "$location", "$rootScope", "$window", directiveImp]);

    function directiveImp($compile, $location, $rootScope, $window) {
        return {
            restrict: 'A',
            //: true,
            //template: '<div></div>',
            link: function (scope, element, attrs) {

                if (element.get(0).nodeName !== 'a') {
                    element.click(function () {
                        scope.$apply(function () {
                            var ref = '';
                            if (attrs.ngHref.startsWith('#'))
                                $location.path(attrs.ngHref.substring(1));
                            else
                                $window.location.href = attrs.ngHref;

                        });
                    });

                    element.css('cursor', 'pointer');
                }

                //If path equals
                if (attrs.ngActiveOn) {


                    $rootScope.$on('$routeChangeSuccess', function (evt, data) {
                        var isActive = false;
                        switch (attrs.ngActiveOn) {
                            case "base-path":
                                isActive = $location.$$path.toLowerCase().startsWith(attrs.ngHref.toLowerCase().replace('#', ''));
                                break;
                            case "base-url":
                                isActive = $window.location.pathname.toLowerCase() == attrs.ngHref.toLowerCase();
                                break;
                            default:
                                isActive = $location.$$path.toLowerCase() == attrs.ngHref.toLowerCase().replace('#', '');
                                break;

                        }


                        if (isActive)
                            element.addClass(attrs.ngActiveClass);
                        else
                            element.removeClass(attrs.ngActiveClass);
                    });
                }

            }
        };
    }

})();
