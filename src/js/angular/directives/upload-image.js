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
