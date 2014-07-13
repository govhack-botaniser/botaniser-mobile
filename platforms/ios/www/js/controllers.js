angular.module('botaniser.controllers', [])

.controller('HomeCtrl', ['$scope', '$location', 'GetUU', function($scope, $location, GetUU) {
    // init variables
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
        }
        function uploadError(error) {
            //console.log("upload error source " + error.source);
            //console.log("upload error target " + error.target);
        }
    };
//    // Initialise geo-location
//    $scope.pos = {};
//    GeoLocation.getCurrentPosition(function(pos) {
//        $scope.pos = pos;
//    });
//
//    // Initialise camera functions
////    $scope.getPhoto = function() {
////        console.log('Getting camera...');
////        Camera.getPicture().then(function(imageURI) {
////            console.log(imageURI);
////            //$scope.lastPhoto = imageURI;
////        }, function(err) {
////            console.err(err);
////        }, {
////            quality: 75,
////            targetWidth: 320,
////            targetHeight: 320,
////            saveToPhotoAlbum: false
////        });
////    };
//    $scope.getPhoto = function() {
//        var options = {
//            quality: 50,
//            destinationType: Camera.DestinationType.FILE_URI,
//            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
//            encodingType: 0     // 0=JPG 1=PNG
//        }
//        navigator.camera.getPicture(onSuccess, onFail, options);
//    }
//
//    $scope.uploadPhoto = function() {
//        var options = {
//            quality: 50,
//            destinationType: Camera.DestinationType.FILE_URI,
//            sourceType: 2,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
//            encodingType: 0     // 0=JPG 1=PNG
//        }
//        navigator.camera.getPicture(onSuccess, onFail, options);
//    }
//
//    $scope.sendPhoto = function() {
//        var myImg = $scope.picData;
//        var options = new FileUploadOptions();
//        options.fileKey="post";
//        options.chunkedMode = false;
//        var params = {};
//        params.user_token = localStorage.getItem('auth_token');
//        params.user_email = localStorage.getItem('email');
//        options.params = params;
//        var ft = new FileTransfer();
//        ft.upload(myImg, encodeURI("https://example.com/posts/"), onUploadSuccess, onUploadFail, options);
//    }
//
//    var onSuccess = function(FILE_URI) {
//        console.log(FILE_URI);
//        $scope.picData = FILE_URI;
//        $scope.$apply();
//    };
//
//    var onFail = function(e) {
//        console.log("On fail " + e);
//    }
}])

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

.controller('LeaderboardCtrl', function($scope) {
})

.controller('AboutCtrl', function($scope) {
});
