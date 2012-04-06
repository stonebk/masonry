$(function () {
    var lorem = {
        type: 'words',
        amount: '25',
        ptags: false
    };

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
        $wrap.resizable({
            handles: 'all',
            grid: 100,
            stop: function () {
                resize($(this));
                $('#container').masonry('reload');
            }
        });

        return $wrap;
    }

    function resize ($box) {
        var $container = $('#container'),
            wthis = $box.width(),
            owthis = $box.outerWidth(true),
            margin = owthis - wthis,
            wcontainer = $container.width(),
            grid = $box.resizable('option', 'grid')[0];

        if (owthis > wcontainer) {
            $box.css('width', wcontainer - (wcontainer % grid) - margin);
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