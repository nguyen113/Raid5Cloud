var convertStringAndBin = {
  string2Bin: function (str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i));
    }
    return result;
  },

  bin2String: function (array) {
    return String.fromCharCode.apply(String, array);
  }
};


module.exports = convertStringAndBin;