if (typeof console === 'undefined') {
  console = {
    log: function() {}
  };
}
(function() {
angular.element(document).ready(function(event) {

    var modules = [];

    angular.module('digital', modules)

    .factory('DataService', DataService)

    .controller('MainCtrl', MainCtrl)
    // .directive('profileForm', profileForm)
    .directive('uploadImage', uploadImage)
    .directive('slider', slider)

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


function MainCtrl($scope, DataService) {
    var vm = this;
    // vm.images = {};

    // vm.imageNr;
    // vm.totalImages = 0;

    // DataService.loadImages(vm.imageNr)
    //     .then(angular.bind(this, onImageSuccess), angular.bind(this, onImageError));


    // function onImageSuccess(response) {
    //     vm.images = response.data.images;
    //     console.log(vm.images);
    //     // $ionicSlideBoxDelegate.update();
    //     // var exist;
    //     // if (vm.imagesNY !== null) {
    //     //     exist = vm.images.indexOf(vm.imagesNY.profile_picture);
    //     // }
    //     // // console.log(exist);
    //     // if (exist === -1 && vm.imagesNY !== null) {
    //     //     vm.images.push(vm.imagesNY.profile_picture);
    //     //     // console.log("images array", images);

    //     //     elem.slick('slickAdd', '<div class="slide" style="background-image:url(' + vm.imagesNY.profile_picture + ');"><button id="' + vm.imagesNY.id + '" class="deleteBtn" type="button">DELETE</button></div>', true);

    //     //     setTimeout(function() {
    //     //         vm.getImages(pageNr + 1);
    //     //     }, 10000);
    //     // } else if (exist !== -1 || vm.imagesNY === null) {
    //     //     slider.slick('slickPlay');
    //     //     console.log("Trying again", pageNr);
    //     //     setTimeout(function() {
    //     //         vm.getImages(pageNr);
    //     //     }, 10000);
    //     // }

    //     setTimeout(function() {
    //         // vm.getImages(imageNr);
    //     }, 10000);
    // }

    // vm.getImages = function getImages() {
    //     DataService.loadImages()
    //         .then(angular.bind(this, onImageSuccess), angular.bind(this, onImageError));
    // }


    // function onImageError(response) {
    //     console.log("error", response);
    // }

}
MainCtrl.$inject = ['$scope', 'DataService'];

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
function slider() {

    function SliderCtrl($scope, DataService, $element, $timeout) {

        var elem = $element;
        var vm = this;

        var imageNr = 0;
        var slider = elem;
        vm.slideIndex;

        vm.isLoading = false;

        slider.slick({
            infinite: true,
            speed: 500,
            autoplaySpeed: 5000,
            fade: true,
            cssEase: 'linear',
            slidesToShow: 1,
            autoplay: true,
            pauseOnHover: false
        });

        DataService.loadImages()
            .then(angular.bind(this, onImageSuccess), angular.bind(this, onImageError));

        function onImageSuccess(response) {
            vm.totalOrigImages = parseInt(elem.attr('orig'));
            var newImages = response.data.images;
            var newItemsLength = newImages.length;
            var newItems = newImages.splice(vm.totalOrigImages, newItemsLength);
            if (newItemsLength !== vm.totalOrigImages) {
                slider.slick('slickPause');
                vm.isLoading = true;
                if (vm.totalOrigImages !== 0) {
                    vm.slideIndex = elem.find('.slick-active').data('slick-index');
                }
                _.each(newItems, function(item, index) {
                    var newImageUrl = item['profile_picture'];
                    var newImageId = item['id'];
                    if (vm.totalOrigImages === 0) {
                        slider.slick('slickAdd', '<div class="slide" style="background-image:url(' + newImageUrl + ');"><button id="' + newImageId + '" class="deleteBtn" type="button">DELETE</button></div>');
                    } else {
                        slider.slick('slickAdd', '<div class="slide" style="background-image:url(' + newImageUrl + ');"><button id="' + newImageId + '" class="deleteBtn" type="button">DELETE</button></div>', 0);
                    }

                });
                slider.slick('slickPause');

                if (vm.totalOrigImages !== 0) {
                    slider.slick('slickGoTo', parseInt(vm.slideIndex + 1));
                }
                slider.slick('slickPlay');
                vm.isLoading = false;

                elem.attr('orig', newItemsLength);
            }

            $timeout(function() {
                DataService.loadImages()
                    .then(angular.bind(this, onImageSuccess), angular.bind(this, onImageError));
            }, 3000);
        }

        function onImageError(response) {
            console.log("error", response);
        }

    }

    return {
        controller: SliderCtrl,
        controllerAs: 'sliderctrl',
        bindToController: true,
        restrict: 'AE',
    }
}

/**
 * @ngInject
 */
function uploadImage() {

    function UploadImageCtrl($scope, DataService, $attrs) {

        var vm = this;
        vm.base64 = "";
        this.message = undefined;
        this.isSubmitting = false;


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
            console.log(error);
            this.message = "Der opstod en fejl - prøv igen.";
            this.isSubmitting = false;
        }
    }

    // TODO ng-model så det er nemt at få fat i base64
    return {
        restrict: 'E',
        controller: UploadImageCtrl,
        controllerAs: 'uploadimagectrl',
        bindToController: true,
        template: [
            '<div class="upload-foto">',
            '<div ng-class="{active: uploadimagectrl.isSubmitting}" class="sk-fading-circle spinner">',
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
            '<p class="message" ng-class="{active: uploadimagectrl.message}" ng-bind="uploadimagectrl.message"></p>',
            '<div id="filedrag" class="upload-foto__image"></div>',
            '<div ng-class="{done: uploadimagectrl.message, submitting: uploadimagectrl.isSubmitting}" class="fileUpload btn btn-primary">',
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
        return sendRequest({
            action: 'gateway',
            task: 'updateUser',
            picture_base64: formData.picture_base64,
            picture_orientation: formData.picture_orientation,
        });
    };

    api.loadImages = function loadImages() {
        return sendRequest({
            action: 'loadimages',
        });
    };

    return api;
}
DataService.$inject = ['$q', '$http'];

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

})();