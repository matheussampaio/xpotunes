(function () {

  angular.module('xpotunes')
    .run(xpotunesRun)
    .config(xpotunesConfig);

  function xpotunesRun($rootScope, $state, UserService) {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
      if (toState.name === 'app.dashboard' && !UserService.isLoggedIn()) {
        event.preventDefault();
        $state.go('app.home');
      }
    });
  }

  function xpotunesConfig($stateProvider, $urlRouterProvider) {
    const appState = {
      url: '/',
      abstract: true,
      template: '<app></app>'
    };

    const homeState = {
      url: 'home',
      template: '<home></home>'
    };

    const dashboardState = {
      url: 'dashboard',
      template: '<dashboard></dashboard>'
    };

    const loginState = {
      url: 'login',
      template: '<login></login>'
    };

    const registerState = {
      url: 'register',
      template: '<register></register>'
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.dashboard', dashboardState)
        .state('app.login', loginState)
        .state('app.register', registerState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/dashboard');
  }

})();
