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
     * Reload the windows.
     */
    $.mwm.prototype.reload = function () {
        this.$container.masonry('reload');
    };

    /**
     * Add a new window to the container.
     * @param {object} $window Window to add to container.
     * @param {object} opts Options to be applied to this window.
     */
    $.mwm.prototype.add = function ($window, opts) {
        var that = this;

        $window
            .resizable({
                minWidth: this.opts.minWidth,
                minHeight: this.opts.minHeight,
                start: function () {
                    // Callback
                    if (opts && opts.resizeStart) {
                        opts.resizeStart();
                    }
                },
                stop: function () {
                    that._resize($(this));
                    that.$container.masonry('reload');

                    // Callback
                    if (opts && opts.resizeStop) {
                        opts.resizeStop();
                    }
                }
            })
            .draggable({
                handle: this.opts.handle,
                start: function (eve, ui) {
                    // Callback
                    if (opts && opts.dragStart) {
                        opts.dragStart();
                    }

                    var $this = $(this);
                    $this.data('mwm.offset', $this.offset());
                },
                stop: function (eve, ui) {
                    var $this = $(this),
                        offset, myOffset = $this.offset(),
                        x, myX = myOffset.left + ($this.width() / 2),
                        y, myY = myOffset.top,
                        $box, $boxes = $(that.opts.itemSelector),
                        i, equal;

                    for (i = 0; i < $boxes.length; i += 1) {
                        $box = $boxes.eq(i);
                        equal = $box.get(0) === $this.get(0);

                        // If elements are the same, use the original offset.
                        // The same element must be completely outside of its
                        // own footprint to be compared against lesser elements.
                        if (equal) {
                            offset = $box.data('mwm.offset');

                            // Comparing midpoints on the x plane, so add width
                            // to midpoint
                            x = offset.left + ($box.width() / 2) + $box.width();
                        } else {
                            offset = $box.offset();
                            x = offset.left + ($box.width() / 2);
                        }

                        y = offset.top + $box.height();

                        if (myX < x && myY < y) {
                            // No change needed if this is the same element
                            if (!equal) {
                                $box.before($this);
                            }
                            break;
                        }
                    }

                    // Reached the end of the list - move box to end of DOM
                    if (i === $boxes.length) {
                        that.$container.append($this);
                    }

                    that.$container.masonry('reload');

                    // Callback
                    if (opts && opts.dragStop) {
                        opts.dragStop();
                    }
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
        var $container = this.$container,
            wbox = $box.width(),             // Width of box
            owbox = $box.outerWidth(true),   // Width of box (including margin)
            wmargin = owbox - wbox,          // Horizontal margin
            wcontainer = $container.width(), // Width of container
            hbox = $box.height(),            // Height of box
            ohbox = $box.outerHeight(true),  // Height of box (including margin)
            hmargin = ohbox - hbox,          // Vertical margin
            grid = this.opts.grid,
            wmin = $box.resizable('option', 'minWidth'),
            width, remainder;

        // Resize horizontally
        if (owbox > wcontainer) {
            width = wcontainer - (wcontainer % grid) - wmargin;
        } else {
            remainder = owbox % grid;
            if (remainder > grid / 2) {
                // Round up
                width = owbox - remainder - wmargin + grid;
            } else {
                // Round down
                width = owbox - remainder - wmargin;
            }
        }

        // Make sure size is at least min width
        if (width < wmin) {
            width = wmin;
        }

        // Resize
        $box.css('width', width);

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
