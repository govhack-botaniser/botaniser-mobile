angular.module('botaniser.services', [])

.factory('Api', function ($rootScope, $http) {
    return {
        fetch: function(config) {
            return $http.get('http://biocache.ala.org.au/ws/occurrences/search', config);
        }
    };
})

.factory('SpeciesList', ['Api', function(Api) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var speciesList = [];

    return {
        all: function() {
            return speciesList;
//            if (pos.coords) {
//                Api.fetch({
//                    params: {
//                        'fq': 'kingdom:Plantae',
//                        'pageSize': 0,
//                        'flimit'  : 2000,
//                        //'sort'  : 'count',
//                        'radius': 10,
//                        'lat'   : pos.coords.latitude,
//                        'lon'   : pos.coords.longitude,
//                        'facets': 'taxon_name'
//                    }
//                }).success(function(data, status, headers, config) {
//                    var results = data.facetResults[0].fieldResult;
//                    var speciesListFull = results.reduce(function (res, item){
//                        if (item.count < 100 && speciesMap[item.label] && speciesMap[item.label].occurrenceCount < 100) {
//                            item.totalCount = speciesMap[item.label].occurrenceCount;
//                            res.push(item);
//                        }
//                        return res;
//                    }, []);
//                    speciesListFull = speciesListFull.sort(function (a, b) {
//                        if (a.totalCount < b.totalCount) {
//                            return -1;
//                        } else if (a.totalCount > b.totalCount) {
//                            return 1;
//                        }
//                        return 0;
//                    });
//
//                    return speciesListFull.splice(0, 20);
//                }).error(function(data, status, headers, config) {
//                    console.log('Error', arguments);
//                });
//            } else {
//                //not ready todo retry
//            }
        },
        get: function(speciesId, pos) {
            if (pos.coords) {
                Api.fetch({
                    params: {
                        'fq': 'kingdom:Plantae',
                        'pageSize': 0,
                        'flimit'  : 2000,
                        //'sort'  : 'count',
                        'radius': $scope.radius,
                        'lat'   : $scope.pos.coords.latitude,
                        'lon'   : $scope.pos.coords.longitude,
                        'facets': 'taxon_name'
                    }
                }).success(function(data, status, headers, config) {
                    var results = data.facetResults[0].fieldResult;
                    var speciesListFull = results.reduce(function (res, item){
                        if (speciesMap[item.pk] == speciesId) {
                            res.push(item);
                        }
                        return res;
                    }, []);
//                    speciesListFull = speciesListFull.sort(function (a, b) {
//                        if (a.totalCount < b.totalCount) {
//                            return -1;
//                        } else if (a.totalCount > b.totalCount) {
//                            return 1;
//                        }
//                        return 0;
//                    });
//
                    $scope.speciesList = speciesListFull.splice(0, 20);

                    return speciesListFull[0];
                }).error(function(data, status, headers, config) {
                    console.log('Error', arguments);
                });
            } else {
                //not ready todo retry
            }

            //return speciesListFull[0];
            // Simple index lookup
            //return speciesList[speciesId];
        },
        load: function (pos, radius) {
            if (pos.coords) {
                Api.fetch({
                    params: {
                        'fq': 'kingdom:Plantae',
                        'pageSize': 0,
                        'flimit'  : 2000,
                        //'sort'  : 'count',
                        'radius': radius,
                        'lat'   : pos.coords.latitude,
                        'lon'   : pos.coords.longitude,
                        'facets': 'taxon_name'
                    }
                }).success(function(data, status, headers, config) {
                    var results = data.facetResults[0].fieldResult;
                    var speciesListFull = results.reduce(function (res, item){
                        if (item.count < 100 && speciesMap[item.label] && speciesMap[item.label].occurrenceCount < 100) {
                            item.totalCount = speciesMap[item.label].occurrenceCount;
                            res.push(item);
                        }
                        return res;
                    }, []);
                    speciesListFull = speciesListFull.sort(function (a, b) {
                        if (a.totalCount < b.totalCount) {
                            return -1;
                        } else if (a.totalCount > b.totalCount) {
                            return 1;
                        }
                        return 0;
                    });

                    //speciesList = speciesListFull.splice(0, 20);

                    return speciesListFull.splice(0, 20);
                }).error(function(data, status, headers, config) {
                    console.log('Error', arguments);
                });
            } else {
                //not ready todo retry
            }
        }
    }
}])

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
