$(function () {
    var lorem = {
        type: 'words',
        amount: '25',
        ptags: false
    };

    function create () {
        var close = $('<a>').attr('href', '#').addClass('close').text('Close'),
            box = $('<div>').addClass('box').lorem(lorem).prepend(close);
        return box;
    }

    function add () {
        $('#container').append(create()).masonry('reload');
    }

    // Initialize masonry
    $('#container').masonry({
        itemSelector: '.box',
        columnWidth: 100,
        isAnimated: true
    });

    add();
    add();
    add();
    add();

    // Add new boxes
    $('#add').click(add);

    $('#container').delegate('.close', 'click', function () {
        var $box = $(this).parent();
        $('#container').masonry('remove', $box).masonry('reload');
    });
});