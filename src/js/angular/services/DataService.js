/**
 * @ngInject
 */

function DataService($q, $http, dataUrl) {
    var DataService = {};

    function sendRequest(data) {
        var request = $q.defer();

        $http({
            method : 'POST',
            url : dataUrl,
            data : data
            // data : jQuery.param(data),
            // headers : {'Content-Type': 'application/x-www-form-urlencoded'}

        }).then(function (response) {


            if (angular.isDefined(response.config)) {
                if (angular.isDefined(response.config.data)) {
                    // console.log(response.config.data.action + "::success", response);
                }
            }

            if (response.data.status === 1) {
                // SUCCESS
                request.resolve(response.data);
            }
            else {
                // PARAM ERROR
                request.reject(response);
            }

        }, function (response) {
            // SYSTEM ERROR
            console.log('errorkage', response);
            request.reject(response);
        });

        // RETURN THE PROMISE
        return request.promise;
    }


    DataService.photos = function(nextCursor, prevCursor, limit) {
        
        return sendRequest({
            action : 'instagram',
            limit  : limit || '',
            prevCursor : prevCursor || '',
            nextCursor : nextCursor || ''
        });
    }

    return DataService;
}