(function () {

    var _headers = null;

    var _setHeaders = function (headerCollection) {
        _headers = headerCollection;
    };

    var _getHeaders = function () {
        return _headers;
    }

    var _clearHeaders = function () {
        _headers = null;
    };

    var _getBundleVersion = function (bundlePath) {
        //var appScrit = angular.element('script[src^="/bundles/app?v="]');
        var appScript = angular.element('script[bundle-version],script[src^="' + bundlePath + '?v="]');
        if (appScript.length == 0) return '';

        var src = appScript.first().attr('src');
        return src.indexOf('?') == -1 ? '' : src.substring(src.indexOf('?') + 3);
    };

    var _registerInteceptors = function ($httpProvider, config) {

        var v = _getBundleVersion(config.bundlePath);

        $httpProvider.interceptors.push(["$q", function ($q) {

            return {
                /// <summary>Intercepts all requests and appends a "v" parameter to avoid caching</summary>
                request: function (config) {
                    var c = config || $q.when(config);

                    if (!regex.isMatch(c.url, '^ng.*\.html$', 'i') && !String.isNullOrEmpty(v)) {
                        c.params = c.params || {};
                        c.params.v = v;
                    }

                    c.headers['X-Requested-With'] = 'XMLHttpRequest';
                    if (_headers != null)
                        angular.extend(c.headers, _headers);
                    return c;
                },

                responseError: function (rejection) {
                    if (rejection.status === 401)
                        window.location = config.loginUrl;

                    return $q.reject(rejection);
                },
            }

        }]);



        var ajaxData;
        if (!String.isNullOrEmpty(v))
            ajaxData = { v: v };
        $.ajaxSetup({
            beforeSend: function (xhr) {

                if (_headers != null) {
                    $.each(_headers, function (name, value) {
                        xhr.setRequestHeader(name, value);
                    });
                }

            },
            data: ajaxData
        });
    };


    var providerId = 'httpConfig';

    var commonModule = angular.module('ngCommonExtensions');

    commonModule.provider(providerId, ['$httpProvider', httpConfigProvider]);

    function httpConfigProvider($httpProvider) {

        this.registerInterceptors = function (config) {
            _registerInteceptors($httpProvider, config);
        }

        function httpConfig() {
            this.setHeaders = _setHeaders;
            this.clearHeaders = _clearHeaders;
        }

        this.$get = function () {
            return new httpConfig();
        };

    }






}());