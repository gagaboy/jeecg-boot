//添加不同的媒体类型
class InitializeContent {
	constructor(type) {}
}

//文字
class text extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'text' //设置类型
		this.originalMessage = '' //文本消息

//		this.reply = {
//			"content":"123123"  //提交给后台的格式
//		}
	}
}

//图片
class image extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'image' //设置类型
		this.reply = {
			"mediaUrl": "",  //文件地址
			"fileName": "",  //文件名字
			"fileSize": 0,  //文件大小
			"thumbnailFileSize": 0,  //视频的封面图大小
			"thumbnailMediaUrl": "",  //视频的封面图地址
			"thumbnailMediaContentType": "",  //视频的封面图类型
			"playingLength": 0,  //视频播放的长度

			"mediaContentType": "image/png",  //文件的类型
		}
	}
}

//音频
class voice extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'voice' //设置类型
		this.reply = {
			"mediaUrl": "",
			"fileName": "",
			"fileSize": 0,
			"thumbnailFileSize": 0,
			"thumbnailMediaUrl": "",
			"thumbnailMediaContentType": "",
			"playingLength": 0,

			"mediaContentType": "audio/mp3",
		}
	}
}
//音频
class video extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'video' //设置类型
		this.reply = {
			"mediaUrl": "",
			"fileName": "",
			"fileSize": 0,
			"thumbnailFileSize": 0,
			"thumbnailMediaUrl": "",
			"thumbnailMediaContentType": "",
			"playingLength": 0,

			"mediaContentType": "video/mp4",
		}
	}
}

//10.19新增文件类型
class file extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'file' //设置类型
		this.reply = {
			"fileName": "",
			"mediaUrl": "",
			"fileSize": 0,
			"mediaContentType": "", //application/****
		}
	}
}

//单卡
class singleCard extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'singleCard' //设置类型
		this.reply = {
			cardOrientation: '', //"VERTICAL/HORIZONTAL" 垂直和水平
			height: '', //"MEDIUM_HEIGHT/TALL_HEIGHT/SHORT_HEIGHT"  图片的高度
			imageAlignment: 'RIGHT',  //卡片消息 居左 居右，，水平的时候有效，目前页面中未设置这个
			card: new Card(),
		}
	}
}
//多卡
class manyCards extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'manyCards' //设置类型
		this.reply = {
			cardWidth: '', //"MEDIUM_WIDTH/SMALL_WIDTH " -- 卡片的宽
			cardHeight: '', //单独去设置,//"MEDIUM_HEIGHT/TALL_HEIGHT/SHORT_HEIGHT" -- 卡片的高
			imageAlignment: 'RIGHT',  //卡片消息 居左 居右，，水平的时候有效，目前页面中未设置这个
			cards: [],
		}
		this.reply.cards.push(new Card())  //设置一个默认的值
	}
}

//20.10.09新增转换模板
class conversionTemplate extends InitializeContent {
	constructor() {
		super()
		this.replyType = 'conversionTemplate' //设置类型

		this.reply = {
			conversionTemplateId: undefined, //选择要转换的模板id
			conversionTemplateName: '', //选择的模板名字，用于卡片上展示
			conversionTemplateMsgType: '', //模板名字
		}
	}
}

//ButtonReply对象
class ButtonReply {
	constructor() {
		this.type = 'reply'  //按钮的类型
		this.description = '' //文案
		this.content = '' //回复内容/链接
		this.openAppAndroid = '' //打开安卓
		this.openAppIos = '' //打开安卓

		this.callPhone = ''  //电话号码

		this.sendAddressPlaceName = ''  //地点名称
		this.sendAddressLongitude = ''  //经度
		this.sendAddressLatitude = ''  //纬度

		this.targetContact = '' //目标联系人
		this.presendContent = ''  //预发送内容

		//----新增字段用于存引用的值----
		//回复按钮的按钮文案输入框
		//跳转按钮的http链接输入框
		//打电话按钮的电话号码输入框
		this.originalDescription = ''  //新增description原版数据
		this.originalContent = ''  //新增content原版数据
		this.originalCallPhone = ''  //新增callPhone原版数据

		//0721新增设置日历提醒按钮
		this.chooseTime = [] //选择的日期
//		this.startTime = '' //开始时间（UTC格式），通过chooseTime[0]去取
//		this.endTime = '' //结束时间（UTC格式），通过chooseTime[1]去取
		this.title = '' //标题
		this.characterization = '' //说明

		//10.12新增引用
		this.originalOpenAppAndroid = '' //新增openAppAndroid原版数据
		this.originalSendAddressPlaceName = '' //新增sendAddressPlaceName原版数据
		this.originalSendAddressLongitude = '' //新增sendAddressLongitude原版数据
		this.originalSendAddressLatitude = '' //新增sendAddressLatitude原版数据
		this.originalTargetContact = '' //新增targetContact原版数据-拍摄按钮，调起指定联系人 的目标联系人加入引用
		
		//11.13新增需求
		this.application = 'webview' //打开url的方式
	}
}

//初始化数据
class Card {
	constructor() {
		this.media = {
			"mediaUrl": "", //文件地址
			"fileName": "", //文件名
			"fileSize": 0, //文件大小
			"thumbnailFileSize": 0,  //视频封面图大小
			"thumbnailMediaUrl": "", //视频封面图地址
			"thumbnailMediaContentType": "",  //视频封面图类型
			"playingLength": 0,  //视频的长度

			mediaContentType: "",  ////文件的类型
			height: 'TALL_HEIGHT',  //图片的高度
			mediaType: "pic", //上传的参数 pic, voice, video
		}
		this.title = ""  //标题
		this.description = ""  //描述
		this.buttons = []  //底部的按钮

		this.originalTitle = '' //新增title原版数据
		this.originalDescription = '' //新增description原版数据

////		<!--0918新增选择是引用还是选择图片-->
//		this.chooseMediaStyle = 'chooseMediasImg' //默认是选择图片
//		this.originalMedia = '' //新增替换前的素材值
//		this.revisionMedia = '' //新增替换引用后的素材值
	}
}


//再次上传前清空之前的数据.初始化数据
class CatMedia {
	constructor() {
		var result = {
			"mediaUrl": "",
			"fileName": "",
			"fileSize": 0,
			"thumbnailFileSize": 0,
			"thumbnailMediaUrl": "",
			"thumbnailMediaContentType": "",
			"playingLength": 0,

			mediaContentType: "",
		}
		for(var key in result) {
			this[key] = result[key]
		}
	}
}

export default {
	text,
	image,
	voice,
	video,
	file: file,
	singleCard,
	manyCards,
	conversionTemplate,

	ButtonReply,
	Card,

	CatMedia,
}
