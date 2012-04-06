(function ($) {

    $.masonrywm = function () {
        console.log('init');
    };

    $.masonrywm.prototype.add = function () {
        console.log('add');
    };

    $.masonrywm.prototype.remove = function () {
        console.log('remove');
    };

    $.fn.masonrywm = function (method) {
        if (typeof method === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var instance = $.data(this, 'masonrywm');
                if (!instance) {
                    console.log('No instance');
                    return;
                }
                if (!instance[method]) {
                    console.log('No method');
                    return;
                }
                instance[method].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'masonrywm');
                if (!instance) {
                    $.data(this, 'masonrywm', new $.masonrywm());
                }
            });
        }
        return this;
    };

}(jQuery));