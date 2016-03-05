if (typeof console === 'undefined') {
  console = {
    log: function() {}
  };
}
(function() {
angular.element(document).ready(function(event) {

    var modules = [];

    angular.module('digital', modules)

    // .controller('HeaderCtrl', HeaderCtrl)

    .factory('DataService', DataService)

    .directive('profileForm', profileForm)
    .directive('profilePicture', profilePicture)
    // .directive('resolver', resolver)

    .run(run);

    // Bootstrap manually
    angular.bootstrap(angular.element('#ng-app'), ['digital']);
});

/**
 * @ngInject
 */
function run() {

    // Use modernizr to install shims and polyfils
    Modernizr.load([
    {
        test: Modernizr.mq('only all'),
        nope: 'http://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js'
    }
    ]);
}
/**
 * @ngInject
 */
function profileForm() {

    function ProfileFormCtrl($scope, DataService) {
        // this.formData = {};
        this.errorMsg = undefined;
        this.isSubmitting = false;
        this.storeID = null;
        this.stores = {};
        this.btnLabel = "BLIV 5 STAR HOST";

        // if ($state.current.name == "profile") this.btnLabel = "OPDATER PROFIL";

        this.user = {};

        function submit(isValid) {
            // console.log("submit", isValid);
            if (this.isSubmitting) return;
            // console.log(this.user)
            this.errorMsg = undefined;
            if (isValid) {
                this.isSubmitting = true;
                // submit

                if ($scope.profilePictureCtrl.base64 != "") this.user.picture_base64 = $scope.profilePictureCtrl.base64;
                if ($scope.profilePictureCtrl.orientation != "") this.user.picture_orientation = $scope.profilePictureCtrl.orientation;

                DataService.updateUser(this.user)
                    .then(angular.bind(this, onProfileSuccess), angular.bind(this, onProfileError));

            } else {
                this.errorMsg = "Indtast din e-mail & vælg din butik.";
            }
        };

        this.dropdownSelect = function dropdownSelect(id, index) {
            this.user.store_id = id;
            this.storeIndex = index;
            angular.element('.dropdown-toggle').dropdown('toggle');
            // console.log(this.user.store_id, this.storeIndex);
        };

        var vm = this;

        function onStoresSuccess(response) {
            vm.stores = response.data;
            this.storeIndex = _.findIndex(vm.stores, { 'id': this.user.store_id });
        }

        function onStoresError(error) {
            console.log(error);
        }


        function onProfileSuccess(response) {
            console.log(response);
            // flux.dispatch(Actions.USER_LOAD, true);
            // ProxyService.initPoll();
            // $state.go('dashboard');
        }

        function onProfileError(error) {
            this.errorMsg = "Der opstod en fejl - prøv igen.";
            this.isSubmitting = false;
        }

        // DataService.getStores()
        //     .then(angular.bind(this, onStoresSuccess), angular.bind(this, onStoresError));
    }

    return {
        restrict: 'E',
        controller: ProfileFormCtrl,
        controllerAs: 'profileformctrl',
        bindToController: true,
        template: [
            '<form>',
            '<profile-picture></profile-picture>',
            //'<button ng-click="profileformctrl.submit(profileForm.$valid)">send</button>',
            '</form>'
        ].join(''),
        replace: true
    };

}

/**
 * @ngInject
 */
function profilePicture() {

    function ProfilePictureCtrl($scope, DataService, $attrs) {

        var vm = this;
        vm.base64 = "";
        this.message = undefined;
        this.isSubmitting = false;
        this.storeID = null;
        this.stores = {};
        this.btnLabel = "BLIV 5 STAR HOST";

        // if ($state.current.name == "profile") this.btnLabel = "OPDATER PROFIL";

        this.user = {};
        $attrs.$observe("src", function(src) {
                console.log("s: " + src)
                vm.profile_picture = src;
            })
            // getElementById
        function $id(id) {
            return document.getElementById(id);
        }
        // call initialization file
        if (window.File && window.FileList && window.FileReader) {
            Init();
        }

        // initialize
        function Init() {
            var fileselect = $id("fileselect"),
                filedrag = $id("filedrag"),
                submitbutton = $id("submitbutton");

            // file select
            fileselect.addEventListener("change", FileSelectHandler, false);

            // is XHR2 available?
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {

                // file drop
                // dragstart
                filedrag.addEventListener("dragstart", fileDragStart, false);
                filedrag.addEventListener("dragend", fileDragEnd, false);
                filedrag.addEventListener("dragover", FileDragHover, false);
                filedrag.addEventListener("dragleave", FileDragHover, false);
                filedrag.addEventListener("drop", FileSelectHandler, false);
                filedrag.style.display = "block";

                // remove submit button
                // submitbutton.style.display = "none";
            }

        }

        function fileDragStart(e) {
            submitbutton.style.display = "none";
        }

        function fileDragEnd(e) {
            submitbutton.style.display = "block";
        }

        // file drag hover
        function FileDragHover(e) {
            e.stopPropagation();
            e.preventDefault();
            //e.target.className = (e.type == "dragover" ? "hover" : "");
        }

        // file selection
        function FileSelectHandler(e) {

            console.log("fs handler")

            // cancel event and hover styling
            FileDragHover(e);

            // fetch FileList object
            var files = e.target.files || e.dataTransfer.files;
            console.log(files)
            readURL(files, "preview");

            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                ParseFile(f);
            }

        }

        function ParseFile(file) {
            console.log(
                "<p>File information: <strong>" + file.name +
                "</strong> type: <strong>" + file.type +
                "</strong> size: <strong>" + file.size +
                "</strong> bytes</p>"
            );
        }

        function readURL(files, id) {
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    vm.base64 = e.target.result;

                    var bin = atob(vm.base64.split(',')[1]);
                    var exif = EXIF.readFromBinaryFile(new BinaryFile(bin));
                    console.log("orientation: " + exif.Orientation)
                    vm.orientation = exif.Orientation;

                    vm.submit();
                    $('#' + id).attr('src', vm.base64);

                    var iOS = !!navigator.userAgent.match(/iPad/i) || !!navigator.userAgent.match(/iPhone/i);
                    var webkit = !!navigator.userAgent.match(/WebKit/i);
                    var iOSSafari = iOS && webkit && !navigator.userAgent.match(/CriOS/i);

                    if (!iOSSafari) {
                        $('#' + id).attr("class", "rotate--" + exif.Orientation);
                    }

                    objectFit.polyfill({
                        selector: '#' + id, // this can be any CSS selector
                        fittype: 'cover', // either contain, cover, fill or none
                        disableCrossDomain: 'true' // either 'true' or 'false' to not parse external CSS files.
                    });
                }
                reader.readAsDataURL(files[0]);
            }
        }
        this.submit = function submit() {
            console.log("submitting");
            if (this.isSubmitting) return;

            this.isSubmitting = true;

            if (vm.base64 != "") this.user.picture_base64 = vm.base64;
            if (vm.orientation != "") this.user.picture_orientation = vm.orientation;


            DataService.updateUser(this.user)
                .then(angular.bind(this, onProfileSuccess), angular.bind(this, onProfileError));
        };



        function onProfileSuccess(response) {
            console.log(response);
            this.message = "Billedet er nu uploadet.";
            this.isSubmitting = false;
            setTimeout(function() {
                window.location = window.location.pathname;
            }, 3000);
        }

        function onProfileError(error) {
            this.message = "Der opstod en fejl - prøv igen.";
            this.isSubmitting = false;
        }
    }

    // TODO ng-model så det er nemt at få fat i base64
    return {
        restrict: 'E',
        controller: ProfilePictureCtrl,
        controllerAs: 'profilePictureCtrl',
        bindToController: true,
        template: [
            '<div class="upload-foto">',
            '<div ng-class="{active: profilePictureCtrl.isSubmitting}" class="sk-fading-circle spinner">',
              '<div class="sk-circle1 sk-circle"></div>',
              '<div class="sk-circle2 sk-circle"></div>',
              '<div class="sk-circle3 sk-circle"></div>',
              '<div class="sk-circle4 sk-circle"></div>',
              '<div class="sk-circle5 sk-circle"></div>',
              '<div class="sk-circle6 sk-circle"></div>',
              '<div class="sk-circle7 sk-circle"></div>',
              '<div class="sk-circle8 sk-circle"></div>',
              '<div class="sk-circle9 sk-circle"></div>',
              '<div class="sk-circle10 sk-circle"></div>',
              '<div class="sk-circle11 sk-circle"></div>',
              '<div class="sk-circle12 sk-circle"></div>',
            '</div>',
            '<p class="message" ng-class="{active: profilePictureCtrl.message}" ng-bind="profilePictureCtrl.message"></p>',
            '<div id="filedrag" class="upload-foto__image"></div>',
            '<div ng-class="{done: profilePictureCtrl.message, submitting: profilePictureCtrl.isSubmitting}" class="fileUpload btn btn-primary">',
            '<span>Upload billede</span>',
            '<input type="file" class="upload" id="fileselect" accept="image/*">',
            '</div>',
            '</div>'
        ].join(''),
        replace: true,
    };

}

