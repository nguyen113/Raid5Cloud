(function(window, angular) {
    'use strict';
    angular.module('FileManagerApp').service('fileUploader', ['$http', '$q', 'fileManagerConfig','fileProcessor','drive','$mdToast'
        , function ($http, $q, fileManagerConfig, fileProcessor, drive, $mdToast) {

        function deferredHandler(data, deferred, errorMessage) {
            if (!data || typeof data !== 'object') {
                return deferred.reject('Bridge response error, please check the docs');
            }
            if (data.result && data.result.error) {
                return deferred.reject(data);
            }
            if (data.error) {
                return deferred.reject(data);
            }
            if (errorMessage) {
                return deferred.reject(errorMessage);
            }
            deferred.resolve(data);
        }


        this.requesting = false; 

        ////
        ///ham phu tro
        ////
        //Chuyen tu string sang Blob
        //Tham khao http://stackoverflow.com/questions/15030906/how-to-replace-the-deprecated-blobbuilder-with-the-new-blob-constructor
        // function dataURItoBlob(dataURI, callback) {
        //     // convert base64 to raw binary data held in a string
        //     // doesn't handle URLEncoded DataURIs

        //     var byteString;
        //     if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        //         byteString = atob(dataURI.split(',')[1]);
        //     } else {
        //         byteString = unescape(dataURI.split(',')[1]);
        //     }

        //     // separate out the mime component
        //     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        //     // write the bytes of the string to an ArrayBuffer
        //     var ab = new ArrayBuffer(byteString.length);
        //     var ia = new Uint8Array(ab);
        //     for (var i = 0; i < byteString.length; i++) {
        //         ia[i] = byteString.charCodeAt(i);
        //     }

        //     // write the ArrayBuffer to a blob, and you're done
        //     var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        //     var bb = new BlobBuilder();
        //     bb.append(ab);
        //     return bb.getBlob(mimeString);
        // }



        // function decodeBase64(base64, fileName, fileExt){
        //     var saveByteArray = (function () {
        //         var a = document.createElement("a");
        //         document.body.appendChild(a);
        //         a.style = "display: none";
        //         return function (data, name) {
        //                 var blob = new Blob(data, {type: "octet/stream"}),
        //                     url = window.URL.createObjectURL(blob);
        //                 a.href = url;
        //                 a.download = name;
        //                 a.click();
        //                 window.URL.revokeObjectURL(url);
        //         };
        //     }());

        //     var binaryString =  window.atob(base64);
        //     var binaryLen = binaryString.length;
        //     var bytes = new Uint8Array(binaryLen);
        //     for (var i = 0; i < binaryLen; i++){
        //         var ascii = binaryString.charCodeAt(i);
        //         bytes[i] = ascii;
        //     }
        //     saveByteArray([bytes], fileName + '.' + fileExt);
        // }

        // //Save content to a temp file
        // function saveToFile(base64, serverUrl){
        //     var params = {
        //         file: {
        //             type: 'text/plain',
        //             filename: Path.utils.basename(currentTab.id),
        //             content: base64 /* File content goes here */
        //         },
        //         action: 'upload',
        //         overwrite: 'true',
        //         destination: '/'
        //     };

        //     var content = [];
        //     for(var i in params) {
        //         content.push('--' + boundary);

        //         var mimeHeader = 'Content-Disposition: form-data; name="'+i+'"; ';
        //         if(params[i].filename)
        //             mimeHeader += 'filename="'+ params[i].filename +'";';
        //         content.push(mimeHeader);

        //         if(params[i].type)
        //             content.push('Content-Type: ' + params[i].type);

        //         content.push('');
        //         content.push(params[i].content || params[i]);
        //     };

        //         /* Use your favorite toolkit here */
        //         /* it should still work if you can control headers and POST raw data */
        //     Ext.Ajax.request({
        //         method: 'POST',
        //         url: serverUrl,
        //         jsonData: content.join('\r\n'),
        //         headers: {
        //             'Content-Type': 'multipart/form-data; boundary=' + boundary,
        //             'Content-Length': content.length
        //         }
        //     });

        // }


        // ////
        // ///Ham Chinh
        // ////
        
        // 1. Function encode file to base64, using web worker to bring encode task to another thread.
        function encodeBase64(fileObject, callback){
            var self = this;
            if (!fileObject || typeof fileObject !== 'file'){
                var reader = new FileReader();
                reader.onload = function(readerEvt) {
                    callback(btoa(readerEvt.target.result));
                    this.requesting = false; 
                };
                reader.readAsBinaryString(fileObject);
            }
            else {
                console.log('Not a file');
            }            
        }

        //2. Function send file info to server for saving
        function saveFileToDb(fileObject, user){
            if (!fileObject || typeof fileObject !== 'file'){
                var fileInfo = JSON.stringify({
                    "user":user,
                    "name":fileObject.name, 
                    "size":fileObject.size, 
                    "type":fileObject.type, 
                    "date":fileObject.lastModifiedDate
                });

                var self = this;
                var deferred = $q.defer();
                var returnData = null;
                $http.post(fileManagerConfig.uploadUrl, fileInfo, {
                transformRequest: angular.identity,
                headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function(data) {
                    returnData = data;
                    deferredHandler(data, deferred);
                }).error(function(data) {
                    deferredHandler(data, deferred, 'Unknown error uploading files');
                })['finally'](function(data) {
                    self.requesting = false;
                });
                return returnData;
            }
            else {
                console.log('Not a file');
            }
        }



       
        //3. Function to split file to 3 equal file
        //Tra ve string array
        //Tham khao: http://stackoverflow.com/questions/8359905/split-string-into-array-of-equal-length-strings
        function splitFile(dataURI){
            if (dataURI.length%3 == 1){
                dataURI = dataURI + "  ";
            } else if (dataURI.length % 3 == 2){
                dataURI = dataURI + " ";
            }
            var neededLen = Math.round(dataURI.length/3);
            var customRegex = new RegExp('.{1,'+neededLen+'}','g');
            return dataURI.match(customRegex);
        }


        //Create 4th file by xor 3 files
        function xorInServer(stringArrays){
            var fourtArr;
            fourtArr = fileProcessor.xor3Strings(stringArrays[0], stringArrays[1], stringArrays[2]);
            stringArrays.push(fourtArr);
            stringArrays[0] = fileProcessor.string2Bin(stringArrays[0]);
            stringArrays[1] = fileProcessor.string2Bin(stringArrays[1]);
            stringArrays[2] = fileProcessor.string2Bin(stringArrays[2]);
            return stringArrays;
        }


        // //Assign parts to cloud by adding information to file info
        // function assignParts(fileObject1, fileObject2, fileObject3, fileObject4){

        // }

        // //Save parts information of file to Db
        // function savePartsInfoToDb(fileObject){

        // }

        //Upload parts to cloud
        this.uploadToCloud = function (fileTitle, fileContent){
            var self = this;
            var DEFAULT_FILE = {
                content: '',
                metadata: {
                    id: null,
                    title: fileTitle+'.txt',
                    mimeType: 'text/plain',
                    editable: false
                }
            };
            return drive.saveFile(DEFAULT_FILE.metadata, fileContent).then(function(result) {
                showMessage('File saved');
                self.requesting = false; 
            }, function(err) {
                showMessage('Unable to save file');
                return $q.reject(err);
            });

           
            
        }


            /**
        * Displays a short message as a toast
        *
        * @param {String} message Message to display
        */
        var showMessage = function(message) {
            $mdToast.show($mdToast.simple().content(message));
        };

        
        
        this.upload = function(fileList, user) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            
            var self = this;
            self.requesting = true;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/');
            
            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                    // 1. Save file information to DB
                var self = this;
                var fileId = null;
                var saveFilePromise = saveFileToDb(fileObj, user);
                    // 2. Convert file to Base64
                // saveFilePromise.then(function(value){
                    
                //     self.fileId = value.message;
                // });
                console.log(saveFilePromise);
                encodeBase64(fileObj, function(result){
                    var  byteStringFull = result;
                    // 3. Split file into 3 file
                    var fileParts = splitFile(byteStringFull);
                    // 4. Xor 3 file by sending 3 file to server and receive the 4th file
                    fileParts = xorInServer(fileParts);
                    // 5. Create 4 file and upload to google drive
                    angular.forEach(fileParts, function(filePart,key) {
                        self.uploadToCloud(fileObj.name+'_'+key, JSON.stringify(filePart));
                    })
                });
                

                fileObj instanceof window.File && form.append('file-' + i, fileObj);
            };

            

            return deferred.promise;
        };
    }]);
})(window, angular);