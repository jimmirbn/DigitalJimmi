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