/**
 * @ngInject
 */

function DataService($q, $http) {
    var api = {};

    function sendRequest(data) {
        var request = $q.defer();

        $http({
            method: 'POST',
            url: ajaxUrl,
            data: jQuery.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).then(function(response) {

            if (angular.isDefined(response.config)) {
                if (angular.isDefined(response.config.data)) {
                    // console.log(response.config.data + "::success", response);
                }
            }

            if (response.data.status === 1) {
                // SUCCESS
                request.resolve(response.data);
            } else {
                // PARAM ERROR
                request.reject(response);
            }

        }, function(response) {

            // SYSTEM ERROR
            request.reject(response);
        });

        return request.promise;
    }



    api.updateUser = function UpdateUser(formData) {
        console.log("formdata", formData);
        return sendRequest({
            action: 'gateway',
            task: 'updateUser',
            // email: formData.email,
            // store_id: formData.store_id,
            picture_base64: formData.picture_base64,
            picture_orientation: formData.picture_orientation,
            // token: $cookies.get('token')
        });
    };


    return api;
}
DataService.$inject = ['$q', '$http'];

/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function(element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$dialog = this.$element.find('.modal-dialog')
        this.$backdrop = null
        this.isShown = null
        this.originalBodyPad = null
        this.scrollbarWidth = 0
        this.ignoreBackdropClick = false

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function() {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.VERSION = '3.3.4'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function(_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.setScrollbar()
        this.$body.addClass('modal-open')

        this.escape()
        this.resize()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.$dialog.on('mousedown.dismiss.bs.modal', function() {
            that.$element.one('mouseup.dismiss.bs.modal', function(e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
            })
        })

        this.backdrop(function() {
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
                .one('bsTransitionEnd', function() {
                    that.$element.trigger('focus').trigger(e)
                })
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function(e) {
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

    Modal.prototype.enforceFocus = function() {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function(e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }

    Modal.prototype.resize = function() {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    }

    Modal.prototype.hideModal = function() {
        var that = this
        this.$element.hide()
        this.backdrop(function() {
            that.$body.removeClass('modal-open')
            that.resetAdjustments()
            that.resetScrollbar()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function(callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(this.$body)

            this.$element.on('click.dismiss.bs.modal', $.proxy(function(e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false
                    return
                }
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide()
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

            var callbackRemove = function() {
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

    Modal.prototype.handleUpdate = function() {
        this.adjustDialog()
    }

    Modal.prototype.adjustDialog = function() {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    }

    Modal.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    }

    Modal.prototype.checkScrollbar = function() {
        var fullWindowWidth = window.innerWidth
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect()
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
        this.scrollbarWidth = this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function() {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        this.originalBodyPad = document.body.style.paddingRight || ''
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function() {
        this.$body.css('padding-right', this.originalBodyPad)
    }

    Modal.prototype.measureScrollbar = function() { // thx walsh
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
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal

    $.fn.modal = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function() {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function(showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function() {
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

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


var slider = $('.slider-container');

slider.slick({
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    slidesToShow: 1,
    autoplay: false,
    pauseOnHover: false
});
var images = [];

var pageNr = 0;
if (slider.length) {

    function getImages(pageNr) {
        console.log("Image", pageNr);

        $.ajax({
            method: "POST",
            url: ajaxUrl,
            data: { action: "loadimages", imageNr: pageNr },
            dataType: "json",
        }).done(function(data) {
            // console.log(data);
            // console.log("images array", images);

            var exist;
            if (data.data.images !== null) {
                exist = images.indexOf(data.data.images.profile_picture);

            }
            // console.log(exist);
            if (exist === -1 && data.data.images !== null) {
                images.push(data.data.images.profile_picture);
                // console.log("images array", images);

                slider.slick('slickAdd', '<div class="slide" style="background-image:url(' + data.data.images.profile_picture + ');"></div>', true);

                setTimeout(function() {
                    getImages(pageNr + 1);
                }, 10000);
            } else if (exist !== -1 || data.data.images === null) {
                slider.slick('slickPlay');
                console.log("Trying again", pageNr);
                setTimeout(function() {
                    getImages(pageNr);
                }, 10000);
            }

        });
    }
    getImages(pageNr);
}



var konf = getUrlParameter('response');

if (konf === 'fu-sent') {
    $('.fileUpload').css('display', 'none');
    $('.ugc-notice').text('Billedet er uploadet');
    $('.ugc-notice').append('<img src="https://media.giphy.com/media/TAoXY6URAcUbS/giphy.gif">')
    setTimeout(function() {
        window.location = window.location.pathname;
    }, 2000);
}

})();