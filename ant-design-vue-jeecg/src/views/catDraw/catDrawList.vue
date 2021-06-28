<template>
  <div :style="listStyle">
    <div class="default-onceReplyModeLabel">
      <div v-if="!hiddenModeLabel" class="flex-center onceReplyModeLabel-radio">
        <!-- <m-radio :value="eventList.onceReplyMode" :options="replysList" @on-change="setOnceReplyMode"></m-radio> -->
        <a-radio-group v-model="eventList.onceReplyModeLabel" @change="setOnceReplyMode">
          <a-radio v-for="item in replysList" :key="item.id" :value="item.value" :disabled="item.disabled">
            <span>{{ item.label }}</span>
          </a-radio>
        </a-radio-group>
      </div>

      <!--新增顶部的添加按钮-->
      <catDrawListAddMenu
        v-if="selectOnlyOne"
        :chooseMenus="chooseMenus"
        @addMenu="addMenu"
        :selectOnlyOne="selectOnlyOne"
        :selectOnlyOneObj="eventList.inputContents && eventList.inputContents[0]"
      ></catDrawListAddMenu>

      <div v-for="(item, index) in eventList.inputContents" :key="index" class="instance">
        <!--新增修改-->
        <catDrawListTop :item="item">
          <template slot="quote">
            <!-- 插入文字变量 -->
            <div
              class="var"
              v-if="item.replyType == 'text' && propsName !== 'fallCatDraw'"
              @click="addVar(index + name)"
            >
              <img class="var-img" src="./asset/img/var.png" />
            </div>
            <!--新增emoji输入-->
            <roEmoji
              v-if="item.replyType == 'text'"
              @addCatEmoji="addCatEmoji"
              :currentIndex="index + name"
              :nodeList="nodeList"
              :otherNodeList="otherNodeList"
              :nowNode="eventList"
              style="margin-right: 15px"
            ></roEmoji>
            <!--默认回复中去掉引用内容-->
            <catDrawPoptip
              v-if="item.replyType == 'text' && pageParameters.showQuote"
              @drawQuote="drawQuote"
              :currentIndex="index + name"
              :nodeList="nodeList"
              :otherNodeList="otherNodeList"
              :nowNode="eventList"
              style="margin-right: 15px"
            ></catDrawPoptip>
            <a-icon
              v-if="!selectOnlyOne"
              type="delete"
              class="cursor-pointer"
              @click="removeList(index)"
              style="font-size: 16px"
            />
            <!-- <i v-if="!selectOnlyOne" class="el-icon-delete cursor-pointer" @click="removeList(index)" style="font-size:16px;"></i> -->
          </template>
        </catDrawListTop>

        <div v-if="item.replyType == 'text'" class="instance-input">
          <input type="hidden" :value="filteVar(item.originalMessage, index)" />
          <!--这里不使用自带的限制长度-->
          <!-- <Input v-model="item.originalMessage" @on-change="onChangeInput($event, index)" :id="'emojiInputList' + index" class="instance-top-input" show-word-limit type="textarea" placeholder="请输入" /> -->
          <a-textarea
            v-model="item.originalMessage"
            @change="onChangeInput(...arguments, index)"
            :id="'emojiInputList' + index + name"
            class="instance-top-input"
            placeholder="请输入文字"
          ></a-textarea>
        </div>

        <!--图片，音频和视频上传-->
        <catDrawListMedia
          :propsName="propsName"
          :item="item"
          v-if="
            item.replyType == 'image' ||
            item.replyType == 'audio' ||
            item.replyType == 'video' ||
            item.replyType == 'file'
          "
          :acceptUrl="acceptUrl"
          :pageParameters="pageParameters"
        ></catDrawListMedia>
        <!--新增单卡-->
        <cat-draw-list-simple-card
          :propsName="propsName"
          :reply="item.reply"
          :listStyle="listStyle"
          v-if="item.replyType == 'singleCard'"
          :currentIndex="index"
          :nodeList="nodeList"
          :otherNodeList="otherNodeList"
          :nowNode="eventList"
          :pageParameters="pageParameters"
          :acceptUrl="acceptUrl"
        ></cat-draw-list-simple-card>
        <!--新增多卡-->
        <cat-draw-list-multiple-card
          :propsName="propsName"
          :reply="item.reply"
          v-if="item.replyType == 'manyCards'"
          :currentIndex="index"
          :nodeList="nodeList"
          :otherNodeList="otherNodeList"
          :nowNode="eventList"
          :pageParameters="pageParameters"
          :acceptUrl="acceptUrl"
        ></cat-draw-list-multiple-card>
      </div>
      <!--新增底部添加按钮-->
      <catDrawListAddMenu
        v-if="!hiddenAddMenuBottom"
        @addMenu="addMenu"
        :showMaxMenus="showMaxMenus"
      ></catDrawListAddMenu>
    </div>
    <catChoose
      ref="catChooseMedia"
      :propsName="propsName"
      :visible.sync="showCatChoose"
      :id="catChooseId"
      :materialList="materialList"
    ></catChoose>
    <input
      type="hidden"
      v-validate="name"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      :name="name"
      v-model="formValue"
    />
    <span v-if="customValidateFlag">
      <span v-if="errors.has(name)" class="m-form-error-tip">
        {{ customValidateMsg }}
      </span>
    </span>
    <span v-if="!customValidateFlag">
      <span v-if="errors.has(name)" class="m-form-error-tip">
        {{ validateMsg ? validateMsg : errors.first(name) }}
      </span>
    </span>
  </div>
