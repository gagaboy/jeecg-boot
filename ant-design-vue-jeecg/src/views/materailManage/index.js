// 文件转 Blob (url) 预览
function getObjectURL(file) {
  if (window.createObjectURL != undefined) {
    getObjectURL = file => window.createObjectURL(file);
  } else if (window.URL != undefined) {
    getObjectURL = file => window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    getObjectURL = file => window.webkitURL.createObjectURL(file);
  }
  return getObjectURL(file)
}

//转换为KB, MB
function changeKBM(limit){
  var size = "";
  if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
    size = limit.toFixed(2) + "B"
  }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
    size = (limit/1024).toFixed(2) + "KB"
  }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
    size = (limit/(1024 * 1024)).toFixed(2) + "MB"
  }else{                                            //其他转化成GB
    size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
  }

  var sizeStr = size + "";                        //转成字符串
  var index = sizeStr.indexOf(".");                    //获取小数点处的索引
  var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
  if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size;
}

var imgReady = (function () {
  var list = [], intervalId = null,
    // 用来执行队列
    tick = function () {
      var i = 0;
      for (; i < list.length; i++) {
        list[i].end ? list.splice(i--, 1) : list[i]();
      };
      !list.length && stop();
    },
    // 停止所有定时器队列
    stop = function () {
      clearInterval(intervalId);
      intervalId = null;
    };
  return function (url, ready, load, error) {
    var onready, width, height, newWidth, newHeight,
      img = new Image();
    img.src = url;
    // 如果图片被缓存，则直接返回缓存数据
    if (img.complete) {
      ready.call(img);
      load && load.call(img);
      return;
    };
    width = img.width;
    height = img.height;
    // 加载错误后的事件
    img.onerror = function () {
      error && error.call(img);
      onready.end = true;
      img = img.onload = img.onerror = null;
    };
    // 图片尺寸就绪
    onready = function () {
      newWidth = img.width;
      newHeight = img.height;
      if (newWidth !== width || newHeight !== height ||newWidth * newHeight > 1024) {
        // 如果图片已经在其他地方加载可使用面积检测
        ready.call(img);
        onready.end = true;
      };
    };
    onready();
    // 完全加载完毕的事件
    img.onload = function () {
      // onload在定时器时间差范围内可能比onready快
      // 这里进行检查并保证onready优先执行
      !onready.end && onready();
      load && load.call(img);
      // IE gif动画会循环执行onload，置空onload即可
      img = img.onload = img.onerror = null;
    };
    // 加入队列中定期执行
    if (!onready.end) {
      list.push(onready);
      // 无论何时只允许出现一个定时器，减少浏览器性能损耗
      if (intervalId === null) intervalId = setInterval(tick, 40);
    };
  };
})();

import { axios } from '@/utils/request'

//post
function postAction1(url,parameter, config = {}) {
  return axios({
    url: url,
    method: config.method ? config.method.toLowerCase() : 'post',
    timeout: 1000 * 60 * 6,
    data: parameter,
    ...config
})
}

const matUpload1 = (params) => postAction1('/material/upload', params)  //素材上传

export{
  getObjectURL,
  changeKBM,
  imgReady,
  postAction1,
  matUpload1
}