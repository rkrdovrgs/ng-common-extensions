(function () {
    'use strict';



    var commonModule = angular.module('ngCommonExtensions');

    commonModule.factory('spinner', ['common', 'commonConfig', spinner]);

    function spinner(common, config) {
        var service = {
            spinnerHide: spinnerHide,
            spinnerShow: spinnerShow
        };

        return service;

        function spinnerHide() { spinnerToggle(false); }

        function spinnerShow() { spinnerToggle(true); }

        function spinnerToggle(show) {
            common.$broadcast(config.events.spinnerToggle, { show: show });
        }
    }


    commonModule.run(['$rootScope', 'commonConfig', spinnerConfig]);

    function spinnerConfig($rootScope, config) {


        function toggleSpinner(on) {
            $rootScope.isAppBusy = on;
        }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { toggleSpinner(true); }
        );

        $rootScope.$on(config.events.controllerActivateSuccess,
            function (data) { toggleSpinner(false); }
        );

        $rootScope.$on(config.events.spinnerToggle,
            function (data) { toggleSpinner(data.show); }
        );
    };
})();