angular.module('botaniser.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('SpeciesCtrl', function($scope, SpeciesList) {
    $scope.speciesList = SpeciesList.all();
})

.controller('SpeciesDetailCtrl', function($scope, $stateParams, SpeciesList) {
    $scope.species = SpeciesList.get($stateParams.speciesId);
})

.controller('AccountCtrl', function($scope) {
});
