var request = require('request'); 
var cheerio = require('cheerio');
var fs = require('fs'); //
var movieUrl = 'https://movie.douban.com/top250';

// 爬去某一页电影数据
function spiderMovie (pageNumber, cb) {
  // 计算出 start 参数
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
// spiderMovie(1, function (err, data) {
//   if(err){
//     console.error(err);
//   }
//   console.log(data);
// });



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

// spiderAllMovies(function(allMovies) {
//   console.log(allMovies);
//   console.log('总共爬取的数据：' + allMovies.length);
//   // 把数据保存为文件    __dirname 为当前文件目录
//   fs.writeFile(__dirname + '/datas.json', JSON.stringify(allMovies, null, 4), function (err) {
//     if(err) {
//       console.error(err);
//     }
//     console.log('保存为文件成功');
//   });
// });
 

module.exports = {
  spiderMovie: spiderMovie,
  spiderAllMovies: spiderAllMovies
};

