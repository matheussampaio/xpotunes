(function () {

  angular
    .module('xpotunes')
    .service('UserService', UserService);

  function UserService($log, $rootScope, FirebaseService) {
    const service = {
      data: getUser(),
      getUser
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      FirebaseService.auth.$onAuth((user) => {
        service.data = user;
      });
    }

    function getUser() {
      return FirebaseService.auth.$getAuth();
    }

  }

})();
