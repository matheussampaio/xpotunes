(function () {

  angular
    .module('xpotunes')
    .component('musicFileUpload', {
      controller: musicFileUploadController,
      templateUrl: 'music-file-upload/music-file-upload.html'
    });

  function musicFileUploadController($mdToast, FileUploader, UserService, MusicService) {
    const vm = this;

    vm.uploader = new FileUploader({
      url: '/api/music',
      headers: {
        ContentType: 'application/json'
      },
      onBeforeUploadItem: (item) => {
        item.formData.push({
          title: item.file.name,
          user: UserService.data.uid,
          size: item.file.size
        });

        console.log(item);
      },
      onSuccessItem: (fileItem, response, status, headers) => {
        console.info('onSuccessItem', fileItem, response, status, headers);
        if (status === 200) {
          MusicService.addMusic(response);
          $mdToast.show($mdToast.simple().textContent('Audio Added!'));
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

})();
