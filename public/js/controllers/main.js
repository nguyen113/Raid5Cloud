(function(window, angular, $) {
    'use strict';
    angular.module('FileManagerApp').controller('FileManagerCtrl', [
        '$rootScope', '$scope', '$translate', '$cookies', '$routeParams', 'fileManagerConfig', 'item', 'fileNavigator', 'fileUploader','login', 'fileDownloader', 'drive',
        function($rootScope, $scope, $translate, $cookies, $routeParams, fileManagerConfig, Item, FileNavigator, FileUploader, login, FileDownloader, drive) {

        
        $scope.config = fileManagerConfig;
        $scope.reverse = false;
        $scope.predicate = ['model.type', 'model.name'];        
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate[1] === predicate) ? !$scope.reverse : false;
            $scope.predicate[1] = predicate;
        };

        $scope.query = '';
        $scope.temp = new Item();
        $scope.fileNavigator = new FileNavigator();
        $scope.fileUploader = FileUploader;
        $scope.fileDownloader = FileDownloader;
        $scope.uploadFileList = [];
        $scope.viewTemplate = $cookies.viewTemplate || 'main-table.html';
        $rootScope.loading = true;
        $scope.file = null;
        $scope.parts = [];
        $scope.user = drive.getUserInfo();


        $scope.setTemplate = function(name) {
            $scope.viewTemplate = $cookies.viewTemplate = name;
        };

        $scope.changeLanguage = function (locale) {
            if (locale) {
                return $translate.use($cookies.language = locale);
            }
            $translate.use($cookies.language || fileManagerConfig.defaultLang);
        };

        $scope.touch = function(item) {
            item = item instanceof Item ? item : new Item();
            item.revert();
            $scope.temp = item;
        };

        $scope.modal = function(id, hide) {
            return $('#' + id).modal(hide ? 'hide' : 'show');
        };

        $scope.isInThisPath = function(path) {
            var currentPath = $scope.fileNavigator.currentPath.join('/');
            return currentPath.indexOf(path) !== -1;
        };



        $scope.remove = function(item) {
            item.remove().then(function() {
                $scope.fileNavigator.refresh($scope.user);
                $scope.modal('delete', true);
            });
        };

        $scope.createFolder = function(item) {
            var name = item.tempModel.name && item.tempModel.name.trim();
            item.tempModel.type = 'dir';
            item.tempModel.path = $scope.fileNavigator.currentPath;
            if (name && !$scope.fileNavigator.fileNameExists(name)) {
                item.createFolder().then(function() {
                    $scope.fileNavigator.refresh($scope.user);
                    $scope.modal('newfolder', true);
                });
            } else {
                item.error = $translate.instant('error_invalid_filename');
                return false;
            }
        };

        $scope.uploadFiles = function() {

                
            $scope.fileUploader.upload($scope.uploadFileList, $scope.user).then(function(){
                $scope.modal('uploadfile', true);
                $scope.fileNavigator.refresh($scope.user);
            });
        };


        $scope.download = function(item) {
            // item.download().then(function(){
            //     $scope.modal('download', true);
            // });
            // var filePromise = drive.loadFile("0B75tWDW8cweYdjZWdmM1ZGZERE0").then(function(file) {
            //   $scope.file = file;
            //   console.log($scope.file);
            // }, function(err) {
            //   if(item.id) {
            //     showMessage('Unable to load file');
            //   }
            //   $scope.fileNavigator.refresh();
            // });
            // 
            // 
            // 1. Get parts information
            $scope.parts = fileDownloader.getPartsInfor(item);
            // 2. Download parts
            var filePromise = fileId ? drive.loadFile(fileId) : $q.when(DEFAULT_FILE);
            return filePromise.then(function(file) {
                $scope.file = file;
                return $scope.file;
            }, function(err) {
                if(fileId) {
                    showMessage('Unable to load file');
                }
                return load();
            });
            // 3. Check file
            // 3.1 if file not correct, find failed part and recover
            // 4. decode and save file.
            
            
        };

        $scope.getQueryParam = function(param) {
            var found;
            window.location.search.substr(1).split('&').forEach(function(item) {
                if (param ===  item.split('=')[0]) {
                    found = item.split('=')[1];
                    return false;
                }
            });
            return found;
        };


        // ///////////////////////////////
        // ///Google Drive function///////
        // ///////////////////////////////

        // var DEFAULT_FILE = {
        //     content: '',
        //     metadata: {
        //         id: null,
        //         title: 'untitled.txt',
        //         mimeType: 'text/plain',
        //         editable: true
        //     }
        // };

        // $scope.file = null;
        // $scope.loading = true;

        // /**
        // * Internal helper to saves the current file. If the file is new, redirects to the correct URL once complete.
        // *
        // * @return {Promise} promise that resolves once the save is complete
        // */
        // var save = function() {
        //     return drive.saveFile($scope.file.metadata, $scope.file.content).then(function(result) {
        //     redirectIfChanged(result.metadata.id);
        //     $scope.file = result;
        //     showMessage('File saved');
        //     return $scope.file;
        // }, function(err) {
        //     showMessage('Unable to save file');
        //     return $q.reject(err);
        // });
        // };


        // /**
        // * Internal helper to load a file. If no ID given or unable to read the specified file, a blank template
        // * is loaded.
        // *
        // * @param {String} fileId ID of the file to load
        // * @return {Promise} promise that resolves once the file is loaded
        // */
        // var load = function(fileId) {
        //     var filePromise = fileId ? drive.loadFile(fileId) : $q.when(DEFAULT_FILE);
        //     return filePromise.then(function(file) {
        //         $scope.file = file;
        //         return $scope.file;
        //     }, function(err) {
        //         if(fileId) {
        //         showMessage('Unable to load file');
        //     }
        //     return load();
        //     });
        // };



        ///////////////////////////////
        ///End Google Drive function///
        ///////////////////////////////

        
        $scope.changeLanguage($scope.getQueryParam('lang'));
        $scope.isWindows = $scope.getQueryParam('server') === 'Windows';

            login.checkAuth($routeParams.user).then($scope.fileNavigator.refresh($scope.user), function() {
            
            return login.showLoginDialog(null, $routeParams.user);

        });
    }]);
})(window, angular, jQuery);
