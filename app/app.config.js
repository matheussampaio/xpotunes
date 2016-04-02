(function () {

  angular.module('xpotunes')
    .run(xpotunesRun)
    .config(xpotunesConfig);

  function xpotunesRun($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
      if (toState.auth && !$rootScope.user) {
        event.preventDefault();
        $state.go('app.login');
      }
    });
  }

  function xpotunesConfig($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    const appState = {
      url: '/',
      template: '<app></app>'
    };

    const homeState = {
      url: 'home',
      template: '<home></home>'
    };

    const loginState = {
      url: 'login',
      template: '<login></login>'
    };

    const registerState = {
      url: 'register',
      template: '<register></register>'
    };

    const dashboardState = {
      url: 'dashboard',
      template: '<dashboard></dashboard>',
      auth: true
    };

    const settingsState = {
      url: 'settings',
      template: '<settings></settings>',
      auth: true
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.login', loginState)
        .state('app.register', registerState)
        .state('app.settings', settingsState)
        .state('app.dashboard', dashboardState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
