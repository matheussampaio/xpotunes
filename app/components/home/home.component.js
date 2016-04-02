(function () {

  angular
    .module('xpotunes')
    .component('home', {
      controller: homeController,
      templateUrl: 'home/home.html'
    });

  function homeController() {
    console.log('home');
  }

})();
