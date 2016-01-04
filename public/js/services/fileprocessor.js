(function(window, angular) {
    'use strict';
    angular.module('FileManagerApp').service('fileProcessor', [function () {
        

        this.requesting = true;
        return {
            xor3Strings: function (str1, str2, str3){
                var xor1 = this.xor2Strings(str1, str2);
                var numArrResult = this.xor2Strings(xor1, str3);
                return numArrResult;
            },
            string2Bin: function (str) {
                var result = [];
                for (var i = 0; i < str.length; i++) {
                  result.push(str.charCodeAt(i));
                }
                return result;
            },

            bin2String: function (array) {
                return String.fromCharCode.apply(String, array);
            },

            xor2Strings: function (str1, str2){
                var maxLength = Math.max(str1.length, str1.length);
                // if (maxLength > str1.length){
                //  for (var i = maxLength - str1.length - 1; i >= 0; i--) {
                //    str1 = " " + str1;
                //  }
                // } else if (maxLength > str2.length) {
                //  for (var i = maxLength - str2.length - 1; i >= 0; i--) {
                //    str2 = " " + str2;
                //  }
                // }
                // 
                var numArr1;
                var numArr2;
                var numArrResult = [];
                if (typeof str1 === 'string' || str1 instanceof String){
                    numArr1 = this.string2Bin(str1);   
                } else {
                    numArr1 = str1;
                }

                if (typeof str2 === 'string' || str2 instanceof String){
                    numArr2 = this.string2Bin(str2);   
                } else {
                    numArr2 = str2;
                }

                for (var i = 0, len = maxLength; i < len; i++) { 
                    numArrResult.push(numArr1[i]^numArr2[i]);
                }

                return numArrResult;
            },

            fileFromBase64: function(base64String, fileType, fileName){
                var blob = new Blob([base64String], {type: fileType});
                var url = window.URL || window.webkitURL;
                return url.createObjectURL(blob);
            }
        };
    


              

    }]);
})(window, angular);