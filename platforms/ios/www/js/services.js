angular.module('botaniser.services', [])

.factory('SpeciesList', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var speciesList = [
        { id: 0, name: 'Acacia', description: 'Some Acacia', image_url: 'Test.jpg', occurrenceCount: 10, score: 5 },
        { id: 1, name: 'Banksia', description: 'Some Banksia', image_url: 'Test.jpg', occurenceCount: 20, score: 3 }
    ];

    return {
        all: function() {
            return speciesList;
        },
        get: function(speciesId) {
            // Simple index lookup
            return speciesList[speciesId];
        }
    }
})

.factory('Camera', ['$q', function($q) {
    return {
        getPicture: function(options) {
            var q = $q.defer();

            navigator.camera.getPicture(function(result) {
                // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }
}])

.factory('GeoLocation', function($rootScope) {
    return {
        getCurrentPosition: function (onSuccess, onError, options) {
            navigator.geolocation.getCurrentPosition(function () {
                    var that = this,
                        args = arguments;

                    if (onSuccess) {
                        $rootScope.$apply(function () {
                            onSuccess.apply(that, args);
                        });
                    }
                }, function () {
                    var that = this,
                        args = arguments;

                    if (onError) {
                        $rootScope.$apply(function () {
                            onError.apply(that, args);
                        });
                    }
                },
                options);
        }
    }
});
