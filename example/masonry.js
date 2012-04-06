$(function () {
    var lorem = {
        type: 'words',
        amount: '25',
        ptags: false
    }, GRID = 100;

    function create () {
        var close = $('<a>')
                .attr('href', '#')
                .addClass('close')
                .text('Close'),
            $box = $('<div>')
                .addClass('box')
                .append($('<div>').lorem(lorem))
                .prepend(close),
            $wrap = $('<div>')
                .addClass('box-wrap')
                .append($box);

        // Make box resizable
        $wrap
            .resizable({
                handles: 'all',
                stop: function () {
                    resize($(this));
                    $('#container').masonry('reload');
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
                        $('#container').append(ui.helper);
                    }

                    $('#container').masonry('reload');
                }
            });

        return $wrap;
    }

    /**
     * The resize function provides equivalent resizable 'containment' and
     *     'grid' functionality with a few modifications. Containment allows
     *     resize outside of the container vertically, but not horizontally.
     *     Grid allows snap to functionality but only snaps on stop, allowing
     *     smooth resizing.
     */
    function resize ($box) {
        var $container = $('#container'),
            wbox = $box.width(),             // Width of box
            owbox = $box.outerWidth(true),   // Width of box (including margin)
            wmargin = owbox - wbox,          // Horizontal margin
            wcontainer = $container.width(), // Width of container
            hbox = $box.height(),            // Height of box
            ohbox = $box.outerHeight(true),  // Height of box (including margin)
            hmargin = ohbox - hbox,          // Vertical margin
            remainder;

        // Resize horizontally
        if (owbox > wcontainer) {
            $box.css('width', wcontainer - (wcontainer % GRID) - wmargin);
        } else {
            remainder = owbox % GRID;
            if (remainder > GRID / 2) {
                // Round up
                $box.css('width', owbox - remainder - wmargin + GRID);
            } else {
                // Round down
                $box.css('width', owbox - remainder - wmargin);
            }
        }

        // Resize vertically
        remainder = ohbox % GRID;
        if (remainder > GRID / 2) {
            // Round up
            $box.css('height', ohbox - remainder - hmargin + GRID);
        } else {
            // Round down
            $box.css('height', ohbox - remainder - hmargin);
        }
    }

    function add () {
        $('#container').append(create()).masonry('reload');
    }

    // Initialize masonry
    $('#container').masonry({
        itemSelector: '.box-wrap',
        columnWidth: 100,
        isAnimated: true
    });

    add();
    add();
    add();
    add();

    function refresh () {
        var $boxes = $('.box-wrap'),
            total = $boxes.length,
            count = 0;
        $('.box-wrap').each(function () {
            resize($(this));
            count += 1;
            if (count === total) {
                $('#container').masonry('reload');
            }
        });
    }

    // Prevent other resize events from propagating to parent
    $('body').resize(function (eve) {
        // Refresh on any resize could be a compelling effect too!
        eve.stopPropagation();
    });

    // Detect to window resizes and the fix the size of boxes if they are too
    // big for the container
    var to = false;
    $(window).resize(function () {
        if (to !== false) {
            clearTimeout(to);
        }
        to = setTimeout(function () {
            refresh();
        }, 20);
    });

    // Add new boxes
    $('#add').click(function () {
        add();
        return false;
    });

    $('#container').delegate('.close', 'click', function () {
        var $box = $(this).closest('.box-wrap');
        $('#container').masonry('remove', $box).masonry('reload');
        return false;
    });
});