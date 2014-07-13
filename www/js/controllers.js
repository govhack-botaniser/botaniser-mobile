angular.module('botaniser.controllers', [])

.controller('HomeCtrl', function($scope) {
})

.controller('EntryCtrl', ['$scope', '$location', 'GetUU', function($scope, $location, GetUU) {
    // init variables
    $scope.form = {};
    $scope.data = {};
    $scope.obj;
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
    var url;

    // on DeviceReady check if already logged in (in our case CODE saved)
    ionic.Platform.ready(function() {
        //console.log("ready get camera types");
        if (!navigator.camera)
        {
            // error handling
            return;
        }
        //pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
        pictureSource=navigator.camera.PictureSourceType.CAMERA;
        destinationType=navigator.camera.DestinationType.FILE_URI;
    });

    // get upload URL for FORM
    GetUU.query(function(response) {
        $scope.data = response;
        //console.log("got upload url ", $scope.data.uploadurl);
    });

    // take picture
    $scope.takePicture = function() {
        //console.log("got camera button click");
        var options =   {
            quality: 50,
            destinationType: destinationType,
            sourceType: pictureSource,
            encodingType: 0
        };
        if (!navigator.camera)
        {
            // error handling
            return;
        }
        navigator.camera.getPicture(
            function (imageURI) {
                //console.log("got camera success ", imageURI);
                $scope.mypicture = imageURI;
            },
            function (err) {
                //console.log("got camera error ", err);
                // error handling camera plugin
            },
            options);
    };

    // do POST on upload url form by http / html form
    $scope.update = function(obj) {
        if (!$scope.data.uploadurl)
        {
            // error handling no upload url
            return;
        }
        if (!$scope.mypicture)
        {
            // error handling no picture given
            return;
        }
        var options = new FileUploadOptions();
        options.fileKey="ffile";
        options.fileName=$scope.mypicture.substr($scope.mypicture.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";
        var params = {};
        params.other = obj.text; // some other POST fields
        options.params = params;

        //console.log("new imp: prepare upload now");
        var ft = new FileTransfer();
        ft.upload($scope.mypicture, encodeURI($scope.data.uploadurl), uploadSuccess, uploadError, options);
        function uploadSuccess(r) {
            // handle success like a message to the user
            navigator.notification.alert("Success");
        }
        function uploadError(error) {
            //console.log("upload error source " + error.source);
            //console.log("upload error target " + error.target);
            navigator.notification.alert(":(");
        }
    };

    $scope.getPos = function (){
        Geolocation.getCurrentPosition(function (pos) {
            $scope.form.lat = pos.coords.latitude;
            $scope.form.lon = pos.coords.longitude;
        });
    };
}])

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

    var map = L.mapbox.map('map', 'chid.map-coyyfgk8', {
        attributionControl: false,
        zoomControl: false
        //}).setView([37.78, -122.40], 9);
    });

    // Initialise geo-location
    $scope.pos = {};
    $scope.radius = 10;
    $scope.species1 = [];
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

                $scope.species1 = speciesListFull[$stateParams.speciesId];

                var speciesData = { names: [$scope.species1.item.label]};

                Api.fetchOne(speciesData).success(function(data, status, headers,config) {
                    $scope.species = { occurence: $scope.species1.item.count, item: data[0]};

//                    Api.fetch({
//                        params: {
//                            'fq': 'species_guid:' + $scope.species.item.guid,
//                            'pageSize': 100,
//                            'flimit'  : 0,
//                            //'sort'  : 'count',
//                            'radius': $scope.radius,
//                            'lat'   : $scope.pos.coords.latitude,
//                            'lon'   : $scope.pos.coords.longitude,
//                            'facets': 'taxon_name'
//                        }
//                    }).success(function(data, status, headers, config) {
//                        console.log(data.occurrences);
//                        $scope.occurrences = data.occurrences.reduce(function (obj, marker, index) { //we stupidly need a hash map Object here
//                            //L.marker([marker.decimalLatitude, marker.decimalLongitude]).addTo($scope.map);
//                            obj['m' + index] = {
//                                lat: marker.decimalLatitude,
//                                lng: marker.decimalLongitude,
//                                message: marker.collectionName,
//                                draggable: false
//                            };
//                            return obj;
//                        }, {});
//
//                        for(var i = 0; i < $scope.occurences.length; i++){
//                            L.marker([$scope.occurences[i].lat, $scope.occurences[i].lng]).addTo(map);
//                        }
//
//                        console.log($scope.occurrences);
//                    }).error(function(data, status, headers, config) {
//                        console.log('Error', arguments);
//                    });
                }).error(function(data, status, headers, config) {
                    console.log('Error', arguments);
                });
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
})

.controller('LeaderboardCtrl', function($scope) {
})

.controller('AboutCtrl', function($scope) {
});
