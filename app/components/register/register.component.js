(function () {

  angular
    .module('xpotunes')
    .component('register', {
      controller: registerController,
      templateUrl: 'register/register.html'
    });

  function registerController($state, $rootScope, $log, FirebaseService) {
    const vm = this;

    vm.data = {
      email: null,
      confirmEmail: null,
      password: null,
      confirmPassword: null
    };
    vm.register = register;

    ////////////////

    function register() {
      $log.debug(vm.data);

      if (!vm.data.email) {
        $log.error(`missing email`);

      } else if (!vm.data.password) {
        $log.error(`missing password`);

      } else if (vm.data.email !== vm.data.confirmEmail) {
        $log.error(`email don't match`);

      } else if (vm.data.password !== vm.data.confirmPassword) {
        $log.error(`password don't match`);

      } else {
        FirebaseService.auth.$createUser({
          email: vm.data.email,
          password: vm.data.password
        }).then((user) => {
          $log.debug(`Logged in as: ${user.uid}`);

          return FirebaseService.auth.$authWithPassword({
            email: vm.data.email,
            password: vm.data.password
          });
        })
        .catch((error) => {
          $log.error(`Error: ${error}`);
        });
      }
    }
  }

})();
