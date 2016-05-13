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
