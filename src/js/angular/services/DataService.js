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
