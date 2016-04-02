(function () {

  angular
    .module('xpotunes')
    .component('xpoToolbar', {
      controller: xpoToolbarController,
      templateUrl: 'xpo-toolbar/xpo-toolbar.html'
    });

  function xpoToolbarController($state, $rootScope, $log, FirebaseService) {
    const vm = this;

    vm.$rootScope = $rootScope;

    vm.logout = logout;

    $log.debug('toolbar');
    $log.debug(vm.user);

    ////////////////

    function logout() {
      $log.debug('logout');
      FirebaseService.auth.$unauth();
      $state.go('app.home');
    }
  }

})();
