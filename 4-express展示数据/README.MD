# express输出数据

从`test02`目录复制出一个目录`test03`，我们利用express启动一个http服务，展示爬虫分析的数据，将第`2`节写的简单的express应用的app.js，移动到 `test03`目录。由于之前express 安装时没有记录到`package.json` 所以这次我们把他装到`package.json`这个文件里面去，输入
```
$ npm install express --save
```

接着 我们修改 `app.js`文件，首先引入spider.js
```js
// 引入爬虫模块
var spider = require('./spider');
```

然后给express 增加一个路由，里面调用spider里面的函数，返回数据给客户端
```js
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
```
接着我们启动http服务 `node app.js` 然后访问 `http://localhost:3000/douban` 就能看到第一页的电影数据了。

那么问题来了，如果我还想查看其他页的数据，那么我们加入可变的参数 
```js
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
```
接着我们启动http服务 `node app.js` 然后访问 `http://localhost:3000/douban/1` 就能看到第1页的电影数据了。
`http://localhost:3000/douban/2` 就能看到第2页的电影数据了。


## 最后

我们以这个项目项目锻炼了 NodeJs项目的组织方式，以及第三方模块使用的知识。

如果你想更深入了解
推荐一篇文章
* [您必须知道的几个Nodejs编码习惯](https://github.com/imfly/bitcoin-on-nodejs/blob/master/2-Node.js入门指南/4-您必须知道的几个Nodejs编码习惯.md#概念理解-1)
