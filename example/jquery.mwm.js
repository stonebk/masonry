/**
 * @fileoverview jquery.mwm.js is a jQuery plugin for window management
 *     leveraging the jquery.masonry.js layout plugin.
 * @author brstone@cisco.com (Brian Stone)
 */
(function ($) {

    /**
     * Masonry window management object.
     * @param {object} opts Instance options.
     * @param {object} container The container element.
     * @constructor
     */
    $.mwm = function (opts, container) {

        /**
         * The options for this instance.
         * @type object
         */
        this.opts = $.extend(true, {}, $.mwm.defaults, opts);

        /**
         * The jQuery wrapped container element.
         * @type object
         */
        this.$container = $(container);

        // Initialize the object
        this._init();
    };

    /**
     * Initialize the mwm object.
     */
    $.mwm.prototype._init = function () {
        var that = this,
            timeout = false;

        // Initialize Masonry
        this.$container.masonry({
            itemSelector: this.opts.itemSelector,
            columnWidth: this.opts.grid,
            isAnimated: this.opts.isAnimated
        });

        // Detect document window resize and adjust container windows if they
        //     overflow.
        $(window).resize(function () {
            if (timeout !== false) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                that._refresh();
            }, 20);
        });

        // Prevent other resize events from propagating to window
        $('body').resize(function (eve) {
            // Refresh on any resize could be a compelling effect too!
            eve.stopPropagation();
        });
    };

    /**
     * Refresh all windows.
     */
    $.mwm.prototype._refresh = function () {
        var that = this,
            $windows = $(this.opts.itemSelector),
            total = $windows.length,
            count = 0;

        $windows.each(function () {
            that._resize($(this));
            count += 1;
            if (count === total) {
                that.$container.masonry('reload');
            }
        });
    };

    /**
     * Add a new window to the container.
     * @param {object} $window Window to add to container.
     */
    $.mwm.prototype.add = function ($window) {
        var that = this;

        $window
            .resizable({
                handles: 'all',
                stop: function () {
                    that._resize($(this));
                    that.$container.masonry('reload');
                }
            })
            .draggable({
                stop: function (eve, ui) {
                    var $boxes = ui.helper.siblings(),
                        $box, i, offset, bottom, middle;

                    for (i = 0; i < $boxes.length; i += 1) {
                        $box = $boxes.eq(i);
                        offset = $box.offset();
                        middle = offset.left + ($box.width() / 2);
                        bottom = offset.top + $box.height();

                        if (eve.pageX < middle && eve.pageY < bottom) {
                            $box.before(ui.helper);
                            break;
                        }
                    }

                    // Reached the end of the list - move box to end of DOM
                    if (i === $boxes.length) {
                        that.$container.append(ui.helper);
                    }

                    that.$container.masonry('reload');
                }
            });

        this.$container.append($window).masonry('reload');
    };

    /**
     * The resize function provides equivalent resizable 'containment' and
     *     'grid' functionality with a few modifications. Containment allows
     *     resize outside of the container vertically, but not horizontally.
     *     Grid allows snap to functionality but only snaps on stop, allowing
     *     smooth resizing.
     */
    $.mwm.prototype._resize = function ($box) {
        var $container = $('#container'),
            wbox = $box.width(),             // Width of box
            owbox = $box.outerWidth(true),   // Width of box (including margin)
            wmargin = owbox - wbox,          // Horizontal margin
            wcontainer = $container.width(), // Width of container
            hbox = $box.height(),            // Height of box
            ohbox = $box.outerHeight(true),  // Height of box (including margin)
            hmargin = ohbox - hbox,          // Vertical margin
            grid = this.opts.grid,
            remainder;

        // Resize horizontally
        if (owbox > wcontainer) {
            $box.css('width', wcontainer - (wcontainer % grid) - wmargin);
        } else {
            remainder = owbox % grid;
            if (remainder > grid / 2) {
                // Round up
                $box.css('width', owbox - remainder - wmargin + grid);
            } else {
                // Round down
                $box.css('width', owbox - remainder - wmargin);
            }
        }

        // Resize vertically
        remainder = ohbox % grid;
        if (remainder > grid / 2) {
            // Round up
            $box.css('height', ohbox - remainder - hmargin + grid);
        } else {
            // Round down
            $box.css('height', ohbox - remainder - hmargin);
        }
    };

    /**
     * Remove a window from the container.
     * @param {object} $window The window to remove from the container.
     */
    $.mwm.prototype.remove = function ($window) {
        this.$container.masonry('remove', $window).masonry('reload');
    };

    /**
     * Default settings.
     * @static
     * @class
     */
    $.mwm.defaults = {

        /**
         * Grid size used for masonry columns and snap to positions.
         * @type number
         */
        grid: 100,

        /**
         * Enables animation on layout changes.
         * @type boolean
         */
        isAnimated: true,

        /**
         * Filters item elements to selector. If not set, Masonry defaults to
         *     using the child elements of the container.
         * @type string
         */
        itemSelector: undefined
    };

    /**
     * Add masonry window management as a plugin to jQuery.
     */
    $.fn.mwm = function (method) {
        if (typeof method === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var instance = $.data(this, 'mwm');
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
                var instance = $.data(this, 'mwm');
                if (!instance) {
                    $.data(this, 'mwm', new $.mwm(method, this));
                }
            });
        }
        return this;
    };

}(jQuery));
