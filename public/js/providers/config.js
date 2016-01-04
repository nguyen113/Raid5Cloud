(function(angular) {
    'use strict';
    angular.module('FileManagerApp').provider('fileManagerConfig', function() {

        var values = {
            appName: 'Raid5 on the Cloud',
            defaultLang: 'en',

            listUrl: 'api/file/',
            uploadUrl: 'api/file',
            renameUrl: 'bridges/php/handler.php',
            copyUrl: 'bridges/php/handler.php',
            removeUrl: 'api/file/delete/',
            editUrl: 'bridges/php/handler.php',
            getContentUrl: 'bridges/php/handler.php',
            createFolderUrl: 'bridges/php/handler.php',
            downloadFileUrl: 'bridges/php/handler.php',
            compressUrl: 'bridges/php/handler.php',
            extractUrl: 'bridges/php/handler.php',
            permissionsUrl: 'bridges/php/handler.php',
            clientId: '745314666915-tin4km4rcu49la5oh5qtacmqei2vi0u6.apps.googleusercontent.com',
            applicationId: '709207149709',
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.install'],
            loadApis: {'drive' : 'v2'},
            apiKey: null,

            sidebar: true,
            breadcrumb: true,
            allowedActions: {
                rename: true,
                copy: true,
                edit: true,
                changePermissions: true,
                compress: true,
                compressChooseName: true,
                extract: true,
                download: true,
                preview: true,
                remove: true
            },

            enablePermissionsRecursive: true,
            compressAsync: true,
            extractAsync: true,

            isEditableFilePattern: /\.(txt|html?|aspx?|ini|pl|py|md|css|js|log|htaccess|htpasswd|json|sql|xml|xslt?|sh|rb|as|bat|cmd|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb)$/i,
            isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
            isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
            tplPath: 'templates'
        };

        return { 
            $get: function() {
                return values;
            }, 
            set: function (constants) {
                angular.extend(values, constants);
            }
        };
    
    });
})(angular);
