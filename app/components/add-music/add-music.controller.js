(function () {

  angular
    .module('xpotunes')
    .controller('addMusicController', addMusicController);

  function addMusicController($mdDialog, $mdToast, FileUploader, UserService) {
    const vm = this;

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
        filters: [{
          name: 'sizeToBig',
          // A user-defined filter
          fn: (item) => item.size < 1000 * 1000 * 20 // 20mb
        }],
        onWhenAddingFileFailed: (file, filter) => {
          if (filter.name === 'sizeToBig') {
            vm.invalid = true;
          }
        },
        onAfterAddingFile: () => {
          vm.invalid = false;
        },
        onBeforeUploadItem: (item) => {
          item.formData.push({
            title: vm.music.title,
            name: item.file.name,
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
          console.error('error: ', response);
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
