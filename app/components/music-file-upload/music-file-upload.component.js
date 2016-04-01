(function () {

  angular
    .module('xpotunes')
    .component('musicFileUpload', {
      controller: musicFileUploadController,
      templateUrl: 'music-file-upload/music-file-upload.html'
    });

  function musicFileUploadController(FileUploader) {
    const vm = this;

    vm.uploader = new FileUploader({
      url: '/api/music',
      headers: {
        ContentType: 'application/json'
      },
      onBeforeUploadItem: (item) => {
        item.formData.push({
          title: 'teste-form',
          size: item.file.size
        });

        console.log(item);
      },
      onSuccessItem: (fileItem, response, status, headers) => {
        console.info('onSuccessItem', fileItem, response, status, headers);
      },
      onErrorItem: (fileItem, response, status, headers) => {
        console.error('error: ', response);
        console.info('fileItem: ', fileItem);
      }
    });
  }

})();
