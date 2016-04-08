(function () {

  angular
    .module('xpotunes')
    .controller('deleteMusicController', deleteMusicController);

  function deleteMusicController($q, $mdDialog, $mdToast, musics, MusicService) {
    const vm = this;

    vm.cancel = $mdDialog.cancel;
    vm.confirmed = confirmed;
    vm.deleteMusics = deleteMusics;

    ////////////////

    function _deleteMusic(music, index) {
      return MusicService.remove(music._id)
        .then(() => {
          musics.splice(index, 1);
        });
    }

    function _onComplete() {
      $mdToast.show($mdToast.simple().textContent('Musics deleted.'));
      $mdDialog.hide();
    }

    function confirmed() {
      return vm.secret === 'DELETE';
    }

    function deleteMusics() {
      if (confirmed()) {
        $q.all(musics.forEach(_deleteMusic)).then(_onComplete);
      }
    }

  }

})();
