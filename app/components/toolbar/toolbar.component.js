(function () {

  angular
    .module('xpotunes')
    .component('toolbar', {
      controller: toolbarController,
      templateUrl: 'toolbar/toolbar.html'
    });

  function toolbarController($state, $log, UserService, FirebaseService) {
    const vm = this;

    vm.user = UserService;

    vm.logout = logout;

    ////////////////

    function logout() {
      $log.debug('logout');
      FirebaseService.auth.$unauth();
      $state.go('app.home');
    }
  }

})();
