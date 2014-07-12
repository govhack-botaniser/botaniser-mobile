angular.module('botaniser.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('SpeciesCtrl', function($scope, SpeciesList) {
    $scope.speciesList = SpeciesList.all();
})

.controller('SpeciesDetailCtrl', function($scope, $stateParams, SpeciesList) {
    $scope.species = SpeciesList.get($stateParams.speciesId);

    L.mapbox.map('map', 'examples.map-i86nkdio').setView([40, -74.50], 9);
})

.controller('AccountCtrl', function($scope) {
});
