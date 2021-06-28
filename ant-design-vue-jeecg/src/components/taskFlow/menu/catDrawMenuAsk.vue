<template>
  <div>
    <!--提问动作-->
    <div class="draw-side-menu">
      <menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="提问动作"></menuCommonTop>
      <div class="draw-side-menu-trigger">
        <div class="draw-side-menu-trigger-title">动作主题</div>
        <div class="txt-limit-div" style="position: relative;">
          <a-input v-model="nowNode.nodeName" placeholder="请输入动作主题" :maxLength="25"></a-input>
          <span class="txt-limit">{{nowNode.nodeName && nowNode.nodeName.length || 0}} / 25</span>
        </div>
        <div class="draw-side-menu-trigger-title">提问内容</div>
        <!--输入内容列表-->
        <catDrawList :eventList="nowNode" :nodeList="nodeList" :otherNodeList="otherNodeList" :pageParameters="pageParameters" :acceptUrl="acceptUrl" :messageConversionTemplates="messageConversionTemplates"></catDrawList>
        <!--新增添加快捷按钮-->
        <div class="draw-side-menu-trigger-title">快捷按钮</div>
        <div style="margin-top: 10px; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 4px; width: 350px;">
          <!--<catDrawListAddButton :buttons="nowNode.buttons" :listStyle="{width: '350px'}" buttonStyle="left" :buttonNums="buttonNums" addButtonType="fixedButton"></catDrawListAddButton>-->
          <!--10.13新增引用内容-->
					<catDrawListAddButton :buttons="nowNode.buttons" :listStyle="{width: '350px'}" buttonStyle="left" :buttonNums="buttonNums" addButtonType="fixedButton" :nodeList="nodeList" :otherNodeList="otherNodeList" :pageParameters="pageParameters" :nowNode="nowNode"></catDrawListAddButton>
        </div>
        <div class="draw-side-menu-trigger-title">验证回答内容</div>
        <a-select v-model="nowNode.askmodel" :transfer="true" @change="onChangeSelect" style="width:352px" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
          <a-select-option v-for="item in askmodels" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
        </a-select>
        <!--正则的时候，必填-->
        <template v-if="nowNode.askmodel == '正则表达式'">
          <div class="draw-side-menu-trigger-title">正则表达式</div>
          <a-input v-model="nowNode.answerRuleExpr" placeholder="请输入正则表达式" />
        </template>
        <!--验证的时候才显示非必填-->
        <template v-if="nowNode.askmodel != '不验证'">
          <div class="draw-side-menu-trigger-title">验证失败后回复</div>
          <!--新增带上引用和emoji输入的input输入框-->
          <roInputAboutQuoteOne :inputAboutQuoteOne="nowNode.askFailContent[0]" quoteKey='originalMessage' :maxLength="maxLength" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :maxlength="255" :showQuote="pageParameters.showQuote" type="textarea" placeholder="请输入验证失败后回复"></roInputAboutQuoteOne>
        </template>
        <div style="margin-top: 24px;">
          <a-button v-dbClick @click="clickAll" data-type="save" class="draw-remove-button" type="primary" style="margin-right: 16px;">保存</a-button>
          <a-button @click="clickAll" data-type="cancel" class="draw-remove-button">取消</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import catDrawList from '../catDrawList' //添加输入内容
import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮

import catDrawListAddButton from '../cardType/catDrawListAddButton' //添加快捷按钮

import roInputAboutQuoteOne from '../roInputAboutQuoteOne/roInputAboutQuoteOne' //新增带上引用和emoji输入的input输入框

import { CatDrawJudge } from '../catDrawJudge' //判断条件的处理

import { removeEmoji } from '../assets/js/util.js' //emoji表情

