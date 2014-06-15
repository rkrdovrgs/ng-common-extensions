(function () {
    'use strict';

    var commonModule = angular.module('ngCommonExtensions', []);
    
    commonModule.run(['templateService', function (templateService) {
        templateService.get('/bundles/ng-modules/common/html');
        templateService.getInlineTemplates();
    }]);
    

    

    commonModule.factory('common',
        [common]);

    function common() {
        

        var service = {
            activateController: activateController,
        };

        return service;

        function activateController(promises, onSuccess) {
            return $q.all(promises).then(function (eventArgs) {
                $broadcast(commonConfig.config.controllerActivateSuccessEvent);
                if (onSuccess != undefined)
                    $timeout(function () {
                        onSuccess();
                        //HACK: ngGrid not rendering correctly.
                        $(window).resize();
                    });
            });
        }


    }
})();

