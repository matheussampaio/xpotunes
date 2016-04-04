(function () {

  angular
    .module('xpotunes')
    .component('app', {
      controller: AppController,
      templateUrl: 'app/app.html'
    });

  function AppController($rootScope, $log, FirebaseService) {
    activate();

    ////////////////

    function activate() {
      FirebaseService.auth.$onAuth((user) => {
        $rootScope.user = user;
        _refresh();
      });
    }

    function _refresh() {
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    }
  }

})();
