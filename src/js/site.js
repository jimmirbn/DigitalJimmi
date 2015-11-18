/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.4'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

function GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");

    // If IE, return version number.
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));

    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        return 11;
    else
        return 0; //It is not IE
}

if (GetIEVersion() > 0) {
    console.log("This is IE " + GetIEVersion());
    $('#ieModal').modal('show');
};

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

            // circle__inner.addClass('active').animate({
            //     width: "700px",
            //     height: "700px",
            //     marginLeft: "-350px",
            //     marginTop: "-350px",
            // }, 1000);
            // circle__innerImage.removeClass('active').addClass('not-active');
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
        // circle__inner.one(animationEvent, function() {
        //     close.addClass('active');
        //     if (self.hasClass('circle__component--1')) {
        //         circle1.addClass('active');
        //     }
        //     if (self.hasClass('circle__component--2')) {
        //         circle2.addClass('active');
        //     }
        //     if (self.hasClass('circle__component--3')) {
        //         circle3.addClass('active');
        //     }
        // });
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
            // circle__innerImage.removeClass('not-active').addClass('active');
            // setTimeout(function() {
            //     intro.addClass('active');
            //     intro2.addClass('active');
            // }, 600);
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
