import CallApp from './callappLib.js';

function openAppCallappLib(button) {
						var that = this
						var protocol = button.openAppAndroid
						//0615新增，去除iosUrl必填，所以这里是空，不处理
						if(!protocol) {
							return
						}
						console.log('-打开链接-', protocol)
						
						
						const option = {
							scheme: {
								protocol,
							},
							//    outChain: {
							//      protocol: 'ykshortvideo',
							//      path: 'temporary',
							//      key: 'url',
							//    },
							//    intent: {
							//      package: 'com.youku.shortvideo',
							//      scheme: 'ykshortvideo',
							//    },
							//    universal: {
							//      host: 'flash-link.youku.com',
							//      pathKey: 'action',
							//    },
//							appstore: 'https://itunes.apple.com/cn/app/id1383186862',
//							appstore: this.iosUrl,
//							yingyongbao: this.androidUrl,
							//				    yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.youku.shortvideo',
							//    fallback: 'https://dianliu.youku.com/service/download',
							timeout: 2000,
						};
						const lib = new CallApp(option);
						//1s后打开
						setTimeout(() => {
							lib.open({
								path: '',
							});
						}, 1000)

					}

export {
	openAppCallappLib,
}
