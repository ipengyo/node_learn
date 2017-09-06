// 这句的意思就是引入 `express` 模块，并将它赋予 `express` 这个变量等待使用。
var express = require('express');
// 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
var app = express();
// 引入爬虫模块
var spider = require('./spider');
// use的作用是加载一个函数。这个函数被称为中间件，作用是在请求被路由匹配之前，先进行一些处理。
// 这个中间件起到 logging 的作用，每收到一个请求，就在命令行输出一条记录。请特别注意，这个函数内部的next()，它代表下一个中间件，表示将处理过的请求传递给下一个中间件。
// 整个 Express 的设计哲学就是不断对 HTTP 请求加工，然后返回一个 HTTP 回应）。
app.use(function (req, res, next) {
  console.log('request log time: ' + new Date());
  next();
});

// app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
// 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
// request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
// response 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/douban', function(req, res) {
  // 执行爬取电影
  spider.spiderMovie(1, function (err, data) {
    if(err) {
      // 如果发生错误 就向客户端抛出 http status code 500
      return res.json({error: 'error'}).status(500);
    }
    return res.json(data);
  });
});

// 可以获取path 中的值 :num
app.get('/douban/:num', function(req, res) {
  // 获取客户端传入的值
  let num = req.params.num || 1;
  spider.spiderMovie(num, function (err, data) {
    if(err) {
      // 如果发生错误 就向客户端抛出 http status code 500
      return res.json({error: 'error'}).status(500);
    }
    return res.json(data);
  });
});

// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});