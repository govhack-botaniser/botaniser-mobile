angular.module('botaniser.services', [])

.factory('Api', function ($rootScope, $http) {
    return {
        fetch: function(config) {
            return $http.get('http://bie.ala.org.au/ws/occurrences/search', config);
        },
        fetchOne: function(data) {
            return $http.post('http://bie.ala.org.au/ws/species/lookup/bulk',data);
        }
    };
})

.factory('SpeciesList', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var speciesList = [];

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

// get upload url for file transfer (upload to http post service)
.factory('GetUU', function() {
    var uploadurl = "http://botaniser.herokuapp.com/reports/add";
    return  {
        query: function() {
            return uploadurl;
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
