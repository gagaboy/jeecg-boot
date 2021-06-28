<template>
  <div>
    <div class="msgTemplate">
      <a-form 
        :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="5G消息账号">
          <a-select
            placeholder="请选择5G消息"
            v-decorator="['chatbotId',{ rules: [{ required: true, message: '请选5G消息账户' }],initialValue: formData.chatbotId }]">
            <a-select-option
              v-for="item in botList"
              :key="item.botId"
              :value="item.botId"
              @click="chatbotIdChange(item)"
            >{{item.bootName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="消息名称">
          <a-input
            @change="topicChange"
            v-decorator="['topic',{ rules: [{ required: true, message: '请输入消息名称' },{ max: 20, message: '消息名称小于等于20个字符' }], initialValue: formData.topic }]"
            placeholder="请输入消息名称"
          />
        </a-form-item>
        <a-form-item>
          <span slot="label" class="required">发送内容</span>
          <catDrawList
            ref="catDraw"
            :chatbotId="formData.chatbotId"
            :hiddenModeLabel="true"
            :hiddenAddMenuBottom="true"
            :selectOnlyOne="true"
            :eventArray="eventArray"
            :drawListMaxNumber="1"
            :listStyle="{}">
          </catDrawList>
        </a-form-item>
        <a-form-item label="固定快捷按钮">
          <addShortcutButton ref="buttons" :data="buttonsList"/>
        </a-form-item>
        <a-form-item label="回落设置" v-if="baseFlag && formData.supplierCode=='1'">
          <a-switch v-model="fallBackFlag" @change="fallFlagChange"/>
          <span class="desc-text">若增强5G消息发送失败后，需回落P2P发送，请打开设置回落内容</span>
          <a-tooltip title="回落暂不支持动参插入">
            <a-icon type="info-circle" theme="filled" style="color: #DBDBDB;padding-left:6px;"/>
          </a-tooltip>
        </a-form-item>
        <a-form-item v-if="baseFlag && formData.supplierCode=='1' && fallBackFlag">
          <span slot="label" class="required">发送内容</span>
          <catDrawList
            ref="fallCatDraw"
            propsName="fallCatDraw"
            :chatbotId="formData.chatbotId"
            :hiddenModeLabel="true"
            :hiddenAddMenuBottom="true"
            :selectOnlyOne="true"
            :eventArray="fallEventArray"
            :drawListMaxNumber="1"
            :chooseMenus="['text', 'image', 'audio', 'video']"
            :listStyle="{}">
          </catDrawList>
        </a-form-item>
        <a-form-item label="转短设置" v-if="baseFlag">
          <a-switch v-model="convertSmsFlag" />
          <span class="desc-text">若增强5G消息发送失败后，需转短信消息，请打开设置短信内容</span>
          <a-tooltip title="运营商暂不支持转短发送；转短暂不支持动参插入">
            <a-icon type="info-circle" theme="filled" style="color: #DBDBDB;padding-left:6px;"/>
          </a-tooltip>
          <div class="changeMsg" v-if="convertSmsFlag">
            <div class="msgNum">
              短信计费：{{convertSmsNum}}条
            </div>
            <div class="type">
              <img class="type-img" :src="require('@/assets/img/text1.png')" />
              文字
            </div>
            <div class="msg-input">
              <a-textarea 
                v-decorator="['convertSmsContent',{ rules: [{ validator: validatePass }], initialValue: convertSmsContent }]"
                @change="convertSmsChange"  
                placeholder="请输入文字，若为营销信息，请务必添加回复TD退订"></a-textarea >
            </div>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-button style="margin-right: 12px;" @click="cancel"> 取消</a-button>
          <a-button type="primary" style="margin-right: 12px;" @click="showPreview"> 预览</a-button>
          <a-button type="primary" @click="saveMsg" :loading="saveLoading"> 保存</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-modal
      dialogClass="previewDialog"
      :closable="false"
      v-model="previewVisible"
      :destroyOnClose="true"
      :footer="null">
      <msgPreview :isDialog="true" :visible.sync="previewVisible" align-center messageType="enhanced" :data="previewData"/>
    </a-modal>
  </div>
</template>

<script>
import { saveOrUpdateE5GMsg } from '@/api/api'
import catDrawList from '../../catDraw/catDrawList'
import addShortcutButton from '../addShortcutButton'
import msgPreview from '../../msgPreview'
import { cloneObject } from '@/utils/util'
export default {
  components: {
    catDrawList,
    addShortcutButton,
    msgPreview
  },
  props: {
    botList: {
      type: Array,
      default: []
    },
    data: Object
  },
  watch: {
    data:{
      handler() {
        this.dataChange()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'msgTemplate' }),
      formData: {
        chatbotId: undefined,
        topic: '',
        supplierCode: '',
      },
      eventArray: {'inputContents':[{'replyType':'text','originalMessage':''}]},
      fallEventArray: {'inputContents':[{'replyType':'text','originalMessage':''}]},
      buttonsList: [],
      baseFlag: false,
      fallBackFlag: false,
      fallBackContent: "",
      convertSmsFlag: false,
      convertSmsContent: "",
      convertSmsNum: 0,
      previewVisible: false,
      previewData: undefined,
      saveLoading: false,

    }
  },
  mounted(){
    let text = window.__VAR__.text
    text.update = this.updateVarText
    text.addText = () => {
      let addText
      text.update()
      text.arr.find((val, i)=>{
        if(val.times === 0) {
          addText = val.text
          return true
        }
        return false
      })
      return addText
    }
    text.check = () => {
      let errText
      text.update()
      text.arr.find((val, i)=>{
        if(val.times > 1) {
          errText = val.text
          return true
        }
        return false
      })
      return errText
    }

    let url = window.__VAR__.url
    url.update = this.updateVarUrl
    url.addUrl = () => {
      let addUrl
      url.update()
      url.arr.find((val, i)=>{
        if(val.times === 0) {
          addUrl = val.text
          return true
        }
        return false
      })
      return addUrl
    }
    url.check = () => {
      let errUrl
      url.update()
      url.arr.find((val, i)=>{
        if(val.times > 1) {
          errUrl = val.text
          return true
        }
        return false
      })
      return errUrl
    }
  },
  methods: {
    dataChange() {
      if(this.data) {
        let obj = JSON.parse(this.data.massMessage)
        this.eventArray = { inputContents: obj.replyCollection }
        this.formData.chatbotId = this.data.botId
        this.baseFlag = true
        this.formData.topic = this.data.topic
        this.formData.supplierCode = this.data.supplierCode
        this.buttonsList = obj.buttons
        this.fallBackFlag = this.data.fallBackFlag === 1 ? true : false
        if(this.data.fallBackContent) {
          this.fallEventArray = { inputContents: JSON.parse(this.data.fallBackContent) }
        }
        this.convertSmsFlag = this.data.convertSmsFlag === 1 ? true : false
        this.convertSmsContent = this.data.convertSmsContent ? this.data.convertSmsContent : ''
        if(this.convertSmsContent.length === 0) {
          this.convertSmsNum = 0
        }else if(this.convertSmsContent.length <= 70) {
          this.convertSmsNum = 1
        }else if(this.convertSmsContent.length > 70) {
          this.convertSmsNum = 1 + Math.ceil((this.convertSmsContent.length-70)/67)
        }
      } else {
        this.baseFlag = false
        // 当新建消息，且5g消息只有一项时则默认选中
        if(this.botList.length === 1) {
          this.formData.chatbotId = this.botList[0].botId
          this.baseFlag = true
          this.formData.supplierCode = this.botList[0].supplierCode
        }
        this.buttonsList = []
        this.eventArray = {'inputContents':[{'replyType':'text','originalMessage':''}]}
        this.fallEventArray = {'inputContents':[{'replyType':'text','originalMessage':''}]}
        this.convertSmsContent = ""
      }
    },
    validatePass(rule, value, callback){
      let val = value.trim()
      if(val.length === 0) {
        this.convertSmsNum = 0
        callback(new Error('请输入短信发送内容'))
        return
      }
      if(val.length > 500) {
        this.convertSmsNum = 1 + Math.ceil((val.length-70)/67)
        callback(new Error('短信内容小于等于500个字符'))
        return
      }
      if(val.length <= 70) {
        this.convertSmsNum = 1
      }
      if(val.length > 70) {
        this.convertSmsNum = 1 + Math.ceil((val.length-70)/67)
      }
      callback()
    },
    chatbotIdChange(val) {
      this.baseFlag = true
      this.formData.chatbotId = val.botId
      this.formData.supplierCode = val.supplierCode
    },
    topicChange(e) {
      this.formData.topic = e.target.value
    },
    convertSmsChange(e) {
      this.convertSmsContent = e.target.value
    },
    fallFlagChange(flag) {
      let replyType =this.eventArray.inputContents[0].replyType
      if(flag && replyType !== 'singleCard' && replyType !== 'manyCards' && replyType !== 'file') {
        this.fallEventArray = JSON.parse(JSON.stringify(this.eventArray))
      } else {
        this.fallEventArray = {'inputContents':[{'replyType':'text','originalMessage':''}]}
      }
    },
    showPreview() {
      this.previewData = Object.assign({},this.data,{
        massMessage: {
          replyCollection: this.$refs.catDraw.formValue,
          buttons: this.$refs.buttons.items
        }
      })
      this.previewVisible = true
    },
    async saveMsg() {
      let check = true
      // 校验前两项
      this.form.validateFields((err, values) => {
        if (err) {
          check = false
        }
      })
      // 校验发送内容
      await this.$refs.catDraw.$validator.validate()
      if(this.$refs.catDraw.errors.items.length>0) {
        check = false
      }
      // 如果回落打开，则进行回落校验
      if(this.fallBackFlag && this.baseFlag && this.formData.supplierCode=='1') {
        await this.$refs.fallCatDraw.$validator.validate()
        if(this.$refs.fallCatDraw.errors.items.length>0) {
          check = false
        }
      }
      if(!check) return
      // 如果按钮存在，校验快捷按钮
      if(this.$refs.buttons.items.length>0) {
        check = this.$refs.buttons.checkValidate()
        if(!check) return
      }
      let errText = window.__VAR__.text.check()
      if(errText) {
        this.$notification.warning({
          message: '警告',
          description: `变量{${errText}}重复，请保证变量唯一性！`
        })
        return
      }
      let errUrl = window.__VAR__.url.check()
      if(errUrl) {
        this.$notification.warning({
          message: '警告',
          description: `变量{${errUrl}}重复，请保证变量唯一性！`
        })
        return
      }
      let formData = new FormData()
      formData.append('id', this.data?this.data.id:undefined)
      formData.append('chatbotId', this.formData.chatbotId)
      formData.append('topic',this.formData.topic)
      formData.append('replyCollection',this.$refs.catDraw.formValue)
      formData.append('buttons',JSON.stringify(this.$refs.buttons.items))
      formData.append('fallBackFlag',this.fallBackFlag?1:0)
      formData.append('convertSmsFlag',this.convertSmsFlag?1:0)
      formData.append('fallBackContent',this.fallBackFlag && this.baseFlag && this.formData.supplierCode=='1'?this.$refs.fallCatDraw.formValue:'')
      formData.append('convertSmsContent',this.convertSmsFlag?this.convertSmsContent:'')
      formData.append('textParamList',JSON.stringify(window.__VAR__.text.arr))
      formData.append('urlParamList',JSON.stringify(window.__VAR__.url.arr))
      this.saveLoading = true
      const { success, message } = await saveOrUpdateE5GMsg(formData) 
      if(success) {
        this.saveLoading = false
        this.$notification.open({
          message: '保存成功',
          description: '保存消息成功',
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$emit('close', 'save')
      } else {
        this.saveLoading = false
        this.$notification.open({
          message: '保存失败',
          description: message,
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" />
        });
      }

    },
    cancel() {
      this.$emit('close', 'cancel')
    },
    updateVarText() {
      let text = window.__VAR__.text
      let inputs = this.$refs.catDraw.eventList.inputContents
      let buttons = this.$refs.buttons.items
      let re = /{(.*?)}/g
      let temp
      text.arr = text.init()
      let reAndAdd = (info) => {
        while (temp = re.exec(info)) {
          let str = temp[0].replace(/\{|\}/gi,'')
          text.arr.find((val, i)=>{
            if(val.text === str) {
              text.arr[i].times += 1
              return true
            }
            return false
          })
        }
      }
      inputs.map((item)=>{
        // 目前是只能单选，所以这样写
        switch(item.replyType) {
          case "text":
            reAndAdd(item.reply.content)
            break
          case "singleCard":
            reAndAdd(item.reply.card.title)
            reAndAdd(item.reply.card.description)
            item.reply.card.buttons.map((i)=>{
              reAndAdd(i.description)
            })
            break
          case "manyCards":
            item.reply.cards.map((i)=>{
              reAndAdd(i.title)
              reAndAdd(i.description)
              i.buttons.map((m)=>{
                reAndAdd(m.description)
              })
            })
            break
        }
      })
      buttons.map((item)=>{
        reAndAdd(item.description)
      })
    },
    updateVarUrl() {
      let url = window.__VAR__.url
      let inputs = this.$refs.catDraw.eventList.inputContents
      let buttons = this.$refs.buttons.items
      let re = /{(.*?)}/g
      let temp
      url.arr = url.init()
      let reAndAdd = (info) => {
        while (temp = re.exec(info)) {
          let str = temp[0].replace(/\{|\}/gi,'')
          url.arr.find((val, i)=>{
            if(val.text === str) {
              url.arr[i].times += 1
              return true
            }
            return false
          })
        }
      }
      inputs.map((item)=>{
        // 目前是只能单选，所以这样写
        switch(item.replyType) {
          case "singleCard":
            item.reply.card.buttons.map((i)=>{
              reAndAdd(i.content)
            })
            break
          case "manyCards":
            item.reply.cards.map((i)=>{
              i.buttons.map((m)=>{
                reAndAdd(m.content)
              })
            })
            break
        }
      })
      buttons.map((item)=>{
        reAndAdd(item.content)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.msgTemplate {
  width: 1000px;
  padding: 12px;
}
.required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.desc-text {
  padding-left: 12px;
  font-size: 12px;
  color: #909399;
}
.changeMsg {
  height: 200px;
  background: #ffffff;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);

  .msgNum {
    font-size: 14px;
    margin-left: 16px;
  }
  .type-img {
    width: 12px;
		height: 12px;
		margin-right: 6px;
  }
  .type {
    height: 36px;
    line-height: 36px;
    justify-content: space-between;
    background: #FAFAFA;
    padding: 0 16px;
  }
  .msg-input {
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
}
</style>