export default {
  name: 'catDrawMenuAsk',
  components: {
    catDrawList,
    catDrawListAddButton,

    roInputAboutQuoteOne,
    menuCommonTop,
  },
  props: {
    nowNode: {
      type: Object,
      default: function() {
        return {
          nnodeType: 'ask',

          nodeName: '', //必填，25个字
          onceReplyModeLabel: '随机发送一条',
          onceReplyMode: 1,
          inputContents: [],
          askmodel: '不验证',
          askFailContent: [{
            originalMessage: '',
          }], //非必填
          answerRuleExpr: '', //正则的时候必填
        }
      },
    },
    nodeList: Array,
    otherNodeList: Array,
    buttonNums: Number, //固定按钮个数

    //0528修改上传的地址
    acceptUrl: {
      type: Object,
      default: function() {
        return {
          uploadFiles: '/apps/Canvas/uploadMedia', //上传的地址
        }
      },
    },

    //0528修改上传的地址
    pageParameters: {
      type: Object,
      default: function() {
        return {
          showQuote: true, //新增是否显示引用的内容
        }
      },
    },

    showBackButton: Boolean, //0721新增显示返回按钮
    
    messageConversionTemplates: Array, // 10.10新增转换模板列表
  },
  data: function() {
    return {
      askmodels: [{
          value: '不验证',
          label: '不验证'
        },
        {
          value: '电话号码',
          label: '电话号码'
        },
        {
          value: '邮件地址',
          label: '邮件地址'
        },
        {
          value: '整数',
          label: '整数'
        },
        {
          value: '正则表达式',
          label: '正则表达式'
        },
        {
          value: '图片',
          label: '图片'
        },
        {
          value: '语音',
          label: '语音'
        },
        {
          value: '视频',
          label: '视频'
        },
        {
          value: '地理位置',
          label: '地理位置'
        },
      ],
      maxLength: 600,
    }
  },
  methods: {
    onChangeSelect(value) {
      if (value == '不验证') {
        this.nowNode.askFailContent.splice(0, 1, {
          originalMessage: ''
        })
      }
      if (value != '正则表达式') {
        this.nowNode.answerRuleExpr = ''
      }
    },
    clickAll(e) {
      var dataset = e.currentTarget.dataset
      var clickType = dataset.type
      if (typeof this[clickType] == 'function') {
        this[clickType]()
        return
      }
    },
    setAskmodelName() {
      var askmodels = this.askmodels
      var askmodel = this.nowNode.askmodel
      askmodels.forEach((item) => {
        if (item.value == askmodel) {
          this.nowNode.askmodelName = item.label
        }
      })
    },
    decideInput(nodeName) {
      var result = true
      if ((!this.nowNode.inputContents) || (this.nowNode.inputContents.length < 1)) {
        //提问内容不能为空
        this.$message.warning('提问内容不能为空')
        return false
      }
      //0402新增判断回复内容不能为空
      if (!this.catDrawJudge.judgeEmpty(this.nowNode.inputContents, 'ask', this.pageParameters)) {
        return false
      }
      //0402新增判断buttons不能为空
      if (!this.catDrawJudge.judgeEmptyButtons(this.nowNode.buttons)) {
        return false
      }
      return result
    },
    //判断是否非必填
    decide() {
      //判断不能为空
      if (!this.nowNode.nodeName) {
        this.$message.warning('动作主题不能为空')
        return false
      } else if (!removeEmoji.test(this.nowNode.nodeName)) {
        this.$message.warning('动作主题不能包含emoji')
        return false
      }

      if (!this.decideInput('inputContents')) {
        return false
      }

      if (this.nowNode.askmodel == '正则表达式') {
        if (!this.nowNode.answerRuleExpr) {
          this.$message.warning('正则表达式不能为空')
          return false
        } else if (!removeEmoji.test(this.nowNode.answerRuleExpr)) {
          this.$message.warning('正则表达式不能包含emoji')
          return false
        }
      }

      //判断不能为emoji
      if (this.nowNode.askmodel != '不验证') {
        if (!removeEmoji.test(this.nowNode.askFailContent[0].originalMessage)) {
          this.$message.warning('验证失败后回复不能包含emoji')
          return false
        }
      }

      //判断名字不能重复
      return true
    },
    save() {
      //判断条件
      if (!this.decide()) {
        return
      }

      var nowNode = this.nowNode
      this.setAskmodelName()
      this.$emit('save', {
        eventObj: this.nowNode,
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    drawQuote(data) {
      this.selectionStart(data.currentIndex, data.nodeName) //添加到原来的input里面去
    },
    selectionStart(index, quote) {
      var emojiInput = 'emojiInput' + index //获取的id
      //				var elInput = document.getElementById(emojiInput).getElementsByClassName('ant-input')[0]; //根据id选择器选中对象
      var elInput = document.getElementById(emojiInput) //根据id选择器选中对象
      var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value;
      //		      // 将表情添加到选中的光标位置
      var result = txt.substring(0, startPos) + quote + txt.substring(endPos)

      //				限制长度
      result = result.slice(0, this.maxLength)

      elInput.value = result; // 赋值给input的value
      // 重新定义光标位置
      elInput.focus();
      elInput.selectionStart = startPos + quote.length;
      elInput.selectionEnd = startPos + quote.length;

      this.nowNode.askFailContent[index].originalMessage = result // 赋值给表单中的的字段
    },
    catBackButton() {
      //返回按钮
      this.$emit('catBackButton')
    },
  },
  created() {
    var that = this
    this.catDrawJudge = new CatDrawJudge(this)
  },
  mounted() {

  },
  directives: {
    dbClick: {
      inserted(el, binding) {
        el.addEventListener('click', e => {
          if (!el.disabled) {
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
</style>
