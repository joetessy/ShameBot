function buildTable(data, callback, tableName){
  if (tableName === 'banned_words'){
    var table = '*The Most Frequently Used Banned Words* \n\n'    
  } else if ( tableName === 'user_msgs'){
    var table = '*The Worst Offenders* \n\n'
  }
  count = 1;
  for (var i = 0; i < data.length; i++ ){
    var message = `*${count}). ${data[i][0]}:* _${data[i][1]}_\n`
    table += message;
    count ++;
  }
  table += '_________________\n\n\n'
  callback(table);
}

module.exports = buildTable;