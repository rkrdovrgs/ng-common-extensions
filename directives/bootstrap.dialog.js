(function () {
    'use strict';

    var bootstrapModule = angular.module('ngCommonExtensions');

    bootstrapModule.factory('bootstrap.dialog', ['$modal', modalDialog]);

    function modalDialog($modal) {
        var service = {
            //deleteDialog: deleteDialog,
            confirm: confirm
        };

        var modalTemplate = function (bodyTemplate) {
            return 'modalDialog.tpl.html',
                    '<div class="inner-content-ng">' +
                    '    <div class="modal-header">' +
                    '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
                    '        <h3>{{title}}</h3>' +
                    '    </div>' +
                    '    <div class="modal-body">' +
                    '        ' + bodyTemplate + '' +
                    '    </div>' +
                    '    <div class="modal-footer">' +
                    '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
                    '        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>' +
                    '    </div>' +
                    '</div>';
        };

        return service;

        function confirm(msg, onCommit) {

            var modalOptions = {
                template: modalTemplate(msg.template || msg),
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            onCommit: msg.onCommit || onCommit,
                            data: msg.data,
                            title: msg.title
                        };
                    }
                }
            };

            return $modal.open(modalOptions).result;
        }
    }

    var ModalInstance = ['$scope', '$modalInstance', 'options',
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || 'Please confirm';
            $scope.data = options.data;
            $scope.okText = options.okText || 'OK';
            $scope.cancelText = options.cancelText || 'Cancel';
            $scope.ok = function () {
                if (options.onCommit) options.onCommit($scope.data);
                $modalInstance.close('ok');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }];
})();