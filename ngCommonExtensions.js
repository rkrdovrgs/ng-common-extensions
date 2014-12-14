(function () {
    'use strict';

    var commonModule = angular.module('ngCommonExtensions', ['ui.bootstrap']);

    commonModule.run(['templateService', function (templateService) {
        //templateService.get('/bundles/ng-modules/common/html');
        templateService.getInlineTemplates();
    }]);

    commonModule.provider('commonConfig', function () {
        this.config = {
            events : {
                controllerActivateSuccess: 'controller.activateSuccess',
                spinnerToggle: 'spinner.toggle'
            }
        };

        this.$get = function () {
            return this.config;
        };
    });

    commonModule.factory('common',
        ['$q', '$rootScope', '$timeout', 'commonConfig', common]);

    function common($q, $rootScope, $timeout, config) {

        var service = {
            activateController: activateController,
            $broadcast: $broadcast
        };

        return service;

        function activateController(promises, onSuccess) {
            $rootScope.isAppBusy = true;

            
            return $q.all(promises).then(function () {
                $broadcast(config.events.controllerActivateSuccess);
                var t = this,
                    eventArgs = arguments;

                if (onSuccess !== undefined) {
                    onSuccess.apply(t, eventArgs);
                    $rootScope.isAppBusy = false;
                    $timeout(function () {
                        //HACK: ngGrid not rendering correctly.
                        $(window).resize();
                    });
                }
            });
        }
        
        function $broadcast() {
           return $rootScope.$broadcast.apply($rootScope, arguments);
        }
    }

})();

