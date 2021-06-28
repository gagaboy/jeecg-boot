class CatRobotImgCalculation {
	constructor() {

	}
	getImgSize(img_url) {
		var result = {
			width: 0,
			height: 0,
			widthDivideHeight: 0, //宽高比例
		}
		// 创建对象
		var img = new Image()

		// 改变图片的src
		img.src = img_url

		return new Promise((reslove, reject) => {
			// 判断是否有缓存
			if(img.complete) {
				result.width = img.width
				result.height = img.height
				if(result.height) {
					result.widthDivideHeight = result.width / result.height
				}
				reslove(result)
			} else {
				// 加载完成执行
				img.onload = function() {
					result.width = img.width
					result.height = img.height
					if(result.height) {
						result.widthDivideHeight = result.width / result.height
					}
					reslove(result)
				}
			}
		})
	}
}

export {
	CatRobotImgCalculation,
}