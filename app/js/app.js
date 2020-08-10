// =require fastclick/lib/fastclick.js
// =require jquery/dist/jquery.min.js
// =require jquery-inview/jquery.inview.min.js
// =require most-visible/dist/most-visible.min.js

var SITE = SITE || {},
    supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

( function( $ ) {

    'use strict';

    /* COOKIES
    ************************************************************************/

    var createCookie = function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; sameSite=None; path=/";
    };

    var readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    /* MICROSOFT SUCKS
    ************************************************************************/

    var GetIEVersion = function() {
        var e = window.navigator.userAgent,
            i = e.indexOf("MSIE");
        return i > 0
        ? parseInt(e.substring(i + 5, e.indexOf(".", i)))
        : navigator.userAgent.match(/Trident\/7\./)
        ? 11
        : 0;
    }

    GetIEVersion() > 0 && $("html").addClass("ms ie ie-"+GetIEVersion());

    if (/Edge/.test(navigator.userAgent)) {
        $("body").addClass("ms edge");
    }

    /* GLOBAL FUNCTIONS
    ************************************************************************/

    SITE.exist = function(element) {
        if ($(element).length > 0) {
            return true;
        }
    };

    SITE.check = function(element) {
        $(element).prop('checked', true);
    }

    SITE.uncheck = function(element) {
        $(element).prop('checked', false);
    }

    SITE.fastClick = function() {
        if(supportsTouch) {
            $(function() {
                FastClick.attach(document.body);
            });
        }
    }

    /* COOKIE NOTICE
    ************************************************************************/

    SITE.cookieNotice = function() {

        var cookies = $(".c-cookies");

        if (readCookie('cookies') == null) {
            cookies.addClass("show");
        }
        cookies.find(".c-button").on("click", function() {
            cookies.removeClass("show");
            createCookie('cookies', '1');
        });
    }

    /* HEADER/NAV/SCROLL/EVENT/MISC
    ************************************************************************/

    SITE.bump = function() {

        $("body").addClass('scroll-top');
        var squash = function() {
        var body = $("body"),
            fold = $(window).height(),
            bottom = $(document).height(),
            header = $(".site-header header").outerHeight(),
            onUp = true,
            lastScrollTop = 0;


            var distance = window.pageYOffset || document.documentElement.scrollTop,
                condition = (onUp)
                    ? (distance > lastScrollTop & distance > 0)
                    : distance > 0;


            /* TOP
            ************************************************************************/

            distance > 0
                ? body.removeClass("scroll-top").addClass("scrolled")
                : body.addClass("scroll-top").removeClass("scroll-up");

            /* BOTTOM
            ************************************************************************/

            distance >= ((bottom - 1) - fold)
                ? body.addClass("scroll-bottom")
                : body.removeClass("scroll-bottom");

            /* UP/DOWN
            ************************************************************************/

            condition
                ? body.addClass("scroll-down").removeClass('scroll-up')
                : body.removeClass("scroll-down").addClass('scroll-up');

            /* BELOW THE HEADER
            ************************************************************************/

            distance > header
                ? body.addClass("scroll-below-header")
                : body.removeClass("scroll-below-header");

            /* BELOW THE FOLD
            ************************************************************************/

            distance >= fold
                ? body.addClass("scroll-below-fold")
                : body.removeClass("scroll-below-fold");

            lastScrollTop = distance;

        }

        $(document).on("scroll ready", function() {
            squash();
        });

        $(window).on("resize load",function(){
            squash();
        });

    }


    /* SMOOTH SCROLLING
    ****************************************************************************************************/
    SITE.smoothScrolling = function() {

        $(document).on('click', 'a[href^="#"]', function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 500);
        });

    }

    /* SCROLL TRANSITIONS (apply animation when element in view)
    /* (https://github.com/protonet/jquery.inview)
    ************************************************************************/

    SITE.scrollTransitions = function() {

        $('.animate').on('inview', function(event, isInView) {
            if (isInView) {
                $(this).addClass($(this).data("animation")).addClass("animated").addClass("inview");
            }
        });

    }

    /* Add 'inview' class when in view
    /* (https://github.com/protonet/jquery.inview)
    ************************************************************************/

    SITE.inViewClass = function() {

        $('.wheninview').on('inview', function(event, isInView) {
            if (isInView) {
                $(this).addClass("inview");
            }
        });

    };
    
    /* SECTION MOST VISIBILE
    ************************************************************************/    
    
    SITE.mostVisible = function() {

        var $sections = $('.o-section');

        checkVisibility();

        $(window).on('scroll', function () {
            checkVisibility();
        });

        function checkVisibility() {
            $sections.removeClass('most-visible').mostVisible().addClass('most-visible');
        }
    }
    /* INITIALISATION
    ************************************************************************/

    SITE.init = function() {

        SITE.fastClick();
        SITE.cookieNotice();
        SITE.bump();
        SITE.smoothScrolling();
        SITE.scrollTransitions();
        SITE.inViewClass();
        SITE.mostVisible();

    };

} )( jQuery );

$(document).ready(function() {
    SITE.init();
});