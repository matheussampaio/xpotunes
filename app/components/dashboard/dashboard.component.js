(function () {

  angular
    .module('xpotunes')
    .component('dashboard', {
      controller: dashboardController,
      templateUrl: 'dashboard/dashboard.html'
    });

  function dashboardController($mdDialog, $mdEditDialog, MusicService) {
    const vm = this;

    vm.selected = [];

    vm.query = {
      order: 'views'
    };

    vm.getMusics = getMusics;
    vm.removeFilter = removeFilter;
    vm.editComment = editComment;
    vm.deleteMusic = deleteMusic;
    vm.addMusic = addMusic;
    vm.promise = null;

    activate();

    /////////////////

    function activate() {
      getMusics();
    }

    function _onSuccess(musics) {
      vm.musics = musics;
    }

    function getMusics() {
      vm.selected = [];
      vm.promise = MusicService.get(_onSuccess);
    }

    function removeFilter() {
      vm.query.filter = '';
      vm.filter.show = false;
    }

    function deleteMusic(event) {
      $mdDialog.show({
        clickOutsideToClose: true,
        controller: 'deleteMusicController',
        controllerAs: '$ctrl',
        focusOnOpen: false,
        targetEvent: event,
        locals: { musics: vm.selected },
        templateUrl: 'delete-music/delete-music-dialog.html'
      }).then(vm.getMusics);
    }

    function addMusic(event) {
      $mdDialog.show({
        escapeToClose: false,
        controller: 'addMusicController',
        controllerAs: '$ctrl',
        focusOnOpen: false,
        targetEvent: event,
        templateUrl: 'add-music/add-music-dialog.html'
      }).then(getMusics);
    }

    function editComment(event, music) {
      event.stopPropagation();

      $mdEditDialog.small({
        modelValue: music.title,
        placeholder: music.title,
        save: (input) => {
          music.title = input.$modelValue;

          _save(music);
        },
        targetEvent: event,
        validators: {
          'md-maxlength': 30
        }
      });

    }

    function _save(music) {
      vm.promise = MusicService.edit(music);
    }

  }

})();
