$(function () {
    function add () {
        var lorem = {
                type: 'words',
                amount: '25',
                ptags: false
            },
            close = $('<a>')
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

        $('#container').mwm('add', $wrap);
    }

    // Handler to add new boxes
    $('#add').click(function () {
        add();
        return false;
    });

    // Initialize masonry window management
    $('#container').mwm({
        itemSelector: '.box-wrap'
    });

    // Add some initial boxes
    add();
    add();
    add();
    add();

    $('#container').delegate('.close', 'click', function () {
        var $box = $(this).closest('.box-wrap');
        $('#container').mwm('remove', $box);
        return false;
    });
});
