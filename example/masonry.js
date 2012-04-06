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
                var $this = $(this),
                    $container = $('#container'),
                    wthis = $this.width(),
                    owthis = $this.outerWidth(true),
                    margin = owthis - wthis,
                    wcontainer = $container.width(),
                    grid = $this.resizable('option', 'grid')[0];

                if (owthis > wcontainer) {
                    $this.css('width', wcontainer - (wcontainer % grid) - margin);
                }

                $container.masonry('reload');
            }
        });

        return $wrap;
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