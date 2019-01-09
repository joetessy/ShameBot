function buildTable(data, callback){
  var table = '*The Most Frequently Used Banned Words* \n'
  count = 1;
  for (var i = 0; i < data.length; i++ ){
    var message = `*${count}. ${data[i][0]}:* ${data[i][1]}\n`
    table += message;
    count ++;
  }
  callback(table);
}

module.exports = buildTable;