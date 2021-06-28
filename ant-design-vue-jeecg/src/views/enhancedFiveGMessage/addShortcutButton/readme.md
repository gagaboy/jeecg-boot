## 模板使用说明 ##

1、快捷按钮和设置中的固定按钮总和不能超过10个
2、删除时不显示弹窗

在HTML中引用：
<m-addshortcutbutton :data="addBTNData" :id="id" :form="form" :name="name" />

具体数据说明：
addBTNData:[],
id:"",
form:"",
name:""

1、“回复按钮”
{"type":"reply","description":""}
校验：
description：10个字，必填

2、“跳转按钮”
{"type":"url","description":"","url":""}
校验：
description：10个字，必填
url：以http/https开头，必填

3、“打开app按钮”
{"type":"openApp","description":"","openAppAndroid":""}
校验：
description：10个字，必填
openAppAndroid： 必填

4、“打电话按钮”
{"type":"call","description":"","phoneNum":""}
校验：
description：10个字，必填
phoneNum： 号码校验（只能输入数字，+，-，空格），必填

5、“发送地址按钮”
{"type":"sendAddress","description":""}
校验：
description：10个字，必填

6、“地址定位按钮”
{"type":"addressLocation","description":"","sendAddressPlaceName":"","sendAddressLongitude":"","sendAddressLatitude":""}
校验：
description：10个字，必填
sendAddressPlaceName：20个字，必填
sendAddressLongitude：必填
sendAddressLatitude：必填

7、“拍摄按钮”
{"type":"screen","description":"","targetContact":""}
校验：
description：10个字，必填
targetContact：必填

8、“调起指定联系人”
{"type":"bringUp","description":"","targetContact":"","presendContent":""}
校验：
description：10个字，必填
targetContact：必填
presendContent：100个字

