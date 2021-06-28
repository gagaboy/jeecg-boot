<template>
		<!--判断主题-->
		<div class="draw-side-menu">
  			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="发送http请求动作"></menuCommonTop>
  			<div class="draw-side-menu-trigger">
  				<div class="draw-side-menu-trigger-title">动作主题</div>
  				<div class="txt-limit-div" style="position: relative;">
            <a-input  v-model="nowNode.nodeName" placeholder="请输入动作主题" :maxLength="25"></a-input>
            <span class="txt-limit" >{{nowNode.nodeName && nowNode.nodeName.length || 0}} / 25</span>
          </div>

  				<div class="draw-side-menu-trigger-title">请求地址</div>
					<a-select v-model="nowNode.httpRequestMethod" :transfer="true" @change="onChangeHttpStyle"  style="width:100%;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
							<a-select-option v-for="item in httpStyles" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
					</a-select>
					 <a-input v-model="nowNode.httpRequestUrl" placeholder="请输入以http(s)://开头的地址" style="width: 352px; margin-top: 8px;"  />

				<div class="draw-side-menu-trigger-title">请求头（Headers）</div>
  				<div class="judgment">
  					<div v-for="(item, ind) in nowNode.httpRequestHeads" :key="ind" style="border-radius: 4px 4px 0 0;">
	  					<div class="draw-flex-center judgment-center">
	  						请求头{{ind+1}}
								<a-icon type="delete" @click="removeList('httpRequestHeads', ind)" />
	  					</div>

	  					<div class="draw-borderbottom draw-flex-center" style="flex-direction: column;">
	  						 <a-input v-model="item.name" placeholder="键（key）" style="width: 320px; margin-top: 13px;"  />
	  						    	<!--新增带上引用和emoji输入的input输入框-->
			    				<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalValue' placeholder="值（value）" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  :showQuote="true" style="width: 320px; margin-top: 8px; margin-bottom: 13px;"></roInputAboutQuoteOne>
	  					</div>
  					</div>

  					<div @click="clickAll" data-type="addList" data-addname="httpRequestHeads" class="draw-flex-center add-content">
								<a-icon type="plus" />
				    	添加请求头
			    </div>
  				</div>

  				<div class="draw-side-menu-trigger-title">请求数据</div>
  					<!--当【请求方法】是get时，该下拉列表只显示form-data选项-->
	  				<a-select v-if="nowNode.httpRequestMethod == 'get'" v-model="nowNode.contentType" :transfer="true"  style="width:352px; margin-right: 13px; margin-bottom: 8px;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
							<a-select-option v-for="item in httpDataStyles" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
						</a-select>
						<a-select v-else v-model="nowNode.contentType" :transfer="true"  style="width:352px; margin-right: 13px; margin-bottom: 8px;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
							<a-select-option v-for="item in httpDataStyles1" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
						</a-select>

				<div v-if="nowNode.contentType == 'form-data'" class="judgment">
  					<div v-for="(item, ind) in nowNode.httpRequestFormData" :key="ind">
	  					<div class="draw-flex-center judgment-center">
	  						请求数据{{ind+1}}
								<a-icon type="delete" @click="removeList('httpRequestFormData', ind)" />
	  					</div>

	  					<div class="draw-borderbottom draw-flex-center" style="flex-direction: column;">
	  						 <a-input v-model="item.name" placeholder="键（key）" style="width: 320px; margin-top: 13px;"  />
	  						  <!--新增引用值-->
	  						  <roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalValue' placeholder="值（value）" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  :showQuote="true" style="width: 320px; margin-top: 8px; margin-bottom: 13px;"></roInputAboutQuoteOne>
	  					</div>
  					</div>

  					<div @click="clickAll" data-type="addList" data-addname="httpRequestFormData" class="draw-flex-center add-content">
							<a-icon type="plus" />
				    	添加请求数据
			    </div>
  				</div>

				<template v-else-if="nowNode.contentType == 'raw'" >
						<a-select v-model="nowNode.httpRequestContentType"  :transfer="true"  style="width:352px; margin-right: 13px; margin-bottom: 8px;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
							<a-select-option v-for="item in httpDatas" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
						</a-select>

	  				<!--<a-input v-model="nowNode.httpRequestData" type="textarea" placeholder="请输入内容" class="raw-text" :rows="4" />-->

	  				<!--0804新增请求数据引用值-->
	  				<roInputAboutQuoteOne :inputAboutQuoteOne="nowNode" quoteKey='originalHttpRequestData' placeholder="请输入内容" type="textarea" :rows="4" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  :showQuote="true" style="width: 340px; margin-top: 8px; margin-bottom: 13px;"></roInputAboutQuoteOne>
  				</template>

  				<div class="draw-side-menu-trigger-title">
  					填充消息转化模板
  				</div>
  				<div class="respond-prompts">
					选用消息转化模板，可以将http请求响应的数据根据模板的功能转化为RCS消息。发送动作和提问动作可以通过选择转化模板来发送转化后的消息。
  				</div>
				<!--10.10新增消息转换模板-->
				<a-select v-model="nowNode.msgTemplate.conversionTemplateId" @change="onChangeConversionTemplate" :allowClear="true" :transfer="true" :showSearch="true" optionFilterProp="children" placeholder="选择消息转化模板"  style="width:352px; margin-right: 13px; margin-bottom: 8px;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
		          <a-select-option v-for="item in messageConversionTemplates" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
		        </a-select>
				<!--上面的选择后才有这个按钮-->
				<div v-show="nowNode.msgTemplate.conversionTemplateId" class="draw-side-menu-trigger-title" style="margin-top: 0px;">
  					<a-checkbox v-model="nowNode.needMediaAudit" size="small" style="margin-right: 9px;">需要素材送审</a-checkbox>
  				</div>


  				<div class="draw-side-menu-trigger-title">
  					<a-switch  v-model="nowNode.needMonitor" @change="onChangeNeedMonitor" size="small" style="margin-right: 9px;"></a-switch>监听响应内容
  				</div>
  				<div class="respond-prompts">
					若响应内容中的JSON是多层的,请以"."为间隔符，<br />
					写出目标键从外层到内层的路径。<br />
					例如：{A:{A1:1,A2:2},B:3,C:4}，监听A1<br />则在输入框中填写A.A1
  				</div>
  				<!--打开才会展示下面的-->
  				<div v-if="nowNode.needMonitor" class="judgment" style="margin-top: 8px;">
  					<div v-for="(item, ind) in nowNode.monitorDataList" :key="ind">
	  					<div class="draw-flex-center judgment-center">
	  						响应内容{{ind+1}}
								<a-icon type="delete" @click="removeList('monitorDataList', ind)" />
	  					</div>
						<!--这里去处理数据-->
	  					<div class="draw-borderbottom draw-flex-center" style="flex-direction: column;">
	  						<!--<a-input v-model="item.monitorName"  placeholder="监听内容名称" style="width: 320px; margin-top: 13px;"  />-->

							<menuCommonSearchVariable :monitorItem="item" :variableSlotList="variableSlotList" :searchVariableIndex="ind" style="margin-top: 13px;" ></menuCommonSearchVariable>

	  						<a-input v-model.trim="item.monitorExpr" placeholder="请输入要监听的键(key)" style="width: 320px; margin-top: 8px; margin-bottom: 13px;"  />
	  					</div>
  					</div>

  					<div @click="clickAll" data-type="addList" data-addname="monitorDataList" class="draw-flex-center add-content">
							<a-icon type="plus" />
				    	添加监听内容
			    </div>
  				</div>

  				<!--0918新增引用http的请求返回-->
  				<!--<div class="draw-side-menu-trigger-title">
  					<a-switch  v-model="nowNode.needMediaResult" size="small" style="margin-right: 9px;"></a-switch>监听响应返回（用于单卡素材引用）
  				</div>-->

  				<div style="margin-top: 24px;">
						<a-button v-dbClick @click="clickAll" data-type="save" class="draw-remove-button" type="primary" style="margin-right: 16px;">保存</a-button>
						<a-button @click="clickAll" data-type="cancel" class="draw-remove-button" >取消</a-button>
  				</div>
  			</div>
  	</div>