</template>
<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import catDrawPoptip from './catDrawPoptip'
import catDrawListTop from './catRobotNew/cardType/catDrawListTop' //顶部菜单
import catDrawListMedia from './catRobotNew/cardType/catDrawListMedia' //图片，音频和视频
import catDrawListSimpleCard from './catRobotNew/cardType/catDrawListSimpleCard' //单卡
import catDrawListMultipleCard from './catRobotNew/cardType/catDrawListMultipleCard' //多卡
import catDrawListAddMenu from './catRobotNew/cardType/catDrawListAddMenu' //底部菜单

// import catDrawListAddMenuTop from './catRobotNew/cardType/catDrawListAddMenuTop'  //0527新增顶部组件

import roEmoji from './roEmoji/roEmoji' //emoji输入框

import catDrawListData from './catRobotNew/cardType/catDrawListData' //添加节点对象

import { emojiCharStringLen, emojiCharStringSubstr, getUUID } from './util' //新增处理emoji表情等
import catChoose from './catChoose/catChoose' //素材的弹窗
import { AboutMaterial } from './catChoose/aboutMaterial.js' //选择素材的弹窗
import { CatDrawJudge } from './catDrawJudge' //判断条件的处理
import { AbuotQuote } from './abuotQuote' //引用的内容替和id的转换

import { getMaterialsByType } from '@/api/api'
const config = {
  fieldsBagName: 'vee-fields',
}
Vue.use(VeeValidate, config)
//初始化数据
class Reply {
  constructor() {
    this.replyType = 'text'
    this.originalMessage = ''
  }
}

