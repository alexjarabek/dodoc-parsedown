String.prototype.trimStart = String.prototype.trimStart
  ? String.prototype.trimStart
  : function() {
      if (String.prototype.trimLeft) {
        return this.trimLeft();
      } else if (String.prototype.trim) {
        var trimmed = this.trim();
        var indexOfWord = this.indexOf(trimmed);

        return this.slice(indexOfWord, this.length);
      }
    };

module.exports.parse = function(text) {
  var pieces = text.split('\n\n----\n\n');
  var results = {};

  // find property by looking for the first colon
  for (var i = 0; i < pieces.length; i++) {
    var piece = pieces[i] || '';
    if (piece.indexOf(':') > 0) {
      const first_colon_position = piece.indexOf(':');
      let prop = piece.substring(0, first_colon_position);
      prop = prop.trim();

      let value = piece.substring(first_colon_position + 1);

      if (value.startsWith('\n\n-\n')) {
        let subvalues = value.split('\n-\n');

        subvalues = subvalues.reduce((acc, sv) => {
          let pieces = sv.split(/\n/);
          let results = {};

          for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i] || '';
            if (piece.trim() !== '' && piece.indexOf(':') > 0) {
              let first_colon_position = piece.indexOf(':');

              let sub_prop = piece.substring(0, first_colon_position);
              sub_prop = sub_prop.trim();

              let sub_value = piece.substring(first_colon_position + 1);
              sub_value = sub_value.trim();

              results[sub_prop] = sub_value;
            }
          }

          if (Object.keys(results).length > 0) {
            acc.push(results);
          }

          return acc;
        }, []);

        results[prop] = subvalues;
      } else {
        value = value.trimStart();
        // if(value.endsWith('\n')) {
        //   value = value.slice(0, -1);
        // }
        results[prop] = value;
      }
    } else {
      if (!!piece.trim()) {
        results['content'] = piece;
      }
    }
  }
  return results;
};

module.exports.textify = function(obj) {
  var str = '';
  for (var prop in obj) {
    var value = obj[prop];

    // if value is a string, it's all good
    // but if it's an array we'll need to make it into a string
    if (typeof value === 'array') {
      value = value.join(', ');
    }

    // check if value contains a delimiter
    if (typeof value === 'string' && value.indexOf('\n----\n') >= 0) {
      // prepend with a space to neutralize it
      value = value.replace('\n----\n', '\n ----\n');
    }

    if (typeof value === 'object') {
      // loop for each item in object
      var objstr = '\n\n';

      for (var index in value) {
        var thisItem = value[index];
        objstr += '-\n';
        // loop for each prop for each object
        for (var itemProp in thisItem) {
          objstr += itemProp + ': ' + thisItem[itemProp] + '\n';
        }
      }
      value = objstr;
    }
    str += prop + ': ' + value + '\n\n----\n\n';
  }
  return str;
};
