const parse2 = function(text) {
  var pieces = text.split('----');
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
        // value = value.trim();
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