export default {
  name: 'catDrawList',
  props: {
    chatbotId: String,
    //0528修改上传的地址
    // 素材上传接口
    acceptUrl: {
      type: Object,
      default: function () {
        return {
          uploadFiles: '/apps/Canvas/uploadMedia', //上传的地址
        }
      },
    },
    listStyle: {
      width: '350px',
    },
    //  随机和发送所有
    eventArray: {
      type: Object,
      default: function () {
        return {
          onceReplyModeLabel: '随机发送一条',
          onceReplyMode: 1,
          // 所有数据，传递给后端
          inputContents: [
            {
              replyType: 'text',
              originalMessage: '',
            },
          ],
        }
      },
    },
    // 群发用
    nodeList: {
      type: Array,
      default: () => [],
    }, //新增nodeList

    otherNodeList: Array,

    //页面传递过去的参数
    // 待定
    pageParameters: {
      type: Object,
      default: function () {
        return {}
      },
    },
    //0515新增_是否隐藏顶部的发送默认方式
    // 隐藏群发和随机
    hiddenModeLabel: {
      type: Boolean,
      default: false, //默认值是false
    },
    // 总共条数
    drawListMaxNumber: {
      type: Number,
      default: 10, //上限一般是10个
    },
    // 群发按钮 隐藏
    //0527新增_是否隐藏顶部的新增按钮
    hiddenAddMenuBottom: {
      type: Boolean,
      default: false, //默认值是false
    },
    // 条数只能为1
    //0527新增是否值选择一个，默认是可以选择多个的
    selectOnlyOne: {
      type: Boolean,
      default: false, //默认值是false
    },
    fieldTitle: {
      type: String,
      default: '',
    },
    validate: {
      type: [String, Object],
      default: 'checkMsgEditor',
    },
    chooseMenus: {
      type: Array,
      default: () => ['text', 'image', 'audio', 'video', 'file', 'singleCard', 'manyCards'], //是否显示上限按钮
    },
    customValidateFlag: {
      type: Boolean,
      default: false,
    },
    customValidateMsg: {
      type: String,
      default: '发送内容 字段为必填项.',
    },
    propsName: {
      type: String,
      default: 'replyCollection',
    },
  },
  components: {
    catDrawPoptip,
    roEmoji,

    catDrawListTop,
    catDrawListMedia,
    catDrawListSimpleCard,
    catDrawListMultipleCard,
    catDrawListAddMenu,
    catChoose,
    // catDrawListAddMenuTop,
  },
  data: function () {
    return {
      // replys: {
      // 	1: '随机发送一条',
      // 	2: '发送所有',
      // },
      botId: this.chatbotId,
      eventList: this.eventArray,
      replysList: [
        { value: 1, label: '随机发送一条' },
        { value: 2, label: '发送所有' },
      ],
      maxlength: 2000,

      showMaxMenus: false, //不显示上限
      catChooseId: getUUID(),
      materialList: {
        imageList: [],
        audioList: [],
        videoList: [],
      },
      showCatChoose: false,
      catChooseShow: {
        showimage: true, //显示图片
        showaudio: true, //显示音频
        showVideo: true, //显示视频
        showFile: true, //显示文件
      },
      validateMsg: '发送内容 字段为必填项.',
    }
  },
  computed: {
    filteVar() {
      return (value, index) => {
        if (this.propsName !== 'fallCatDraw') return
        this.eventList.inputContents[index].originalMessage = this.eventList.inputContents[
          index
        ].originalMessage.replace(/\{(text\d+)\}/gi, '')
      }
    },
    formValue() {
      // if(!this.catDrawJudge.judgeEmpty(this.eventList.inputContents)) return ''
      return this.eventList.inputContents.length > 0
        ? JSON.stringify(this.abuotQuote.replaceStringIntoIdArr([], this.eventList.inputContents, false))
        : ''
    },
    name() {
      return this.propsName
    },
    //改变备注的长度，长度大于14位就用...代替剩余内容
    calculateStringActualLength() {
      //text就是所传参数
      return function (text) {
        var len = 0
        if (text) {
          len = emojiCharStringLen(text)
        }
        return len
      }
    },
  },
  watch: {
    //监听可添加的最多10个
    eventList: {
      handler(newName, oldName) {
        var maxNumber = this.drawListMaxNumber
        if (newName && newName.inputContents) {
          var inputContents = newName.inputContents || []
          var len = inputContents.length
          if (len >= maxNumber) {
            this.showMaxMenus = true //显示上限按钮
          } else {
            this.showMaxMenus = false //显示上限按钮
          }
        }
        // this.addEventbus()
      },
      // immediate: true,
      deep: true,
    },
    chatbotId: {
      handler(val) {
        this.botId = val
        this.aboutMaterial = new AboutMaterial(this)
        if (val) this.getAllMaterial().then(() => {})
      },
      // immediate: true,
      deep: true,
    },
  },
  methods: {
    // setOnceReplyMode(lable) {
    // 	var replys = this.replys
    // 	for(var key in replys) {
    // 		if(replys[key] == lable) {
    // 			this.eventList.onceReplyMode = Number(key)
    // 		}
    // 	}
    // },
    setOnceReplyMode(e) {
      let value = e.target.value
      var replysList = this.replysList
      for (let i = 0; i < replysList.length; i++) {
        if (replysList[i].value == value) {
          this.eventList.onceReplyMode = Number(replysList[i].value)
        }
      }
    },
    clickAll(e) {
      var that = this
      var dataset = e.currentTarget.dataset
      var clickType = dataset.type
      if (typeof this[clickType] == 'function') {
        this[clickType]()
        return
      }
    },
    addList() {
      var that = this
      this.eventList.inputContents.push(new Reply())
    },
    removeList(index) {
      var that = this
      this.eventList.inputContents.splice(index, 1)
    },
    drawQuote(data) {
      this.selectionStart(data.currentIndex, data.nodeName) //添加到原来的input里面去
    },
    selectionStart(index, quote) {
      var emojiInput = 'emojiInputList' + index //获取的id
      var elInput = document.getElementById(emojiInput) //根据id选择器选中对象
      var startPos = elInput.selectionStart // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value
      //		      // 将表情添加到选中的光标位置
      var result = txt.substring(0, startPos) + quote + txt.substring(endPos)

      //				限制长度
      //				result = result.slice(0, this.maxlength)
      result = emojiCharStringSubstr(result, 0, this.maxlength) //截取实际的长度

      elInput.value = result // 赋值给input的value
      // 重新定义光标位置
      elInput.focus()
      elInput.selectionStart = startPos + quote.length
      elInput.selectionEnd = startPos + quote.length
      this.eventList.inputContents[parseInt(index)].originalMessage = result // 赋值给表单中的的字段

      //新增需要手动触发onChange事件
      var event = new InputEvent('input')
      elInput.dispatchEvent(event)
    },
    //添加菜单
    addMenu(obj) {
      var that = this
      var type = obj.addMenuType
      if (this.selectOnlyOne) {
        this.eventList.inputContents.splice(0, 1, new catDrawListData[type]())
      } else {
        //添加到数组里去
        this.eventList.inputContents.push(new catDrawListData[type]())
      }
    },
    //新增监听input改变值
    onChangeInput(e, index) {
      var value = e.target.value
      var result = emojiCharStringSubstr(value, 0, this.maxlength) //截取实际的长度

      //延时去设置,否则不能设置成功
      // setTimeout(() => {
      this.eventList.inputContents[index].originalMessage = result
      // 赋值给表单中的的字段
      // }, 20)
    },
    //新增添加emoji表情
    addCatEmoji(data) {
      this.selectionStart(data.currentIndex, data.emoji) //添加到原来的input里面去
    },
    //新增添加文字变量
    addVar(indexName) {
      let addText
      addText = window.__VAR__.text.addText()
      if (addText) this.selectionStart(indexName, '{' + addText + '}')
    },

    // 获取所有的素材列表
    getAllMaterial() {
      var botId = this.botId
      var p1 = this.aboutMaterial.getMaterials('image', botId)
      var p2 = this.aboutMaterial.getMaterials('video', botId)
      var p3 = this.aboutMaterial.getMaterials('audio', botId)
      var p4 = this.aboutMaterial.getMaterials('file', botId)
      return new Promise((resolve, reject) => {
        Promise.all([p1, p2, p3, p4])
          .then((result) => {
            resolve()
          })
          .catch((error) => {})
      })
    },
    // 添加eventbus监听
    addEventbus() {
      this.$root.eventBus.$on('modal_material_modal' + this.name, (obj) => {
        if (!this.botId) {
          this.$notification.info({
            message: '注意',
            description: '请先选择5G账号消息',
          })
          // this.handleNotice('请先选择机器人','info')
          // this.$Message.info('请先选择机器人');
          return
        }
        var mediaReply = obj.mediaReply
        this.showCatChoose = true
        this.$refs.catChooseMedia &&
          this.$refs.catChooseMedia.setChooseStyle({
            mediaReply,
            catChooseShow: obj.catChooseShow || this.catChooseShow,
            modalId: obj.modalId,
          })
      })
    },
  },
  created() {
    this.aboutMaterial = new AboutMaterial(this)
    this.abuotQuote = new AbuotQuote(this)
    if (this.botId) this.getAllMaterial().then(() => {})
    this.catDrawJudge = new CatDrawJudge(this)
    this.catDrawJudge.warning = (content) => {
      this.validateMsg = content
    }
    this.$validator.extend(this.name, {
      validate: (value) => {
        return this.catDrawJudge.judgeEmpty(this.eventList.inputContents)
      },
    })
  },
  mounted() {
    // this.$root.eventBus.$on(this.dependsOn+'_value_change', res => {
    // 	this.$nextTick(function(){
    // 		this.botId = res[this.dependsOn]
    // 	})
    // })
    this.addEventbus()
  },
  destroyed() {
    document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
    this.$root.eventBus.$off('modal_material_modal' + this.name)
  },
}
</script>
<style lang='less' scoped>
@import './asset/css/default.css';
@default: #8c8c8c;
@defaultBorder: #ebeef5;
/*新增*/

