(function () {

  angular
    .module('xpotunes')
    .factory('ResourceFactory', ResourceFactory);

  function ResourceFactory($resource) {
    const DOMAIN = '/api';

    const vm = {
      music: musicResource()
    };

    return vm;

    ///////////////////

    function musicResource() {
      return $resource(`${DOMAIN}/music/:musicId`, {
        musicId: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  }

})();
