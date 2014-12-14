(function () {
    'use strict';

    // Define the directive on the module.
    // Inject the dependencies. 
    // Point to the directive definition function.
    angular.module('ngCommonExtensions').directive('dropeditor', [
        "$resource",
        "$http",
        "$templateCache",
        "$compile",
        "$cacheFactory",

        dropEditor]);

    function dropEditor($resource, $http, $templateCache, $compile, $cacheFactory) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            require: '?ngModel',
            replace: true,
        };
        return directive;

        function link(scope, element, attrs, ngModel) {

            $http({
                url: '/ng-common-extensions/templates/dropeditor.tmpl.html',
                cache: $templateCache,
                method: 'GET'
            }).then(function (resp) {

                var tmpl = String.format(resp.data, attrs.collection, attrs.ngModel),
                    resource = $resource(attrs.ngResource + '/:id', { id: '@id' },
                    {
                        query: {
                            method: 'GET',
                            cache: true,
                            isArray: true
                        }
                    });

                

                if (scope.dropEditor == undefined) scope.dropEditor = {};

                scope.dropEditor[attrs.collection] = {
                    collection: [],
                    viewMode: 'display',
                    btnAddClick: function () {
                        var s = this;
                        s.itemToUpdate.text = '';
                        s.itemToUpdate.value = 0;

                        scope.dropEditor[attrs.collection].viewMode = 'edit';
                    },
                    btnEditClick: function (ev) {
                        var s = this;
                        var txt = element.find('select option:selected').text();
                        s.itemToUpdate.text = txt;
                        s.itemToUpdate.value = ngModel.$viewValue;

                        scope.dropEditor[attrs.collection].viewMode = 'edit';

                    },
                    btnCancelClick: function () {
                        scope.dropEditor[attrs.collection].viewMode = 'display';
                    },
                    btnSaveClick: function () {
                        var s = this;
                        var resourceToCreate = {};
                        resourceToCreate[attrs.columnValue] = s.itemToUpdate.value;
                        resourceToCreate[attrs.columnText] = s.itemToUpdate.text;

                        var newResource = new resource(resourceToCreate);
                        newResource.$save();

                        if (s.itemToUpdate.value == 0) {
                            s.collection.push({
                                text: newResource[attrs.columnText],
                                value: newResource[attrs.columnValue]
                            });
                            ngModel.$setViewValue(newResource[attrs.columnValue]);
                        }
                        else {
                            for (var i = 0; i < s.collection.length; i++) {
                                if (s.collection[i].value == s.itemToUpdate.value)
                                    s.collection[i].text = s.itemToUpdate.text;
                            }
                        }
                        

                        scope.dropEditor[attrs.collection].viewMode = 'display';

                    },
                    itemToUpdate: { text: '', value: 0 }

                };




                var options = resource.query(function () {
                    angular.forEach(options, function (opt, key) {
                        scope.dropEditor[attrs.collection].collection.push({
                            value: opt[attrs.columnValue],
                            text: opt[attrs.columnText]
                        });
                    });

                    var compTmpl = $compile(tmpl)(scope);

                    element.append(compTmpl);

                });



            });





        }
    }

})();