(function () {

  angular
    .module('xpotunes')
    .component('home', {
      controller: homeController,
      templateUrl: 'home/home.html'
    });

  function homeController(MusicService, UserService) {
    const vm = this;

    vm.user = UserService;
    vm.musics = MusicService.getMusics();
  }

})();
