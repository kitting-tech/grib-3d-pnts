# 简介

grib-3d-viewer是一个
[GRIB](http://en.wikipedia.org/wiki/GRIB)
可视化工具， 
使用了
[Cesium](https://cesium.com)
的
[时间动态点云](https://sandcastle.cesium.com/?src=Time%20Dynamic%20Point%20Cloud.html&label=3D%20Tiles)
功能，
实现了类似 [ActiveFlight](https://www.cesium.com/blog/2018/05/08/activeflight/) 的点云效果。

### 预览

[image](https://github.com/kitting-tech/grib-3d-viewer/raw/master/screenshots/temp.png)

### 运行项目

	npm install
	npm start

浏览器打开 `localhost:8080`.

##### 可用脚本

* `npm start` - 使用 `webpack.config.js` 运行webpack build，并启动开发服务器
* `npm run build` - 使用 `webpack.config.js` 运行webpack build


