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
