angular.module('botaniser.controllers', [])

.controller('HomeCtrl', function($scope, GeoLocation, Camera) {
    // Initialise geo-location
    $scope.pos = {};
    GeoLocation.getCurrentPosition(function(pos) {
        $scope.pos = pos;
    });

    // Initialise camera functions
//    $scope.getPhoto = function() {
//        console.log('Getting camera...');
//        Camera.getPicture().then(function(imageURI) {
//            console.log(imageURI);
//            //$scope.lastPhoto = imageURI;
//        }, function(err) {
//            console.err(err);
//        }, {
//            quality: 75,
//            targetWidth: 320,
//            targetHeight: 320,
//            saveToPhotoAlbum: false
//        });
//    };
    $scope.getPhoto = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        }
        navigator.camera.getPicture(onSuccess, onFail, options);
    }

    $scope.uploadPhoto = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 2,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        }
        navigator.camera.getPicture(onSuccess, onFail, options);
    }

    $scope.sendPhoto = function() {
        var myImg = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey="post";
        options.chunkedMode = false;
        var params = {};
        params.user_token = localStorage.getItem('auth_token');
        params.user_email = localStorage.getItem('email');
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(myImg, encodeURI("https://example.com/posts/"), onUploadSuccess, onUploadFail, options);
    }

    var onSuccess = function(FILE_URI) {
        console.log(FILE_URI);
        $scope.picData = FILE_URI;
        $scope.$apply();
    };

    var onFail = function(e) {
        console.log("On fail " + e);
    }
})

.controller('EntryCtrl', function($scope) {
})

.controller('SpeciesCtrl', function($scope, Api, GeoLocation, SpeciesList) {
    // Initialise geo-location
    $scope.pos = {};
    $scope.radius = 10;
    $scope.species = [];
    GeoLocation.getCurrentPosition(function(pos) {
        $scope.pos = pos;
        $scope.refresh();
    });

    $scope.refresh = function () {
        //$scope.speciesList = SpeciesList.load($scope.pos, 10);

        if ($scope.pos.coords) {
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
                var idx = 0;
                var speciesListFull = results.reduce(function (res, item){
                    if (item.count < 100 && speciesMap[item.label] && speciesMap[item.label].occurrenceCount < 100) {
                        item.totalCount = speciesMap[item.label].occurrenceCount;
                        res.push({ id: idx , item: item });
                        idx++;
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

                $scope.speciesList = speciesListFull.splice(0, 20);
            }).error(function(data, status, headers, config) {
                console.log('Error', arguments);
            });
        } else {
            //not ready todo retry
        }
    };
})

.controller('SpeciesDetailCtrl', function($scope, $stateParams, Api, GeoLocation, SpeciesList) {
    // Initialise geo-location
    $scope.pos = {};
    $scope.radius = 10;
    $scope.species = [];
    GeoLocation.getCurrentPosition(function(pos) {
        $scope.pos = pos;
        $scope.refresh();
    });

    $scope.refresh = function () {
        if ($scope.pos.coords) {
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
//                var speciesListFull = results.reduce(function (res, item){
//                    if (speciesMap[item.label] == $stateParams.speciesName) {
//                        res.push(item);
//                    }
//                    return res;
//                }, []);
                var idx = 0;
                var speciesListFull = results.reduce(function (res, item){
                    if (item.count < 100 && speciesMap[item.label] && speciesMap[item.label].occurrenceCount < 100) {
                        item.totalCount = speciesMap[item.label].occurrenceCount;
                        res.push({ id: idx, item: item});
                        idx++;
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

                $scope.species = speciesListFull[$stateParams.speciesId];
            }).error(function(data, status, headers, config) {
                console.log('Error', arguments);
            });
        } else {
            //not ready todo retry
        }
    };
//    // Initialise geo-location
//    $scope.pos = {};
//    GeoLocation.getCurrentPosition(function(pos) {
//        $scope.pos = pos;
//    });
//    $scope.species = SpeciesList.get($stateParams.speciesId, $scope.pos);

    L.mapbox.map('map', 'chid.map-coyyfgk8', {
        attributionControl: false,
        zoomControl: false
        //}).setView([37.78, -122.40], 9);
    });
})

.controller('AboutCtrl', function($scope) {
});
