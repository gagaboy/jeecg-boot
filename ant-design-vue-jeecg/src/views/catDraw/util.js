var isTest = false //是否是测试环境

// import EmojiCharString from 'emojicharstring' //新增处理emoji的长度问题

//获取前七天或后7天的日期(时间跨度)
function getDateSpan(index) {
    var date = new Date(); //当前日期
    var newDate = new Date();
    newDate.setDate(date.getDate() + index); //官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
    var time = newDate.getFullYear() + "-" + dataLeftCompleting(newDate.getMonth() + 1) + "-" + dataLeftCompleting(newDate.getDate()); //设置年月日
    return time;
}
//getDate(-7)
//getDate(+7)

//保留2位小数点（四舍五入）
//var num =2.446242342;
//num = num.toFixed(2);  // 输出结果为 2.45

//设置占比-//https://www.cnblogs.com/hdwang/p/9099286.html
function getPercent(num, total, unit = true, proportion = 100) {
    var result = '0.00'
    if (total && num) {
        result = Number((num / total) * proportion).toFixed(2)
    }
    if (unit) {
        result += '%'
    }
    return result
}

//设置扇形图的颜色数组
var colors = ["#5B8FF9", "#5AD8A6", "#F6BD16", "#E8684A", "#B6E3F5", "#BDD2FD", "#9270CA", "#D3C6EA", "#BDEFDB", "#FF9D4D", "#5D7092", "#FFD8B8", "#C2C8D5", "#269A99", "#AAD8D8", "#FBE5A2", "#FF99C3", "#FFD6E7", "#F6C3B7", "#6DC8EC", ];

/**
 **datestr:形如‘2017-06-12’的字符串
 **return Date 对象
 **/
function getDate(datestr) {
    var temp = datestr.split("-");
    if (temp[1] === '01') {
        temp[0] = parseInt(temp[0], 10) - 1;
        temp[1] = '12';
    } else {
        temp[1] = parseInt(temp[1], 10) - 1;
    }
    //new Date()的月份入参实际都是当前值-1
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}
/**
 ***获取两个日期间的所有日期
 ***默认start<=end
 **/
function getDiffDate(start, end) {
    var startTime = getDate(start);
    var endTime = getDate(end);
    var dateArr = [];
    //这里取左右区间（<=和<=）
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear();
        var month = (startTime.getMonth() + 1).toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
        var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
        dateArr.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
    }
    return dateArr;
}

//获取所有月份  
function getMonthArry(d1, d2) {        
    //	var d1 = '2016-02-01';        
    //	var d2 = '2016-12-30';        
    var dateArry = new Array();        
    var s1 = d1.split("-");        
    var s2 = d2.split("-");        
    var mCount = 0;        
    if (parseInt(s1[0]) < parseInt(s2[0])) {          
        mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1]) + 1;        
    } else {          
        mCount = parseInt(s2[1]) - parseInt(s1[1]) + 1;        
    }        
    if (mCount > 0) {          
        var startM = parseInt(s1[1]);          
        var startY = parseInt(s1[0]);          
        for (var i = 0; i < mCount; i++) {            
            if (startM < 12) {              
                dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);              
                startM += 1;            
            } else {              
                dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);              
                startM = 1;              
                startY += 1;            
            }          
        }        
    }  
    return  dateArry
}

/**
 * 补齐2位
 * @param bits 格式化位数
 * @param identifier 补全字符
 * @param value 值
 */
function dataLeftCompleting(value, bits = 2, identifier = 0) {
    value = Array(bits + 1).join(identifier) + value;
    return value.slice(-bits);
}

