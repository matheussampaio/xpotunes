(function () {

  angular
    .module('xpotunes')
    .service('FirebaseService', FirebaseService);

  function FirebaseService($firebaseAuth) {
    const URL = 'https://xpotunes.firebaseio.com/';

    const service = {
      ref: new Firebase(URL),
      auth: null
    };

    active();

    return service;

    ///////////////////

    function active() {
      service.auth = $firebaseAuth(service.ref);
    }
  }

})();