.form-tab-width {
  width: 150px;
  text-align: right;
  font-size: 14px;
  color: @default;
}

.form-tab-width-summary {
  font-size: 14px;
  color: @default;
}

.remove-button {
  width: 90px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  /*border: 1px solid rgba(217, 217, 217, 1);*/
  font-size: 14px;
  padding: 0;
  margin: 0;
  margin-right: 24px;
}

.information {
  font-size: 12px;
  color: @default;
  margin-left: 12px;
  margin-top: 12px;
}

.summary {
  flex-direction: column;
}

.summary-title {
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
}

.summary-value {
  display: inline-block;
  width: 288px;
  font-size: 14px;
}

.chat-top {
  font-size: 14px;
  margin-top: 16px;
  margin-right: 24px;
  color: rgba(24, 144, 255, 1);
}
/*成功后的提示*/

.success {
  flex-direction: column;
  justify-content: flex-start;
}

.success-txt {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
}

.success-txt1 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
}

.success-button {
  width: 116px;
  height: 36px;
  background: rgba(24, 144, 255, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
/*新增编辑页面*/

.info-chatbot {
  display: flex;
}

.info-chatbot-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.chatbot-info-manage {
  /*width: 482px;*/
}
/*--------------*/

.chatbot-info-txt {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 17px;
  margin-top: 5px;
}

.default-onceReplyModeLabel {
  /*width: 480px;*/
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
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

.onceReplyModeLabel-radio {
  padding-left: 12px;
  height: 46px;
  border-bottom: 1px solid @defaultBorder;
  justify-content: flex-start;
}

.instance {
  border-bottom: 1px solid @defaultBorder;
}

.instance-input {
  /deep/ .ant-input {
    border: none !important;
    height: 112px !important;
    padding: 12px 16px !important;
    /*设置不可拉伸*/
    resize: none;
  }
  /deep/ .ant-input:focus {
    box-shadow: none;
  }
}

.instance-top {
  height: 36px;
  line-height: 36px;
  justify-content: space-between;
  background: #fafafa;
  padding: 0 16px;
}

.instance-top-link {
  margin-right: 15px;
  transform: rotate(-45deg);
}

.instance-linkbox {
  font-size: 12px;
  line-height: 22px;
}

.instance-linkbox-title {
  color: rgba(174, 173, 177, 1);
  margin-top: 4px;
  display: inline-block;
}

.instance-linkbox-input {
  margin-bottom: 8px;
}
// 文字变量
.var {
  display: inline-block;
  padding-right: 16px;
  .var-img {
    width: 24px;
    height: 24px;
  }
}
.var:hover {
  cursor: pointer;
}
</style>
