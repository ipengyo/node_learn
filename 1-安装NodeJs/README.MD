# 安装NodeJs

> 工欲善其事必先利其器 

## 如何安装

### 安装程序

NodeJS提供了一些安装程序，都可以在[nodejs.org](https://nodejs.org/en/download/current/)这里下载并安装。

Windows系统下，选择和系统版本匹配的.msi后缀的安装文件。Mac OS X系统下，选择.pkg后缀的安装文件。

### 编译安装

Linux系统下没有现成的安装程序可用，虽然一些发行版可以使用apt-get之类的方式安装，但不一定能安装到最新版。因此Linux系统下一般使用以下方式编译方式安装NodeJS。

确保系统下g++版本在4.6以上，python版本在2.6以上。

从nodejs.org下载tar.gz后缀的NodeJS最新版源代码包并解压到某个位置。

进入解压到的目录，使用以下命令编译和安装。
```
$ ./configure
$ make
$ sudo make install
```

### 使用nvm安装（推荐）

如果你有经常更换`NodeJs版本`的需求的话推荐使用这种方式，简单方便快捷。
* [nvm-windows github](https://github.com/coreybutler/nvm-windows)
  >指导教程： [http://blog.csdn.net/tyro_java/article/details/51232458](http://blog.csdn.net/tyro_java/article/details/51232458)

* [nvm github](https://github.com/creationix/nvm)
 
``` 
# 安装Nvm
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

# 用Nvm安装Node.js

$ nvm install 8.2.0
$ nvm alias default 8.2.0
```
## 如何运行

打开终端，输入以下命令，例如：
```
$ node -v
v6.2.0

$ npm -v
3.8.9

```

有输出便是安装成功 😄

> * npm :  [NPM](https://www.npmjs.com)的全称是Node Package Manager ，是一个NodeJS包管理和分发工具。

> * 小贴士: 当你感觉通过 ` npm ` 下载包的速度很慢时 可以在命令后面指定国内的仓库 列如：  `npm install express  --registry=https://registry.npm.taobao.org `