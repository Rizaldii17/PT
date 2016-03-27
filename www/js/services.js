angular.module('healthy.services', [])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://easyhealthy.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})


.factory('User', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/users');
  return $firebaseArray(itemsRef);
}]);
