(function () {

  angular
    .module('xpotunes')
    .component('login', {
      controller: loginController,
      templateUrl: 'login/login.html'
    });

  function loginController($state, $rootScope, $log, FirebaseService) {
    const vm = this;

    vm.data = {
      email: null,
      password: null,
      remember: true
    };
    vm.login = login;

    ////////////////

    function login() {
      FirebaseService.auth.$authWithPassword({
        email: vm.data.email,
        password: vm.data.password
      }, {
        remember: vm.data.remember ? 'default' : 'sessionOnly'
      }).then((user) => {
        $log.debug('Logged in as:', user);
        $rootScope.user = user;
        $state.go('app.home');
      }).catch((error) => {
        vm.error = error;
        $log.error('Authentication failed:', error);
      });
    }
  }

})();
