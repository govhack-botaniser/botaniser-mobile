angular.module('botaniser.services', [])

/**
 * A simple example service that returns some data.
 */
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
});
