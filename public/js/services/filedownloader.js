(function(window, angular, $) {
    "use strict";
    angular.module('FileManagerApp').service('fileDownloader', ['$http', '$q', 'fileManagerConfig','fileProcessor','drive'
        , function ($http, $q, fileManagerConfig, fileProcessor, drive) {

        this.deferredHandler = function(data, deferred, errorMessage) {
            if (!data || typeof data !== 'object') {
                return deferred.reject('Bridge response error, please check the docs');
            }
            if (data.error) {
                return deferred.reject(data);
            }
            if (errorMessage) {
                return deferred.reject(errorMessage);
            }
            return deferred.resolve(data);
        };

        function base64ToArrayBuffer(base64) {
            var binaryString =  window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++)        {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
            }
            return bytes;
        }

        this.saveByteArray = (function () {
            var a = document.createElement("a");
            window.document.body.appendChild(a);
            //a.style = "display: none";
            return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());

        // 1. Get parts information from database from file id
        this.getPartsInfor = function(item){

        }

        // 2. Get 
        this.download = function(item) {    
            
            //State of download process 5: no error; 0/1/2/3: failed at 0/1/2/3th file;
            var deferred = $q.defer();
            item.inprocess = true;
            //  1. Download part from google drive
            //var filePromise = drive.loadFile(fileId);
            
            //file.content = fileProcessor.string2Bin(file.content);
            //file = getFile("test");
            // var filePromise;
            // return filePromise = drive.loadFile("0B75tWDW8cweYdjZWdmM1ZGZERE0").then(function(file) {
            //     var fileContentArray = JSON.parse(file.content);
            //     var stringArray = fileProcessor.bin2String(fileContentArray);
            //     var stringArray = base64ToArrayBuffer(stringArray);
            //     //var fileArray = fileProcessor.fileFromBase64(stringArray,'image/jpg','test.jpg');
            //     saveByteArray([stringArray], item.model.name);

            //     item.inprocess = false;
            //     return file;
            // }, function(err) {
            //     if(item.id) {
            //     showMessage('Unable to load file');
            //     }
            //     $scope.fileNavigator.refresh();
            // });
            
            



            // 2. Check file -> restore
            // 3. Convert file from bin to string
            // 4. Join strings
            // 5. Convert Base64 to file Object
            // 6. Download file

            // $http.post(fileManagerConfig.uploadUrl, form, {
            //     transformRequest: angular.identity,
            //     headers: {
            //         "Content-Type": undefined
            //     }
            // }).success(function(data) {
            //     deferredHandler(data, deferred);
            // }).error(function(data) {
            //     deferredHandler(data, deferred, 'Unknown error uploading files');
            // })['finally'](function(data) {
            //     self.requesting = false;
            // });;

            return deferred.promise;
        };
    }]);
})(window, angular, jQuery);