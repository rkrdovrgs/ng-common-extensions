(function () {
    var baseAngularModule = angular.module;
    angular.module = function () {
        var mod = baseAngularModule.apply(this, arguments);
        if (arguments.length > 1)
            angular.extend(mod, {
                mapper: mapperFactory(arguments[0])
            });

        return mod;
    }

    function mapperFactory(moduleName) {
        return function (name, imp) {
            var impOverride = ['$injector',
                function ($injector) {
                    var map = $injector.invoke(imp);
                    return function (model) {
                        var t = this,
                            parms = arguments;

                        if (angular.isArray(model)) {
                            angular.forEach(model, function (m) {
                                var p = [];
                                angular.copy(parms, p);
                                p[0] = m;
                                map.apply(t, p);
                            });
                            return model;
                        } else {
                            return map.apply(t, parms);
                        }


                    }
                }
            ];
            return angular.module(moduleName).factory(name, impOverride);
        }
    }


})();

