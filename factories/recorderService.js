(function () {
    'use strict';



    var currentMousePos = { left: -1, top: -1 },
        mouseMoveBound = false;


    var serviceId = 'recorder';

    // TODO: replace app with your module name
    angular.module('ngCommonExtensions').factory(serviceId, ['$interval', recorderService]);

    function recorderService($interval) {
        // Define the functions and properties to reveal.
        var service = {
            record: record,
            start: start,
            play: play,
        };


        if (!mouseMoveBound) {
            var mouseDiv = $('<div/>').width(10).height(10).css({ 'border': 'solid 1px red', position: 'absolute', 'background-color': 'red' }).hide().appendTo('body');
            $(document).mousemove(function (event) {
                currentMousePos.left = event.pageX;
                currentMousePos.top = event.pageY;
            });
            mouseMoveBound = true;
        }



        var _values = [],
            _setter = null,
            _paused = false;

        function record(newVal) {

            if (!_paused)
                _values.push({
                    scroll: $(window).scrollTop(),
                    mouse: $.extend({}, currentMousePos),
                    value: $.extend(true, {}, newVal),
                    time: new Date()
                });

        }

        function start(scope, getter, setter) {
            scope.$$objectToRecord = getter;
            _setter = setter;
            scope.$watch('$$objectToRecord()', function (newVal, oldVal) {
                if (newVal !== oldVal)
                    record(newVal);
            }, true);
        }

        function play() {
            var i = 0;
            _paused = true;
            $interval(function () {
                //console.log(new Date(), _values[i].Sponsor)
                if (i < _values.length) {
                    $(window).scrollTop(_values[i].scroll);
                    mouseDiv.show();
                    mouseDiv.offset(_values[i].mouse);
                    _setter(_values[i].value);
                }
                else {
                    _paused = false;
                    mouseDiv.hide();
                }
                i++;
            }, 1000, _values.length + 1);


            //var queue = _values.slice(0),
            //    i = 0;
            //function processNextItem() {
            //    var nextItem = queue.shift();
            //    if (nextItem) {
            //        if (i < _values.length) {
            //            $(window).scrollTop(_values[i].scroll);
            //            mouseDiv.show();
            //            mouseDiv.offset(_values[i].mouse);
            //            _setter(_values[i].value);
            //        }
            //        else {
            //            _paused = false;
            //            mouseDiv.hide();
            //        }
            //        var delay = Math.abs((_values[i + 1] || _values[i]).time - _values[i].time);
            //        i++;
            //        setTimeout(processNextItem, delay);
            //    }
            //}

            //processNextItem();
        }





        return service;

    }
})();