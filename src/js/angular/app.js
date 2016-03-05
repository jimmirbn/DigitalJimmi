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
