(function () {

  angular
    .module('xpotunes')
    .service('MusicService', MusicService);

  function MusicService(UserService, ResourceFactory) {
    const service = {
      get,
      edit,
      remove
    };

    return service;

    ///////////////////

    function get(cb) {
      return ResourceFactory.music.query({ user: UserService.data.uid }, cb).$promise;
    }

    function remove(id) {
      return ResourceFactory.music.remove({ musicId: id }).$promise;
    }

    function edit(music) {
      return ResourceFactory.music.update({ musicId: music._id }, music).$promise;
    }
  }

})();
