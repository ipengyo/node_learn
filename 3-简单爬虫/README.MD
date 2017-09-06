# 简单爬虫

豆瓣网，是我国人民喜闻乐见的文艺网站，今天我们就来爬取一下[豆瓣电影排行榜](https://movie.douban.com/top250)里面的电影数据，锻炼一下NodeJs的熟悉度
主要会用到的模块（包）有： 
* `request`   用来发送http请求 
* `cheerio`   服务器端的 jQuery 实现，这里用于解析 HTML。
* `fs`        用来保存文件(NodeJs自带的模块)

## 创建项目
创建一个目录比如 `test02` 然后在这个目录下面执行如下语句
```
$ npm init
```
初始化项目时需要填一些项目基本信息，如果不想填或不知道填什么，一路回车即可。这一步会生成一个 `package.json` 文件，保存项目的配置信息和模块依赖信息。

添加第三方包（request、cheerio）：

```
$ npm install request --save 
$ npm install cheerio --save
```

安装三方包的时候，添加 `--save` 参数，项目对于此包的依赖就会写入 `package.json` 文件中。

然后创建项目主文件 `spider.js`，下面写的爬虫程序就放在这个文件了。

## 编写程序逻辑

```js
// 引入模块
var request = require('request'); 
var cheerio = require('cheerio');
var fs = require('fs'); 
// 电影排行榜url
var movieUrl = 'https://movie.douban.com/top250';
// 爬去某一页电影数据
function spiderMovie (pageNumber, cb) {
  // 计算出 start 参数的值
  var _start = (pageNumber - 1) * 25;
  // 发送请求 获取html页面
  request({
    method: 'GET',
    url: movieUrl,
    qs: {
      start: _start
    }
  }, function (err, response, body) {
    if(err) {
      return cb(err);
    }
    var movies= [];
    //转换成JQuery操作api
    var $ = cheerio.load(body);
    $('.item').each(function () {
      // 获取图片链接
        var picUrl = $('.pic img', this).attr('src');
        var movie = {
            title: $('.title', this).text(), // 获取电影名称
            star: $('.info .star .rating_num', this).text(), // 获取电影评分
            link: $('a', this).attr('href'), // 获取电影详情页链接
            picUrl: picUrl
        };
        // 把所有电影放在一个数组里面
        movies.push(movie);
    });
    return cb(err, {
      pageNumber: pageNumber,
      movies: movies
    });
  });
}

// 执行 爬取第1页的数据
spiderMovie(1, function (err, data) {
  if(err){
    console.error(err);
  }
  console.log(data);
});

```
这段代码的意思是，传入一个页数，然后在回调函数内返回当前页面所有的电影数据，我们在终端中输入 `node spider.js` 就能看到我们分析的数据啦


接下来，如果我要一次性把排行榜所有的电影抓下来呢，我要怎么做呢，我们来写个函数

```js

function spiderAllMovies (cb) {
  var maxPageNumber = 10; // 最大只有10页
  var allMovies = []; // 存取所有的电影
  var count = 0; //记录获取成功的回调次数
  for(var i = 1; i<= maxPageNumber; i++) {
    spiderMovie(i, function ( err, obj) {
      allMovies = allMovies.concat(obj.movies);
      count++;
      // 到达10次的限制
      if(count === maxPageNumber) {
        // 给电影排下序，按分数
        allMovies = allMovies.sort(function (a, b) {
          return Number(b.star) - Number(a.star);
        });
        // 执行回调函数
        return cb (allMovies);
      }
    });
  }
}

// 执行 获取所有的电影数据 并且保存为文件
spiderAllMovies(function(allMovies) {
  console.log(allMovies);
  console.log('总共爬取的数据：' + allMovies.length);
  // 把数据保存为文件    __dirname 为当前文件目录
  fs.writeFile(__dirname + '/datas.json', JSON.stringify(allMovies, null, 4), function (err) {
    if(err) {
      console.error(err);
    }
    console.log('保存为文件成功');
  });
});

```

我们在终端输入 `node spider.js` 就能看到全部的电影数据了

到此我们的小爬虫的逻辑已经全部写完了，最后我们可以把这2个函数导出，给其他的代码使用.

```js

module.exports = {
  spiderMovie: spiderMovie,
  spiderAllMovies: spiderAllMovies
};

```



## 延伸

* spiderAllMovies 这个函数的代码 有点丑陋 可以使用更优雅的异步解决方案（Promise、async / await）
* 我们一股脑的全部发请求发出来了，对方服务器可能会对我们做限制，如何控制并发，每批发几个请求
* ...
