angular.module('botaniser.controllers', [])

.controller('DashCtrl', function($scope, GeoLocation) {
    $scope.pos = {};
    GeoLocation.getCurrentPosition(function(pos) {
        $scope.pos = pos;
    })
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

.controller('AccountCtrl', function($scope) {
});