//正则去除emoji和前空格
var removeEmojiFrontSpace = /^(?!\s+)(?!.*([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030))/i

//正则去除emoji和所有空格
var removeEmojiAllSpace = /^(?!.*(\s|([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030)))/i

//所有空格或emoji或中文
var removeEmojiAllSpaceChinese = /^(?!.*(\s|([\u4e00-\u9fa5]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030)))/i

//必须以https开头和去除emoji
var removeEmojiHttps = /^(http|https):\/\/(?!.*(\s|([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030)))/i

//必须以https开头和去除emoji或中文
var removeEmojiHttpsChinese = /^(http|https):\/\/(?!.*(\s|([\u4e00-\u9fa5]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030)))/i

//去除所有emoji
var removeEmoji = /^(?!.*([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030))/i

//获取uuid
var getUUID = () => {
    return Math.random().toString(36).substr(3, 10)
}

//时间戳转日期
function transformTime(timestamp = +new Date()) {
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
    } else {
        return '';
    }
}

function addZero(m) {
    return m < 10 ? '0' + m : m;
}

function checkURL(URL) {
    var str = URL;
    //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
    //下面的代码中应用了转义字符"\"输出一个字符"/"
    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if (objExp.test(str) == true) {
        return true;
    } else {
        return false;
    }
}

//js判断字符串真实长度
var getStrRealLength = function(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

/**
 * js截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
function cutStrReal(str, len) {
    var str_length = 0;
    var str_len = 0;
    var str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        let a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length == len) {

            return str_cut;
        } else if (str_length > len) {
            str_cut = str_cut.substr(0, str_cut.length - 1);
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}


//处理没有file.type的问题,某些电脑上没返回type
var dealNoFileType = (file) => {
    var name = file.name
        //取名字的后缀
    var arr = name.split('.') || [] //分割
    var suffix1 = arr[arr.length - 1] || '' //取最后的后缀名
    var suffix = suffix1.toLowerCase() //转成纯小写,跟下面的进行匹配
    var result = {
            'bmp': 'image/bmp',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'gif': 'image/gif',
            'mp3': 'audio/mp3', //这里之前是audio/mpeg，乐乐说也可以用这个
            'wma': 'audio/x-ms-wma',
            'wav': 'audio/x-wav',
            'amr': 'audio/amr',
            'mp4': 'video/mp4',
            '3gp': 'video/3gp',
            'mov': 'video/mov',
        }
        //file.type = result[suffix]  //无法设置file的指定属性type
    file.catFileType = result[suffix] //自定义属性
}

//js生成字符串的所有大小写组合
function caseCombination(str) {
    let guide = str.split(/([a-zA-Z]+)/).filter(x => !!x).map(x => /^[a-zA-Z]+$/.test(x) ? [x.length, true] : [x.length, false]),
        length = guide.reduce((result, current) => result + (current[1] ? current[0] : 0), 0)

    let result = []

    for (let i = 2 ** length; i--;) {
        let bin = i.toString(2)
        bin = Array.from('0'.repeat(length - bin.length) + bin)
        for (let i = 0; i < guide.length; i++) {
            if (!guide[i][1]) {
                let index = 0
                for (let j = 0; j < i; j++) {
                    index += guide[j][0]
                }
                bin.splice(index, 0, ...
                    '0'.repeat(guide[i][0]).split(''))
            }
        }
        for (let i = str.length; i--;) {
            if (Number(bin[i])) {
                bin[i] = str[i].toUpperCase()
            } else {
                bin[i] = str[i].toLowerCase()
            }
        }
        result.push(bin.join(''))
    }

    return result
}
//把后缀的数组全部转成不区分大小写的方法
var producedAllCaseCombination = (arr) => {
    var result = []
    arr.forEach((item) => {
        result.push.apply(result, caseCombination(item))
    })
    return result
}

//新增处理emoji长度等问题
var emojiCharStringLen = (str) => {
        var emojiStr = new EmojiCharString(str)
            // return emojiStr.length
        return str.length
    }
    //新增截取emoji掉超过的长度
var emojiCharStringSubstr = (str, begin, len) => {
    var emojiStr = new EmojiCharString(str)
        // return emojiStr.substr(begin, len)
    return str.substr(begin, len)
}

//0603新增复制功能
var copyData = (value) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', value);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
}

//get请求时拼接参数
var stitchinParameters = (obj = {}) => {
    var result = []
    for (var key in obj) {
        if (obj[key]) {
            result.push(`${key}=${obj[key]}`)
        }
    }
    return result.join('&')
}

//JSON.parse深复制
var deepCloneCat = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

var setMediaType = (fileType) => {
    var that = this
    fileType = fileType || '' //需要设置个默认值
    var res = ''
    if (fileType.indexOf('image') > -1) {
        res = 'image'
    } else if ((fileType.indexOf('video') > -1)) {
        res = 'video'
    } else if ((fileType.indexOf('audio') > -1) || (fileType.indexOf('auido') > -1)) {
        //auido后台写错了, 兼容旧的数据.实际上是audio
        res = 'audio'
    } else if ((fileType.indexOf('application') > -1)) {
        res = 'file'
    }
    return res
}


export {
    isTest,
    getDateSpan,
    getPercent,
    colors,
    getDate,
    getDiffDate,
    getMonthArry,
    dataLeftCompleting,

    removeEmojiFrontSpace,
    removeEmojiAllSpace,
    removeEmojiHttps,
    removeEmoji,
    removeEmojiAllSpaceChinese,
    removeEmojiHttpsChinese,

    getUUID, //获取uuid
    transformTime, //时间戳转日期
    checkURL, //判断是否是链接

    getStrRealLength, //js判断字符串真实长度
    cutStrReal,

    dealNoFileType, //处理没有file.type的问题

    caseCombination,
    producedAllCaseCombination,

    emojiCharStringLen, //新增处理emoji长度等问题
    emojiCharStringSubstr, //新增截取emoji掉超过的长度

    copyData, //0603新增复制功能
    stitchinParameters, ////get请求时拼接参数
    deepCloneCat, //深克隆
    setMediaType, //设置需要的类型
}