</template>
<script>
	//需判断监听的值不能是那几个固定值
	import roInputAboutQuoteOne from '../roInputAboutQuoteOne/roInputAboutQuoteOne'  //新增带上引用和emoji输入的input输入框
	import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮
	import menuCommonSearchVariable from '../menuCommon/menuCommonSearchVariable' //10.09新增新增变量的

	import { removeEmoji, removeEmojiHttpsChinese } from '../assets/js/util.js'  //emoji表情

	export default {
		name: 'catDrawMenuSendhttp',
		components: {
			roInputAboutQuoteOne,
			menuCommonTop,
			menuCommonSearchVariable,
		},
		props: {
			nowNode: Object,
			nodeList: Array,
			otherNodeList: Array,

			showBackButton: Boolean,  //0721新增显示返回按钮
			messageConversionTemplates: Array, // 10.10新增转换模板列表

			variableSlotList: {
				type: Array,
				default: function() {
					return []
				},
			},
		},
		data: function() {
			return {
				httpStyles:  [
					{
						value: 'get',
						label: 'GET'
					},
					{
						value: 'post',
						label: 'POST'
					},
				],
//     当为get请求时只有
				httpDataStyles:  [
					{
						value: 'form-data',
						label: 'form-data'
					},
				],
	//				当为post请求时显示
				httpDataStyles1:  [
					{
						value: 'raw',
						label: 'raw'
					},
					{
						value: 'form-data',
						label: 'form-data'
					},
				],
				httpDatas:  [
					{
						value: 'text/plain',
						label: 'Text(text/plain)'
					},
					{
						value: 'application/json',
						label: 'JSON(application/json)'
					},
					{
						value: 'application/xml',
						label: 'XML(application/xml)'
					},
				],
				judgeProject:[1],
				switch1: true,
			}
		},
		watch:{
			//08.03新增设置nowNode.httpRequestContentType默认值
			 'nowNode.contentType'(newVal, oldVal) {
	        var nowNode = this.nowNode || {}
	        if(newVal == 'form-data') {
						nowNode.httpRequestContentType = 'form-data'  //需要设置成这个，后端取的这个值
					} else {
						//这里判断是上面就设置成默认值
						if(nowNode.httpRequestContentType == 'form-data') {
							nowNode.httpRequestContentType = 'text/plain'  //修改成第一个默认值
						}
					}
	    },
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
				var addname = dataset.addname
				var env = {}
				if(addname == 'monitorDataList') {
					env = {
							monitorId: undefined, //保存之后会进行更新
							monitorName: '',  //自定义名字
							monitorExpr: '',  //后面的值
					}
				} else {
					env = {
						name: '',
						value: '',
						originalValue: '', //原来存替换前的值
					}
				}
				this.nowNode[addname].push(env)
			},
			removeList(type, index) {
				var that = this
				var arr = this.nowNode[type]
				arr.splice(index, 1)
			},
	    	//判断是否非必填
			decide() {
				var result = true
				var nodeName = this.nowNode.nodeName
				//判断不能为空
	    		if(!nodeName) {
	    			this.$message.warning('动作主题不能为空')
	    			result = false
	    		}else if(!removeEmoji.test(nodeName)) {
					this.$message.warning('动作主题不能包含emoji')
					result = false
				}

	    		//新增单独去判断不能是固定值，否则无法去判断
	    		var exclusionValue = ['当前时间', '当前会话通道', '微信通道', 'MaaP通道']
	    		if(exclusionValue.indexOf(nodeName) > -1) {
	    			//说明找到了，不能是这几个值
	    			this.$message.warning('动作主题不能包含固定值')
					result = false
	    		}

	    		//判断不能为空
	    		if(!this.nowNode.httpRequestUrl) {
	    			this.$message.warning('请求地址不能为空')
	    			result = false
	    		}else if(!removeEmojiHttpsChinese.test(this.nowNode.httpRequestUrl)) {
					this.$message.warning('请求地址必须以https开头并去除emoji或中文')
					result = false
				}
	    		//说明添加了，需要判断是否存在--请求头
	    		if(this.nowNode.httpRequestHeads.length >= 1) {
	    			var httpRequestHeads = this.nowNode.httpRequestHeads
	    			for(let i = 0; i < httpRequestHeads.length; i++) {
	    				var item = httpRequestHeads[i]
	    				if(!item.name || !item.originalValue) {
	    					this.$message.warning('请求头添加后不可为空')
	    					result = false
	    					break
	    				}
	    			}
	    		}
	    		//请求数据
	    		if(this.nowNode.contentType == 'form-data') {
	    			//说明添加了，需要判断是否存在
		    		if(this.nowNode.httpRequestFormData.length >= 1) {
		    			var httpRequestFormData = this.nowNode.httpRequestFormData
		    			for(let j = 0; j < httpRequestFormData.length; j++) {
	    					var item = httpRequestFormData[j]
	    					if(!item.name || !item.originalValue) {
		    					this.$message.warning('请求数据添加后不可为空')
		    					result = false
		    					break
		    				}
	    				}
		    		}

		    		this.nowNode.httpRequestContentType = 'form-data'  //0804新增需要设置成这个，后端取的这个值
	    		} else {
	    			//说明添加了，需要判断是否存在
//		    		if(!this.nowNode.httpRequestData) {
					if(!this.nowNode.originalHttpRequestData) {
		    			this.$message.warning('请求数据不能为空')
		    			result = false
		    		}
//		    		//判断是否有“Content-Type”参数
//		    		this.judgehttpRequestHeads()
	    		}

	    		//判断是否有“Content-Type”参数
		    	this.judgehttpRequestHeads(this.nowNode.contentType)

	    		//打开了开关,需要去判断
	    		if(this.nowNode.needMonitor) {
	    			var monitorDataList = this.nowNode.monitorDataList
	    			//说明添加了，需要判断是否存在
		    		if(monitorDataList.length >= 1) {
		    			for(let k = 0; k < monitorDataList.length; k++) {
	    					var item = monitorDataList[k]
	    					if(!item.monitorName || !item.monitorExpr) {
		    					this.$message.warning('响应内容添加后不可为空')
		    					result = false

		    				}
	    				}
		    		} else {
		    			this.$message.warning('响应内容不能为空')
		    			result = false
		    		}
	    		}
	    		return result
			},
			////当选择了【请求数据类型】里的选项，查询请求头中是否有“Content-Type”参数，若没有则根据所选的【请求数据类型】在请求头中添加“Content-Type”参数，若已有“Content-Type”参数，则根据选择对其进行修改。
			judgehttpRequestHeads(contentType) {
				var httpRequestHeads = this.nowNode.httpRequestHeads
				var httpRequestContentType = this.nowNode.httpRequestContentType

				var find = false
				for(let i = 0; i < httpRequestHeads.length; i++) {
	    				var item = httpRequestHeads[i]
	    				if(item.name == 'Content-Type') {
							item.originalValue = httpRequestContentType
							find = true
							break
						}
	    		}
				if(!find && contentType == 'raw') {
					this.nowNode.httpRequestHeads.push({
							name: 'Content-Type',
								value: '',
								originalValue: httpRequestContentType, //原来存替换前的值
					})
				}
			},
	    	save() {
	    		//判断条件
	    		if(!this.decide()) {
	    			return
	    		}

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
			//新增设置get请求时，设置默认值httpDataStyle
			onChangeHttpStyle(val) {
				if(val == 'get') {
					this.nowNode.contentType = 'form-data'
				}
			},
			onChangeNeedMonitor(needMonitor) {
				//关闭了清空底部的监听内容
				if(!needMonitor) {
					this.nowNode.monitorDataList = []
				}
			},
				catBackButton() {
	    		//返回按钮
	    		this.$emit('catBackButton')
	    	},
	    	//新增转换模板设置
			onChangeConversionTemplate(value) {
				var messageConversionTemplates = this.messageConversionTemplates || []
				var res = {}
				messageConversionTemplates.forEach((item) => {
					res[item.id] = item
				})
				this.nowNode.msgTemplate.conversionTemplateMsgType = value && res[value] && res[value].msgType || '' //设置转换模板类型
			},
		},
		created() {
			var that = this
		},
		mounted() {
			//10.13新增监听新增变量值变化
			this.$root.eventBus.$on("menu_common_search_variable", (obj) => {
					var searchVariableIndex = obj.searchVariableIndex || 0
					var monitorDataListOne = this.nowNode.monitorDataList[searchVariableIndex]
					monitorDataListOne.monitorId = obj.variableId
					monitorDataListOne.monitorName = obj.variableName
			})
		},
		destroyed() {
			this.$root.eventBus.$off("menu_common_search_variable")
		},
		directives:{
        dbClick:{
            inserted(el, binding) {
			  el.addEventListener('click', e => {
				  if(!el.disabled) {
				   el.disabled = true;
				   let timer = setTimeout( () => {
				   	el.disabled = false;
				   },1000)
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

	.judgment-center {
		height: 42px;
		line-height: 42px;
		background: rgba(250, 250, 250, 1);
		padding: 0 24px 0 12px;
		justify-content: space-between;
		/*设置顶部的圆角*/
		border-radius: 4px 4px 0px 0px;
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

  /*新增H5样式*/
 .raw-text {
 	width:352px;
	border-radius:4px;
 }
 .respond-prompts {
	font-size:12px;
	color:rgba(0,0,0,0.45);
	line-height:17px;
 }
</style>
