<template>
	<div>
		<!--判断主题-->
		<div class="draw-side-menu">
			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="判断"></menuCommonTop>
			<div class="draw-side-menu-trigger">
				<div class="draw-side-menu-trigger-title">判断主题名称</div>
				<div class="txt-limit-div" style="position: relative;">
					<a-input  v-model="nowNode.nodeName" placeholder="请输入动作主题" :maxLength="25"></a-input>
					<span class="txt-limit">{{nowNode.nodeName && nowNode.nodeName.length || 0}} / 25</span>
				</div>

				<div v-for="(item, citylistindex) in nowNode.judgeModuleList" :key="citylistindex">
					<template v-if="!item.isDefaultBranch && item.showJudgeModule">
					<div class="draw-flex-center" style="justify-content: space-between; margin: 24px 0 8px 0;">
						<div class="draw-side-menu-trigger-title" style="margin: 0px;">{{item.judgeName}}</div>
						<a-icon @click="removeJudgeModuleList(citylistindex)" class="draw-cursor-pointer" type="delete" :style="{ fontSize: '16px' }" ></a-icon>
					</div>
					<div class="judgment">
						<div class="draw-borderbottom judgment-top" style="position: relative">
							执行当前分支，需要符合下述
							<a-select v-model="item.satisfy" size="small" style="margin: 0 5px;" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }" >
								<a-select-option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
							</a-select>
							判断项
						</div>

						<div v-for="(project, ind) in item.judgeProject" :key="ind">
							<div class="draw-flex-center judgment-center">
								判断条件{{ind+1}}
								<a-icon @click="removeList(citylistindex, ind)" class="draw-cursor-pointer" type="delete" :style="{ fontSize: '16px' }" ></a-icon>
							</div>

							<div class="draw-borderbottom draw-flex-center" style="flex-direction: column; position: relative;">
								<!--新增带上引用和emoji输入的input输入框-->
								<roInputAboutQuoteOne :inputAboutQuoteOne="project.inputOne[0]" quoteKey='originalMessage' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :showQuote="pageParameters.showQuote" :inputQuoteStyle="{width: '325px', marginTop: '12px',}" placeholder="请输入判断条件"></roInputAboutQuoteOne>

								<template v-if="hiddenLastInput(project.equal)">
									<a-select v-model="project.equal" :transfer="true" style="width: 325px; margin: 12px 0 6px 0;" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
										<a-select-option v-for="item in equals" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
									</a-select>
								</template>

								<div v-else class="draw-flex-center" style="margin: 12px 0 6px 0;">
									<a-select v-model="project.equal" :transfer="true" style="width:70px; margin-right: 13px;" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
										<a-select-option v-for="item in equals" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
									</a-select>
									<!--新增带上引用和emoji输入的input输入框-->
									<roInputAboutQuoteOne :inputAboutQuoteOne="project.inputTwo[0]" quoteKey='originalMessage' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :showQuote="pageParameters.showQuote" :inputQuoteStyle="{width: '242px',}" placeholder="请输入判断条件"></roInputAboutQuoteOne>
								</div>
							</div>
						</div>

						<div @click="clickAll" data-type="addList" :data-citylistindex="citylistindex" class="draw-flex-center add-content">
							<a-icon class="add-content-icon" type="plus"  :style="{ color: '#1890FF', fontSize: '14px' }" ></a-icon>
							添加判断
						</div>
					</div>
					</template>
				</div>

				<div @click="clickAll" data-type="addBranchList" class="draw-flex-center judgment add-content add-branch">
					<a-icon class="add-content-icon" type="plus"  :style="{ color: '#1890FF', fontSize: '14px' }" ></a-icon>
					添加分支
				</div>

				<div class="draw-side-menu-trigger-title">默认分支</div>
				<div class="draw-flex-center judgment add-content" style="color:rgba(0,0,0,0.65); margin-top: 5px;">
					其他分支判断都不成立时，则执行默认分支
				</div>

				<div style="margin-top: 24px;">
					<a-button v-dbClick @click="clickAll" data-type="save" class="draw-remove-button" type="primary" style="margin-right: 16px;">保存</a-button>
					<a-button @click="clickAll" data-type="cancel" class="draw-remove-button">取消</a-button>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
	import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮

	import roInputAboutQuoteOne from '../roInputAboutQuoteOne/roInputAboutQuoteOne' //新增带上引用和emoji输入的input输入框

	import { removeEmoji } from '../assets/js/util.js' //emoji表情

	//0509新增，引入节点信息
	import abuotNode from '../abuotNode.js' //节点对象
	var isTest = false

	export default {
		name: 'catDrawMenuJudge',
		components: {
			roInputAboutQuoteOne,
			menuCommonTop,
		},
		props: {
			nowNode: Object, //isTest = true
			nodeList: Array,
			otherNodeList: Array,

			//0528修改上传的地址
			pageParameters: {
				type: Object,
				default: function() {
					return {
						showQuote: true, //新增是否显示引用的内容
					}
				},
			},

			showBackButton: Boolean,  //0721新增显示返回按钮
		},
		data: function() {
			return {
				//				nowNode: {},

				cityList: [{
						value: '所有',
						label: '所有'
					},
					{
						value: '任意',
						label: '任意'
					},
				],
				model1: 'all',

				equals: [{
						value: '等于',
						label: '等于'
					},
					{
						value: '不等于',
						label: '不等于'
					},
					{
						value: '小于',
						label: '小于'
					},
					{
						value: '大于',
						label: '大于'
					},
					{
						value: '小于等于',
						label: '小于等于'
					},
					{
						value: '大于等于',
						label: '大于等于'
					},
					{
						value: '包含',
						label: '包含'
					},

					{
						value: '不包含',
						label: '不包含'
					},
					{
						value: '符合正则',
						label: '符合正则'
					},
					{
						value: '不符合正则',
						label: '不符合正则'
					},

					{
						value: '存在',
						label: '存在'
					},
					{
						value: '不存在',
						label: '不存在'
					},
					{
						value: 'http请求成功',
						label: 'http请求成功'
					},
					{
						value: 'http请求失败',
						label: 'http请求失败'
					},
					{
						value: '上行内容为文本',
						label: '上行内容为文本'
					},
					{
						value: '上行内容为图片',
						label: '上行内容为图片'
					},{
						value: '上行内容为音频',
						label: '上行内容为音频'
					},
					{
						value: '上行内容为视频',
						label: '上行内容为视频'
					},
				],
				equal: "等于",
			}
		},
		computed: {
			hiddenLastInput: function() {
				return function(type) {
					var hiddenLastArr = ['存在', '不存在', '判断成立', '判断不成立', 'http请求成功', 'http请求失败', '上行内容为文本', '上行内容为图片', '上行内容为音频', '上行内容为视频']
					//说明是这几个，不显示下面的判断项
					if(hiddenLastArr.indexOf(type) > -1) {
						return true
					} else {
						return false
					}
				}
			}
		},
		methods: {
			clickAll(e) {
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				if(typeof this[clickType] == 'function') {
					this[clickType](dataset)
					return
				}
			},
			addList(dataset) {
				var that = this
				this.nowNode.judgeModuleList[dataset.citylistindex].judgeProject.push({
					inputOne: [{
						originalMessage: '',
					}],
					equal: '等于',
					inputTwo: [{
						originalMessage: '',
					}],
				})
			},
			removeList(citylistindex, index) {
				var that = this
				this.nowNode.judgeModuleList[citylistindex].judgeProject.splice(index, 1)
			},
			removeJudgeModuleList(citylistindex) {
				//隐藏节点信息
				this.nowNode.judgeModuleList[citylistindex].showJudgeModule = false
				//修改分支名字
				this.findMaxBranch()
			},
			decideInput(judgeProject) {
				var result = true
				//判断条件
//				var judgeProject = this.nowNode.judgeProject
				judgeProject.forEach((project) => {
					project.inputOne.forEach((item) => {
						if(!item.originalMessage) {
							this.$message.warning('判断条件不能为空')
							result = false
						} else if(!removeEmoji.test(item.originalMessage)) {
							this.$message.warning('判断条件不能包含emoji')
							result = false
						}
					})
					if(result == true) {
						if(this.hiddenLastInput(project.equal)) {
							return result
						}

						project.inputTwo.forEach((item) => {
							if(!item.originalMessage) {
								this.$message.warning('判断条件不能为空')
								result = false
							} else if(!removeEmoji.test(item.originalMessage)) {
								this.$message.warning('判断条件不能包含emoji')
								result = false
							}
						})
					}
				})
				return result
			},
			//0514修改判断是否非必填
			decide() {
				//判断不能为空
				if(!this.nowNode.nodeName) {
					this.$message.warning('判断主题不能为空')
					return false
				} else if(!removeEmoji.test(this.nowNode.nodeName)) {
					this.$message.warning('判断主题不能包含emoji')
					return false
				}

				var judgeModuleList = this.nowNode.judgeModuleList || []
				var result = [] //0514修改这里判断需要排除默认分支
				judgeModuleList.forEach((item) => {
					//这里只判断存在的节点
					if(!item.isDefaultBranch && item.showJudgeModule) {
						result.push(item)
					}
				})
				if((!result) || (result.length < 1)) {
					this.$message.warning('不能没有判断分支')
					return false
				}


				for(var i = 0; i < result.length; i++) {
					var judgeModuleListOne = result[i]
					if((!judgeModuleListOne.judgeProject) || (judgeModuleListOne.judgeProject.length < 1)) {
						this.$message.warning('判断不能为空')
						return false
					}
					if(!this.decideInput(judgeModuleListOne.judgeProject)) {
						return false
					}
				}

				return true
			},
			//判断是否有默认分支，如果没有就新加一个进去
			judgeDefaultBranch() {
				var judgeModuleList = this.nowNode.judgeModuleList
				var result = 0
				for(var i = 0; i < judgeModuleList.length; i++) {
					var judgeModuleListOne = judgeModuleList[i]
					if(judgeModuleListOne.isDefaultBranch) {
						result = 1
					}
				}
				if(result == 0) {
					var newJudgeModuleList = new abuotNode.judgeOne()
					newJudgeModuleList.judgeName = '默认分支'
					newJudgeModuleList.isDefaultBranch = true  //是否是默认分支
					this.nowNode.judgeModuleList.push(newJudgeModuleList)
				}
			},
			save() {
				//先去除判断条件
				if(!this.decide()) {
					return
				}

				//0513添加一个默认节点
				this.judgeDefaultBranch()

				var nowNode = this.nowNode
				this.$emit('save', {
					eventObj: this.nowNode,
				})
			},
			cancel() {
				this.$emit('cancel')
			},
			drawQuote(data) {
				this.selectionStart(data.currentIndex, data.nodeName, data) //添加到原来的input里面去
			},
			selectionStart(index, quote, data) {
				var aboutObj = data.aboutObj
				var ind = aboutObj.ind
				var type = aboutObj.type

				var inputOne = type + ind + index //获取的id
//				var elInput = document.getElementById(inputOne).getElementsByClassName('ant-input')[0]; //根据id选择器选中对象
				var elInput = document.getElementById(inputOne) //根据id选择器选中对象
				var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
				var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
				if(startPos === undefined || endPos === undefined) return
				var txt = elInput.value;
				//		      // 将表情添加到选中的光标位置
				var result = txt.substring(0, startPos) + quote + txt.substring(endPos)
				elInput.value = result; // 赋值给input的value
				// 重新定义光标位置
				elInput.focus();
				elInput.selectionStart = startPos + quote.length;
				elInput.selectionEnd = startPos + quote.length;

				this.nowNode.judgeProject[ind][type][index]['originalMessage'] = result
			},
			//找到最大的分支名字并返回数组
			findMaxBranch() {
				var judgeModuleList = this.nowNode.judgeModuleList
				var max = 0
				//这里只要取不是默认分支的个数
				judgeModuleList.forEach((item) => {
					//这里只取存在的节点
					if(!item.isDefaultBranch  && item.showJudgeModule) {
						item.judgeName = '分支' + (max + 1)
						max += 1
					}
				})
				return max
			},
			//0515修改，需要先判断最后一个是否是默认分支
			isDefaultBranchLast() {
				var judgeModuleList = this.nowNode.judgeModuleList || []
				var result = false
				var last = judgeModuleList.slice(-1)[0] || {}
				if(last.isDefaultBranch && last.isDefaultBranch) {
					//说明最后一个是默认分支
					result = true
				}
				return result
			},
			addBranchList() {
				var that = this
				//0514修改；
				var len =	this.findMaxBranch()
				var newJudgeModuleList = new abuotNode.judgeOne()
				//这里应该取最后一个分支，然后再加上1
				newJudgeModuleList.judgeName = '分支' + (len + 1)
				//0515修改，需要先判断最后一个是否是默认分支
				if(this.isDefaultBranchLast()) {
					this.nowNode.judgeModuleList.splice(-1,0,newJudgeModuleList)
				} else {
					this.nowNode.judgeModuleList.push(newJudgeModuleList)
				}
			},
				catBackButton() {
	    		//返回按钮
	    		this.$emit('catBackButton')
	    },
		},
		created() {
			var that = this
		},
		mounted() {

		},
		directives: {
			dbClick: {
				inserted(el, binding) {
					el.addEventListener('click', e => {
						if(!el.disabled) {
							el.disabled = true;
							let timer = setTimeout(() => {
								el.disabled = false;
							}, 1000)
						}
					})
				}
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	/*----------*/
	/*添加判断*/

	.judgment {
		width: 351px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.judgment-top {
		height: 46px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.65);
		line-height: 46px;
		padding: 0 12px;
	}

	.judgment-center {
		height: 42px;
		line-height: 42px;
		background: rgba(250, 250, 250, 1);
		padding: 0 24px 0 12px;
		justify-content: space-between;
	}

	.add-content {
		height: 46px;
		font-size: 14px;
		color: rgba(24, 144, 255, 1);
		line-height: 22px;
		justify-content: flex-start;
		padding: 0 16px;
		cursor: pointer;
	}

	.add-content-icon {
		margin-right: 6px;
	}
	/*新增文字长度提示限制*/
	.txt-limit-div {
		/deep/ .ant-input {
			padding-right: 43px;
		}
	}

	.txt-limit {
		position: absolute;
		top: 2px;
		right: 5px;
		background: #fff;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
		opacity: 0.25;
	}
	/*添加分支*/
	.add-branch {
		margin-top: 25px;
	}
</style>
