(function () {

  angular
    .module('xpotunes')
    .service('MusicService', MusicService);

  function MusicService(UserService, ResourceFactory) {
    const service = {
      getMusics,
      addMusic
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      service.data = ResourceFactory.music.query({
        user: UserService.data.uid
      });
    }

    function getMusics() {
      return service.data;
    }

    function addMusic(music) {
      service.data.push(music);
    }
  }

})();
