var http = require('http');
var url = require('url');
var iconv = require('iconv-lite');
var items = [];

var server = http.createServer(function(req, res){
  switch(req.method){
    case 'POST':
      var item = '';
      req.on('data', function(chunk){
        var sjis = iconv.decode(chunk, "Shift_JIS");
        item += sjis;
      });
      req.on('end', function(){
        items.push(item);
        console.log(items);
        res.end('OK\n');
      });
      break;

    case 'GET':
      var body = items.map(function(item, i){
        return i + ') ' + item;
      }).join('\n');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.end(body);
      break;

    case 'DELETE':
      //new URLではエラーになるため古い方を使用
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);

      if(isNaN(i)){
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if(!items[i]){
        res.statusCode = 404;
        res.end('Item not found');
      } else{
        items.splice(i, 1);
        res.end('OK\n');
      }
      break;

    case 'PUT':
      //new URLではエラーになるため古い方を使用
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);

      if(isNaN(i)){
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if(!items[i]){
        //存在しない場合は追加
        var item = '';
        req.on('data', function(chunk){
          var sjis = iconv.decode(chunk, "Shift_JIS");
          item += sjis;
        });
        req.on('end', function(){
          items.push(item);
          console.log(items);
          res.end('OK\n');
        });
      } else{
        //存在する場合は更新
        var item = '';
        req.on('data', function(chunk){
          var sjis = iconv.decode(chunk, "Shift_JIS");
          item += sjis;
        });
        req.on('end', function(){
          items[i] = item;
          console.log(items);
          res.end('OK\n');
        });
      }
      break;

  }
});
server.listen(3000);