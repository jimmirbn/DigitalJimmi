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
