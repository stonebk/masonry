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
                .append($('<span>').lorem(lorem))
                .prepend(close);

        // Make box resizable
        $box.resizable({
            handles: 'all',
            containment: 'parent',
            stop: function () {
                $('#container').masonry('reload');
            }
        });

        return $box;
    }

    function add () {
        $('#container').append(create()).masonry('reload');
    }

    // Initialize masonry
    $('#container').masonry({
        itemSelector: '.box',
        columnWidth: 100,
        isAnimated: true,
        gutterWidth: 5
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
        var $box = $(this).parent();
        $('#container').masonry('remove', $box).masonry('reload');
        return false;
    });
});