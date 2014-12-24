(function () {

    angular.module('ngCommonExtensions')
        .directive('autocomplete', [
            '$timeout', function ($timeout) {
                // Usage:
                // 
                // Creates:
                // 
                var directive = {
                    link: link,
                    restrict: 'E',
                    scope: {
                        $$selectedValues: '=ngModel',
                        $$source: '=src',
                        $$placeholder: '@placeholder',
                        $$hideClearButton: '=hideClearButton',
                        $$minLength: '=minLength',
                        $$onSelect: '=onSelect',
                        $$beforeSelect: '=beforeSelect',
                        $$beforeSearch: '=beforeSearch',
                        $$name: '@name',
                        $$editable: '=editable',
                        $$disabled: '=ngDisabled',
                        $$allowNew: '=allowNew'
                    },
                    replace: true,
                    templateUrl: '/ng-common-extensions/templates/autocomplete.tmpl.html'
                },
                newValsCounter = 0,
                aucache = {};

                return directive;

                function link(scope, element, attrs) {

                    attrs.textProperty = attrs.textProperty || 'Text';
                    attrs.valueProperty = attrs.valueProperty || 'Value';
                    scope.$$classProperty = attrs.classProperty || 'CssClass';
                    scope.$$textProperty = attrs.textProperty;

                    if (scope.$$selectedValues && scope.$$selectedValues.$promise)
                        scope.$$selectedValues.$promise.then(function () {
                            ngExtensions.scopeApply(scope);
                        });






                    //#region JqueryUI - Autocomplete

                    var au = element.find('input[data-role="typeahead-multiple"]:first'),
                        auSpinner = element.find('.action-buttons spinner'),
                        auDropIcon = element.find('.action-buttons i'),
                        toggleIcon = function (loadingValues) {
                            if (loadingValues) {
                                auSpinner.show();
                                auDropIcon.hide();
                            } else {
                                auSpinner.hide();
                                auDropIcon.show();
                            }
                        },
                        currentTerm = '',
                        isSearching = false,
                        getAuMenu = function () {
                            return au.data('ui-autocomplete').menu.element;
                        },
                        onSearchError = function () {
                            isSearching = false;
                        },
                        source = function (request, response) {
                            if (angular.isArray(scope.$$source)) {
                                var resp = [];
                                currentTerm = request.term;
                                angular.forEach(scope.$$source, function (v, k) {
                                    if (v.Text.toLowerCase().indexOf(request.term.toLowerCase()) !== -1)
                                        resp.push(v);
                                });

                                response(resp);
                                return;
                            }


                            var term = request.term,
                                pp = request.pp || 1,
                                scopeKey = angular.isFunction(scope.$$source) ? attrs.src : scope.$$source,
                                aukey = (scope.$$cacheKey || scopeKey) + term + '_' + pp.toString();

                            if (aukey in aucache) {

                                response(aucache[aukey]);
                                return;
                            }

                            if (scope.$$source == undefined || scope.$$source == '')
                                return;

                            var onSuccess = function (data) {
                                currentTerm = term;
                                if (scope.$$allowNew && !String.isNullOrEmpty(currentTerm)
                                    && !Enumerable.From(data).Any(function (x) { return x[attrs.textProperty].toLowerCase() === currentTerm.toLowerCase(); })) {


                                    var newValue = {
                                        IsNew: true,
                                        AddToCache: function (value) {
                                            newValue.IsNew = false;
                                            newValue[attrs.valueProperty] = value;
                                        }
                                    }

                                    newValsCounter--;
                                    newValue[attrs.valueProperty] = newValsCounter;
                                    newValue[attrs.textProperty] = currentTerm;


                                    data.push(newValue);
                                }

                                aucache[aukey] = data;
                                response(data);
                                toggleIcon(false);
                                //ngExtensions.scopeApply(scope, function () { scope.$$loadingValues = false; });
                            };

                            toggleIcon(true);
                            //ngExtensions.scopeApply(scope, function () { scope.$$loadingValues = true; });
                            if (angular.isFunction(scope.$$source)) {
                                var r = scope.$$source(term);
                                if (r.then)
                                    r.then(onSuccess);
                                else
                                    onSuccess(r);
                            } else
                                $.getJSON(scope.$$source, request, onSuccess, onSearchError);
                        };

                    toggleIcon(false);
                    au.autocomplete({
                        minLength: scope.$$minLength || 0,
                        source: source,
                        change: function (event, ui) {
                            //if editable, then do not clean value
                            if (scope.$$editable) return;

                            var value = au.val();

                            if (ui.item == null || value == '') {
                                au.val('');
                            }

                            //trigger change event
                        },
                        select: function (event, ui) {
                            var value = ui.item[attrs.valueProperty];

                            //Check if value already exists
                            //Push value to array
                            if (!Enumerable.From(scope.$$selectedValues)
                                        .Any(function (x) { return x[attrs.valueProperty] == value; })) {

                                ngExtensions.scopeApply(scope, function () {
                                    if (!attrs.maxSelectedValues || attrs.maxSelectedValues > 1)
                                        scope.$$selectedValues.push(ui.item);
                                    else
                                        scope.$$selectedValues = ui.item;

                                    if (scope.$$onSelect)
                                        scope.$$onSelect(scope.$$selectedValues, au, event, ui);

                                    //if (ui.item.IsNew) ui.item.AddToCache();
                                });


                            }

                            au.val('');
                            event.preventDefault();

                        },

                        search: function (event, ui) {
                            if (scope.$$beforeSearch)
                                scope.$$beforeSearch(scope, event, ui);

                            //$(this).next('span').hide();

                            //#region Init Scroller
                            var auMenu = getAuMenu();
                            auMenu.removeAttr('au-scroll-pp')
                                .removeAttr('au-scroll-ended')
                                .attr('au-scroll-term', au.val());
                            //#endregion

                        },
                        open: function (event, ui) {
                            $(this).autocomplete("widget").scrollTop(0);
                            //$(this).autocomplete("widget").css("overflow-y", "scroll");
                            //$(this).next('span').show();
                        }
                    });

                    //#region Render custom controls

                    //#region AuBtn
                    element.click(function () {
                        if (!maxReached() && !scope.$$disabled) au.autocomplete("search");;
                        au.focus();
                    });
                    //#endregion

                    //#region AuScroll


                    function onScroll() {
                        var auMenu = getAuMenu();
                        //console.log(auMenu.scrollTop());
                        //console.log(auMenu.innerHeight());
                        //console.log(auMenu[0].scrollHeight);
                        if (!isSearching && auMenu.attr('au-scroll-ended') == undefined && auMenu.scrollTop() + auMenu.innerHeight() >= auMenu[0].scrollHeight - (auMenu[0].scrollHeight * 0.05)) {
                            isSearching = true;


                            var waitItem = auMenu.find('li:last').clone();
                            waitItem.removeAttr('class')
                                .addClass('ui-autocomplete-category')
                                .find('a')
                                .removeClass('ui-state-focus')
                                .addClass('ui-autocomplete-loading-center')
                                .html('');

                            waitItem.appendTo(auMenu);

                            var request = {
                                term: auMenu.attr('au-scroll-term'),
                                pp: auMenu.attr('au-scroll-pp') != undefined ? parseInt(auMenu.attr('au-scroll-pp')) : 2
                            };

                            var response = function (data) {

                                $(data).each(function () {
                                    var newItem = auMenu.find('li.ui-menu-item:last').clone();
                                    newItem
                                        .removeAttr('class')
                                        .addClass('ui-menu-item')
                                        .find('a')
                                        .removeClass('ui-state-focus')
                                        .html(highlightUiItem(this));
                                    newItem.data('ui-autocomplete-item', this)
                                        .appendTo(auMenu);
                                });

                                auMenu.attr('au-scroll-pp', request.pp + 1);

                                if ($(data).size() < 15)
                                    auMenu.attr('au-scroll-ended', true);

                                waitItem.remove();
                                isSearching = false;


                            }

                            source(request, response);

                        }
                    };

                    function highlightUiItem(item) {
                        return item[attrs.textProperty].replace(new RegExp('(' + currentTerm + ')', 'gi'), "<b>$1</b>");
                    }

                    if (attrs.scrollable) {

                        var auMenu = getAuMenu();

                        auMenu.scroll(onScroll);

                        au.keyup(function (e) {
                            if (e.keyCode == 40 || e.keyCode == 34)
                                onScroll();

                            //alert(e.keyCode);
                        });

                        element.click(function () {
                            auMenu.scrollTop(0);
                        });
                    }
                    //#endregion

                    //#endregion

                    au.bind('clearCache', function () {
                        aucache = {};
                    });

                    au.keydown(function (e) {
                        //if editable, then do not select first value
                        if (scope.$$editable) return;

                        if (e.keyCode != $.ui.keyCode.TAB) return; // only pay attention to tabs

                        e.keyCode = $.ui.keyCode.DOWN; // fake a down error press
                        $(this).trigger(e);

                        e.keyCode = $.ui.keyCode.ENTER; // fake select the item
                        $(this).trigger(e);

                        au.blur();
                    });

                    au.click(function () {
                        //if editable, then do not clean value
                        if (scope.$$editable) return;

                        au.val('');
                        //au.autocomplete("search");
                    });

                    au.blur(function () {
                        //if editable, then do not clean value
                        if (scope.$$editable) return;

                        au.val('');
                        toggleIcon(false);
                    });

                    au.val('');

                    au.data("ui-autocomplete")._renderItem = function (ul, item) {

                        var anc = "<a>" + highlightUiItem(item) + "</a>";
                        if (item.IsNew) {
                            anc = "<a class='inner-content-ng'><label class='btn btn-xs btn-primary' style='width:100%;text-align:left'>" +
                                "<i class='glyphicon glyphicon-plus'></i> " + highlightUiItem(item) + "</label></a>";
                        }
                        return $("<li>")
                            .data("item.autocomplete", item)
                            .append(anc)
                            .appendTo(ul);
                    }



                    //#endregion


                    scope.$$removeSelectedValue = function (idx) {
                        if (attrs.maxSelectedValues == 1)
                            scope.$$selectedValues = null;
                        else
                            scope.$$selectedValues.splice(idx, 1);

                        au.focus();
                    }

                    scope.$$removeAll = function () {
                        scope.$$selectedValues = Enumerable.From(scope.$$selectedValues)
                            .Where(function (x) { return x.Disabled; }).ToArray();
                        au.focus();
                    }


                    scope.$$maxReached = maxReached;

                    scope.selectedValuesToDisplay = getSelectedValuesToDisplay;


                    function maxReached() {
                        return attrs.maxSelectedValues && scope.selectedValuesToDisplay().length >= attrs.maxSelectedValues;
                    }

                    function getSelectedValuesToDisplay() {
                        if (attrs.maxSelectedValues == 1)
                            return !Object.isNullOrUndefined(scope.$$selectedValues) ? [scope.$$selectedValues] : [];
                        else
                            return scope.$$selectedValues;
                    }
                }
            }
        ]);
})();




