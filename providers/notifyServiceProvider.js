(function () {
    'use strict';



    var commonModule = angular.module('ngCommonExtensions');

    commonModule.factory('notify', ['common', '$q', notifier]);

    function notifier(common, $q) {
        var service = angular.extend(toastr, {
            loading: loading,
            resolve: resolve,
            activateController: activateController,
        });
        //service.options.positionClass = "toast-bottom-right";

        return service;


        function loading(message, title, optionsOverride) {
            var opts = {
                timeOut: 0,
                closeButton: true,
                iconClass: 'toast-loading',
                extendedTimeOut: 0
            };
            opts = $.extend(opts, optionsOverride);
            var target = toastr.info(message, title, opts);




            var spinnerOpts = {
                lines: 13, // The number of lines to draw
                length: 6, // The length of each line
                width: 2, // The line thickness
                radius: 7, // The radius of the inner circle
                color: '#FFFFFF',
            };

            var spinner = new Spinner(spinnerOpts);
            spinner.spin(target[0]);
            return target;
        }

        function resolve(promises, message, onSuccessMessage, onErrorMessage) {
            message = message || 'Processing your request. Please wait!';
            var n = loading(message);

            var promise = $q.all(promises).then(
                function () {
                    n.remove();
                    if (onSuccessMessage)
                        service.info(onSuccessMessage);
                },
                function () {
                    n.remove();
                    onErrorMessage = onErrorMessage || 'There was an error while processing your request.';
                    service.error(onErrorMessage);
                });

            return {
                $promise: promise,
                $n: n,
            }
        }


        function activateController(promises) {
            var activate,
                config = {};
            if (Object.isFunction(arguments[1]))
                activate = arguments[1];
            else {
                config = arguments[1];
                activate = config.activate;
            }
            var nObj = resolve(promises, config.message, config.onSuccessMessage, config.onErrorMessage)
            common.activateController(nObj.$promise, activate);
        }
    }


})();