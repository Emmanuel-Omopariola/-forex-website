// Headhesive //
$(function() {
    if(typeof Headhesive !== 'undefined') {
        // Initialise with options
        var banner = new Headhesive('.banner', options = {
            offset: '#showHere',
            classes: {
                clone: 'banner--clone',
                stick: 'banner--stick',
                unstick: 'banner--unstick'
            }
        });
    }
});

// Scroll navigation //
$(document).ready(function() {
    $('.nav-menu a').on('click', function() {
        var scrollAnchor = $(this).attr('data-scroll'),
            scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top;
        $('body,html').animate({
            scrollTop: scrollPoint
        }, 500);
        return false;
    });

    $(window).scroll(function() {
        var windscroll = $(window).scrollTop();
        $('.wrapper section').each(function(i){
            if($(this).position().top <= windscroll + 10) {
                $('.nav-menu a.active').removeClass('active');
                $('.nav-menu a').eq(i).addClass('active');
            }
        });
    }).scroll();
});

// Scroll 2 //
$(function() {
    $('.scroll a, .scroll-home').click(function(e) {
        e.preventDefault();
        $('body, html').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });
});

// Scroll 3 //
$(function(){
    $('.scroll-link').on('click', function(e){
        $('html,body').stop().animate({ scrollTop: $('#temporary_block2').offset().top }, 500);
        e.preventDefault();
    });
});

// Feedback form //
$(window, document, undefined).ready(function() {

    $('input').blur(function() {
        var $this = $(this);
        if ($this.val())
            $this.addClass('used');
        else
            $this.removeClass('used');
    });

    $('textarea').blur(function() {
        var $this = $(this);
        if ($this.val())
            $this.addClass('used');
        else
            $this.removeClass('used');
    });

});


// BF //
$(function() {
    $('.bf-btn').click(function(){
        var some = $('.bf-block');
        var some1 = $('.bf-block_down');
        some1.removeClass('bf-block_down').addClass('bf-block');
        some.removeClass('bf-block').addClass('bf-block_down');
    })
});
