(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'templateService';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    // TODO: replace app with your module name
    var commonModule = angular.module('ngCommonExtensions');

    commonModule.factory(serviceId, [
        '$http',
        '$templateCache',
        '$q',


        templateService]);

    function templateService($http, $templateCache, $q) {
        // Define the functions and properties to reveal. 
        var service = {
            get: get,
            getInlineTemplates: getInlineTemplates,
        };

        return service;

        var isOverriden = false;
        function get(config) {
            var urlArr = arguments;

            if (!isOverriden) {

                var getTmpl = $templateCache.get;

                $templateCache.get = function (templateUrl) {
                    var templ = getTmpl(templateUrl);
                    if (templ == undefined && templateUrl.indexOf('?') != -1) {
                        var newUrl = templateUrl.substring(0, templateUrl.indexOf('?'));
                        templ = getTmpl(newUrl);


                    }

                    return templ;
                }


                isOverriden = true;
            }

            //var d = $q.defer();


            //var requests = [];
            angular.forEach(urlArr, function (url) {
                var data = $.ajax({
                    type: "GET",
                    url: url,
                    async: false
                }).responseText;
                var $data = angular.element('<div/>');
                $data.append(data);

                $data.find('script[data-ng-template], script[ng-template], section[data-ng-template], section[ng-template]').each(function () {
                    var x = $(this),
                        baseName = x.attr('data-ng-template') || x.attr('ng-template');
                    if ($templateCache.get(baseName) == undefined)
                        $templateCache.put(baseName, x.html());
                });
                //requests.push(
                //    $http.get(url).success(function (data) {
                //        var $data = angular.element('<div/>');
                //        $data.append(data);

                //        $data.find('script[data-ng-template], script[ng-template]').each(function () {
                //            var x = $(this),
                //                baseName = x.attr('data-ng-template') || x.attr('ng-template');
                //            console.log(baseName, x.html())
                //            $templateCache.put(baseName, x.html());
                //        });
                //    })
                //);
            });

            //$q.all(requests).then(function () {
            //    d.resolve();
            //});


            //return d.promise;
        }

        function getInlineTemplates() {
            angular.element('link[href$=".tmpl.html"]').each(function () {
                var l = $(this);
                var data = $.ajax({
                    type: "GET",
                    url: l.attr('href'),
                    async: false
                }).responseText;
                var $data = angular.element('<div/>');
                $data.append(data);

                $data.find('script[data-ng-template], script[ng-template], section[data-ng-template], section[ng-template]').each(function () {
                    var x = $(this),
                        baseName = x.attr('data-ng-template') || x.attr('ng-template');
                    $templateCache.put(baseName, x.html());
                });
            });
        }
    }
})();