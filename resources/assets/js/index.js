$('.navbar').each(function () {

    $(this).find('a.nav-link').each(function () {
        if ($(this).attr('href') == window.location.pathname) {
            $(this).addClass('active');
        }
    });

});