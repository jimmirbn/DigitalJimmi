var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    IPAD: function() {
        return navigator.userAgent.match(/iPad/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
var windowW = $(window).width();
var circleComponent = $('.circle__component');
var close = $('.close');
var circle = $('.circle');
var circle__inner = $('.circle__inner');
// var circle__innerImage = $('.logo');
var circle1 = $('.circle-1');
var circle2 = $('.circle-2');
var circle3 = $('.circle-3');
var circleSvg = $('.circle_svg');
var circleContent = $('.circlecontent');
var personalContent = $('.personalContent');
var personalImage = $('.headImage');
var personalHeader = $('.header');
var intro = $('.intro');
var intro2 = $('.intro2');
var body = $('body');

var dataArray = [];
dataArray[0] = themeUrl + '/assets/img/1.jpg';
dataArray[1] = themeUrl + '/assets/img/2.jpg';
dataArray[2] = themeUrl + '/assets/img/3.jpg';
dataArray[3] = themeUrl + '/assets/img/4.jpg';
dataArray[4] = themeUrl + '/assets/img/5.jpg';
dataArray[5] = themeUrl + '/assets/img/6.jpg';

var thisId = 0;
var loopImage = null;

function whichTransitionEvent() {
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

var transitionEvent = whichTransitionEvent();

function whichAnimationEvent() {
    var t,
        el = document.createElement("fakeelement");

    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    }

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

var animationEvent = whichAnimationEvent();

circle.one(animationEvent,
    function(event) {
        intro.addClass('active');
        intro2.addClass('active');
    });


function startImageLoop() {
    loopImage = window.setInterval(function() {
        $('.headImage').attr('src', dataArray[thisId]);
        thisId++; //increment data array id
        if (thisId === 5) {
            thisId = 0;
        } //repeat from start
    }, 3000);
}
var modalOpen = false;

function openFinish() {
    modalOpen = true;
}

function closeFinish() {
    intro.addClass('active');
    intro2.addClass('active');
    if (windowW > 700 || !isMobile.any) {
        circleSvg.fadeIn("slow");
    }
    circleComponent.fadeIn("slow");
    modalOpen = false;
}

function openModal() {
    if (windowW > 700 || !isMobile.any) {
        intro.removeClass('active');
        intro2.removeClass('active');

        self = $(this);
        if (!circle__inner.hasClass('active')) {
            if (self.hasClass('circle__component--1')) {
                circle__inner.addClass('active-circle-1')
                startImageLoop();
            }
            if (self.hasClass('circle__component--2')) {
                circle__inner.addClass('active-circle-2')
            }
            if (self.hasClass('circle__component--3')) {
                circle__inner.addClass('active-circle-3')
            }
            circle__inner.addClass('active');
            circle.addClass('active');
            body.addClass('backdrop');
            TweenLite.to(circle__inner, 1, {
                css: {
                    width: "700px",
                    height: "auto",
                    marginLeft: "-350px",
                    marginTop: "auto"
                },
                onComplete: openFinish
            });
            circleSvg.css('display', 'none');
            circleComponent.css('display', 'none');

        }
        circle__inner.one(animationEvent, function() {
            close.addClass('active');
            if (self.hasClass('circle__component--1')) {
                circle1.addClass('active');
            }
            if (self.hasClass('circle__component--2')) {
                circle2.addClass('active');
            }
            if (self.hasClass('circle__component--3')) {
                circle3.addClass('active');
            }
        });
    } else {
        intro.removeClass('active');
        intro2.removeClass('active');

        self = $(this);
        if (!circle__inner.hasClass('active')) {
            if (self.hasClass('circle__component--1')) {
                circle__inner.addClass('active-circle-1')
                startImageLoop();
            }
            if (self.hasClass('circle__component--2')) {
                circle__inner.addClass('active-circle-2')
            }
            if (self.hasClass('circle__component--3')) {
                circle__inner.addClass('active-circle-3')
            }
            TweenLite.to(circle__inner, 0.3, {
                css: {
                    width: "100%",
                    height: "100%",
                    marginLeft: "0",
                    marginTop: "0",
                    top: "auto",
                    left: "auto",
                },
                onComplete: openFinish
            });

        }
        close.addClass('active');
        if (self.hasClass('circle__component--1')) {
            circle1.addClass('active');
        }
        if (self.hasClass('circle__component--2')) {
            circle2.addClass('active');
        }
        if (self.hasClass('circle__component--3')) {
            circle3.addClass('active');
        }
    }
}

circleComponent.on('click', openModal);
close.on('click', closeCircle);

function closeCircle() {
    if (windowW > 700 || !isMobile.any) {
        modalOpen = false;
        if (circle__inner.hasClass('active') && intro.hasClass('active') && intro2.hasClass('active')) {
            intro.removeClass('active');
            intro2.removeClass('active');
        }
        clearInterval(loopImage);
        // window.event.stopPropagation();
        if (circle__inner.hasClass('active')) {
            circle__inner.removeClass('active').addClass('closed');
            TweenLite.to(circle__inner, 1, {
                css: {
                    width: "200px",
                    height: "200px",
                    marginLeft: "-100px",
                    marginTop: "-100px"
                },
                onComplete: closeFinish
            });
            if (circle__inner.hasClass('active-circle-1') || circle__inner.hasClass('active-circle-2') || circle__inner.hasClass('active-circle-3')) {
                circle__inner.removeClass('active-circle-1').removeClass('active-circle-2').removeClass('active-circle-3');
            }
            close.removeClass('active');
            body.removeClass('backdrop');

            circleContent.removeClass('active');
        }
        circle__inner.one(animationEvent, function() {
            circle__inner.removeClass('closed');
            circle.removeClass('active');
        });
    } else {
        modalOpen = false;
        clearInterval(loopImage);
        if (intro.hasClass('active') && intro2.hasClass('active')) {
            intro.removeClass('active');
            intro2.removeClass('active');
        }
        TweenLite.to(circle__inner, 0.3, {
            css: {
                width: "200px",
                height: "200px",
                marginLeft: "-100px",
                marginTop: "-100px",
                top: "50%",
                left: "50%"
            },
            onComplete: closeFinish
        });
        close.removeClass('active');
        circleContent.removeClass('active');
        if (circle__inner.hasClass('active-circle-1') || circle__inner.hasClass('active-circle-2') || circle__inner.hasClass('active-circle-3')) {
            circle__inner.removeClass('active-circle-1').removeClass('active-circle-2').removeClass('active-circle-3');
        }

    }

}

var className = 'active';

personalContent.scroll(function() {
    if (personalContent.scrollTop() >= 50) {
        personalImage.addClass(className);
        personalHeader.addClass(className)
    } else {
        personalImage.removeClass(className);
        personalHeader.removeClass(className);
    }
});

$('.modal-cover').click(function(e) {
    if (modalOpen) {
        closeCircle();
    }
});
