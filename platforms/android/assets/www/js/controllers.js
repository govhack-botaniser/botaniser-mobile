angular.module('botaniser.controllers', [])

.controller('HomeCtrl', function($scope, GeoLocation, Camera) {
    // Initialise geo-location
    $scope.pos = {};
    GeoLocation.getCurrentPosition(function(pos) {
        $scope.pos = pos;
    });

    // Initialise camera functions
    $scope.getPhoto = function() {
        console.log('Getting camera...');
        Camera.getPicture().then(function(imageURI) {
            console.log(imageURI);
            //$scope.lastPhoto = imageURI;
        }, function(err) {
            console.err(err);
        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        });
    };
})

.controller('SpeciesCtrl', function($scope, SpeciesList) {
    $scope.speciesList = SpeciesList.all();
})

.controller('SpeciesDetailCtrl', function($scope, $stateParams, SpeciesList) {
    $scope.species = SpeciesList.get($stateParams.speciesId);

    L.mapbox.map('map', 'examples.map-i86nkdio', {
        attributionControl: false,
        zoomControl: false
    }).setView([40, -74.50], 9);
})

.controller('AboutCtrl', function($scope) {
});
