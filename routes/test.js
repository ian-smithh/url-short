var codeset  = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var base = codeset.length;

function encode(intStr) {
  var hash = "";
  intStr = parseInt(intStr);
  while (intStr > 0) {
    hash = codeset[parseInt(intStr % base)] + hash;
    intStr = Math.floor(intStr / base);
  }
  return hash;
}

function decode(encoded) {
  var intStr = 0;

  for (var i = 0; i < encoded.length; i++) {
    var char, n, power;

    char = encoded[i];

    n = codeset.indexOf(char);

    if (n == -1) {
      return -1; // bad hash
    }

    power = (encoded.length-1)-i;
    intStr += n * Math.pow(base, power);
  }
  return parseInt(intStr);
}

var result = encode("12345");
console.log("encode '12345' = "+result);
console.log("decode "+result+" = "+decode(result));