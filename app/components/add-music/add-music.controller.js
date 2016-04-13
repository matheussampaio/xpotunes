(function () {

  angular
    .module('xpotunes')
    .controller('addMusicController', addMusicController);

  function addMusicController($mdDialog, $mdToast, FileUploader, UserService) {
    const vm = this;

    vm.invalid = {
      size: false,
      extension: false
    };

    vm.music = {
      title: ''
    };

    vm.addMusic = addMusic;
    vm.cancel = $mdDialog.cancel;
    vm.cancelUpload = cancelUpload;
    vm.uploader = createFileUploader();

    ////////////////

    function addMusic() {
      console.log('addMusic');

      vm.item.form.$setSubmitted();

      if (vm.item.form.$valid) {
        vm.loading = true;
        vm.uploader.queue[0].upload();
      }
    }

    function createFileUploader() {
      return new FileUploader({
        url: '/api/music',
        filters: [
          {
            name: 'isAudioFile',
            fn: (item) => {
              const ext = item.type.slice(item.type.lastIndexOf('/') + 1);
              const type = `|${ext}|`;
              return '|mp3|wav|'.indexOf(type) !== -1;
            }
          },
          {
            name: 'sizeToBig',
            // A user-defined filter
            fn: (item) => item.size < 1000 * 1000 * 20 // 20mb
          }
        ],
        onWhenAddingFileFailed: (file, filter) => {
          if (filter.name === 'sizeToBig') {
            vm.invalid.size = true;
          } else if (filter.name === 'isAudioFile') {
            // angular.element('#fileInput').$setValidity('extension', true);
            vm.invalid.extension = true;
          }
        },
        onAfterAddingFile: () => {
          vm.invalid = {};
        },
        onBeforeUploadItem: (item) => {
          item.formData.push({
            title: vm.music.title,
            album: vm.music.album,
            artist: vm.music.artist,
            genre: vm.music.genre,
            start: vm.music.start * 1000,
            end: vm.music.end * 1000,
            description: vm.music.description,
            filename: item.file.name,
            user: UserService.data.uid,
            size: item.file.size
          });
        },
        onSuccessItem: (fileItem, response, status, headers) => {
          console.info('onSuccessItem', fileItem, response, status, headers);
          if (status === 200) {
            _success(response);
            $mdToast.show($mdToast.simple().textContent('Music Added!'));
          } else {
            $mdToast.show($mdToast.simple().textContent('Error addind music.'));
          }
        },
        onErrorItem: (fileItem, response, status, headers) => {
          console.error('error')
          console.error(response);
          console.info('fileItem: ', fileItem);
        }
      });
    }

    function _success(music) {
      $mdDialog.hide(music);
    }

    function cancelUpload() {
      vm.uploader.cancelAll();
      $mdDialog.hide();
    }

  }

})();
