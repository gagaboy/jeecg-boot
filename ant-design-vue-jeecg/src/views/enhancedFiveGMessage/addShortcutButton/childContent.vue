<template>
  <div class="childContent">
    <!-- <div class="defaultContent">
      <a-select
        v-model="btn.type"
        size="small"
        @change="handleChange">
        <a-select-option
          v-for="item in btnList"
          :key="item.value"
          :value="item.value"
        >{{item.label}}</a-select-option>
      </a-select>
      <a-input class="childInput text-required" v-model="btn.description" size="small" placeholder="按钮文案（必填）" :maxlength="10" data-vv-as="" data-vv- v-validate="'required'" validate-msg="请输入按钮文案" />
      <a-icon type="delete" @click="deleteBtn"/>
    </div> -->
    <a-form-model
      ref="ruleForm"
      :model="btn"
      :rules="rules">
        <div class="defaultContent">
          <a-select
            style="width:540px;height: 28px;"
            v-model="btn.type"
            
            size="small"
            @change="handleChange">
            <a-select-option
              v-for="item in btnList"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</a-select-option>
          </a-select>
          <div class="descriptionClass" style="flex:1;margin-top: -1px;">
            <!-- <a-form-model-item v-if="btn.type === 'url'" prop="application" style="flex:1;" > -->
              <a-select
                v-if="btn.type === 'url'"
                style="width: 145px;padding: 0px 14px;margin-bottom: 24px;" 
                size="small"
                v-model="btn.application"
              >
                <a-select-option value="webview">webview打开</a-select-option>
                <a-select-option value="browser">浏览器打开</a-select-option>
              </a-select>
            <!-- </a-form-model-item> -->
            <a-form-model-item v-else prop="description" style="flex:1;" >
              <a-input :id="'btnDescription' + index+name" v-model="btn.description" size="small" placeholder="按钮文案（必填）"/>
            </a-form-model-item>
            <div class="var" v-if="btn.type !== 'url'"  @click="addVar('btnDescription' + index+name, 'text') ">
							<img class="var-img" src="./var.png">
						</div>
            <a-icon type="delete" @click="deleteBtn"/>
          </div>
        </div>

      <a-form-model-item v-if="btn.type=='url'" prop="description" style="flex:1;" >
        <a-input :id="'btnDescription' + index+name" style="width: calc(100% - 65px);" v-model="btn.description" size="small" placeholder="按钮文案（必填）"/>
        <div class="var" style="padding-left: 14px;" @click="addVar('btnDescription' + index+name, 'text') ">
          <img class="var-img" src="./var.png">
        </div>
      </a-form-model-item>
      <a-form-model-item v-if="btn.type=='url'" prop="content">
        <a-input class="matchInput" :id="'btnContent' + index+name" style="width: calc(100% - 65px);" v-model="btn.content" size="small" placeholder="请输入链接（必填）"/>
        <div class="var" style="padding-left: 14px;" @click="addVar('btnContent' + index+name, 'url') ">
          <img class="var-img" src="./var.png">
        </div>
      </a-form-model-item>

      <a-form-model-item v-if="btn.type=='openApp'" prop="openAppAndroid">
        <a-input class="matchInput" v-model="btn.openAppAndroid" size="small" placeholder="请输入正确调起地址（必填）" />
      </a-form-model-item>

      <a-form-model-item v-if="btn.type=='call'" prop="callPhone">
        <a-input class="matchInput" v-model="btn.callPhone" size="small" placeholder="请输入电话号码（必填）"/>
      </a-form-model-item>

      <a-form-model-item v-if="btn.type=='addressLocation'" prop="sendAddressPlaceName">
        <a-input class="matchInput" data-name="longInput" v-model="btn.sendAddressPlaceName" size="small" placeholder="位置名称（必填）" />
      </a-form-model-item>
      <a-form-model-item v-if="btn.type=='addressLocation'" prop="sendAddressLongitude">
        <a-input class="matchInput" v-model="btn.sendAddressLongitude" size="small" placeholder="经度（必填）"/>
      </a-form-model-item>
      <a-form-model-item v-if="btn.type=='addressLocation'" prop="sendAddressLatitude">
        <a-input class="matchInput" v-model="btn.sendAddressLatitude" size="small" placeholder="纬度（必填）" />
      </a-form-model-item>

      <a-form-model-item v-if="btn.type=='screen'" prop="targetContact">
        <a-input class="matchInput" v-model="btn.targetContact" size="small" placeholder="目标联系人联系方式（必填）"/>
      </a-form-model-item>

      <a-form-model-item v-if="btn.type=='bringUp'" prop="targetContact">
        <a-input class="matchInput" v-model="btn.targetContact" size="small" placeholder="目标联系人联系方式（必填）"/>
      </a-form-model-item>
      <a-form-model-item v-if="btn.type=='bringUp'" prop="presendContent">
        <a-input class="matchInput" data-name="longInput" v-model="btn.presendContent"  size="small"  placeholder="预发送内容" :maxLength="100" />
      </a-form-model-item>
    </a-form-model>
    
  </div>
</template>
<script>
export default {
  props: {
    data:{},
    index: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      default: Array
    }
  },
  data(){
    let validatePass = (rule, value, callback) => {
      let  check = /[\u4e00-\u9fa5]/g
      if(!value) {
				callback(new Error('请输入目标联系人联系方式'));
			}else if(check.test(value)) {
				callback(new Error('联系方式不能包含中文字符'));
      } else if(value.length>100) {
				callback(new Error('请输入小于等于100个字符'));
			} else {
        callback()
      }
    }
    return {
      name: 'addshortcutbutton',
      rules: {
        description: [
          { required: true, message: '请输入按钮文案', trigger: 'change' },
          { max: 10, message: '按钮文案请小于10个字符', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入链接', trigger: 'change' },
          // { pattern: /^(http[s]{0,1}:\/\/)/i, message: '链接必须以http(s)://开头', trigger: 'change' },
          { max: 2000, message: '链接请小于2000个字符', trigger: 'change' },
        ],
        openAppAndroid: [
          { required: true, message: '请输入调起地址', trigger: 'change' },
        ],
        callPhone: [
          { required: true, message: '请输入电话号码', trigger: 'change' },
          // { pattern: /(^(\d{3,4}-)?\d{7,8})$|(^((\+86)|(86))?(1[0-9]{10}))/, message: '请输入正确电话号码', trigger: 'change' },
          { pattern: /^(\d+|-){5,15}$/, message: '请输入正确电话号码', trigger: 'change' },
        ],
        sendAddressPlaceName: [
          { required: true, message: '请输入位置名称', trigger: 'change' },
          { max: 10, message: '位置名称请小于10个字符', trigger: 'change' },
        ],
        sendAddressLongitude: [
          { required: true, message: '请输入经度', trigger: 'change' },
          { pattern: /^[\-\+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/, message: '请输入正确经度', trigger: 'change' },
        ],
        sendAddressLatitude: [
          { required: true, message: '请输入纬度', trigger: 'change' },
          { pattern: /^[\-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/, message: '请输入正确纬度', trigger: 'change' },
        ],
        targetContact: [
          { validator: validatePass, trigger: 'change' },
        ],
        presendContent: [
          { max: 100, message: '请输入小于等于100个字符', trigger: 'change' },
        ],
      },
      required:true,
      btnList: [
        {
          value: 'reply',
          label: '回复按钮'
        },
        {
          value: 'url',
          label: '打开URL按钮'
        },
        {
          value: 'openApp',
          label: '打开app按钮'
        },
        {
          value: 'call',
          label: '打电话按钮'
        },
        {
          value: 'sendAddress',
          label: '发送地址按钮'
        },
        {
          value: 'addressLocation',
          label: '地址定位按钮'
        },
        {
          value: 'screen',
          label: '拍摄按钮'
        },
        {
          value: 'bringUp',
          label: '调起指定联系人'
        },
      ],
      btn:{
        type:'reply',
        description:'',
        content:'',
        openAppAndroid:'',
        openAppIos:'',
        callPhone:'',
        sendAddressPlaceName:'',
        sendAddressLongitude:'',
        sendAddressLatitude:'',
        targetContact:'',
        presendContent:'',
        application: 'webview'
      }
    }
  },
  created(){
    this.btn = this.data
  },
  watch: {
    data(newVal){
      this.btn = newVal
    },
  },
  methods: {
    checkValidate() {
      return this.$refs.ruleForm
    },
    handleChange(){
      Object.keys(this.btn).forEach(key => {
        if(key!='type'){
          (this.btn)[key] = ''
        }
      })
      this.$nextTick(()=>{
        this.$refs.ruleForm.validate()
      })
      if(this.btn.type === 'url') this.btn.application = 'webview'
    },
    //新增添加文字变量
    addVar(indexName, type) {
      let addText
      type === 'text' ? addText = window.__VAR__.text.addText() : addText = window.__VAR__.url.addUrl()
      if(addText) this.selectionStart(indexName, "{"+addText+"}", type)
    },
    selectionStart(index, quote, type) {
      var emojiInput = index //获取的id
      var elInput = document.getElementById(emojiInput); //根据id选择器选中对象
      var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
      if(startPos === undefined || endPos === undefined) return
      var txt = elInput.value;
      var result = txt.substring(0, startPos) + quote + txt.substring(endPos)
      elInput.value = result; // 赋值给input的value
      elInput.focus();
      elInput.selectionStart = startPos + quote.length;
      elInput.selectionEnd = startPos + quote.length;
      // this.eventList.inputContents[parseInt(index)].originalMessage = result // 赋值给表单中的的字段
      //新增需要手动触发onChange事件
      var event = new InputEvent('input');
      elInput.dispatchEvent(event)
    },
    deleteBtn(){
      this.$emit('deleteIndex', this.index)
    }
  }
}
</script>
<style scoped lang="less">
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
<style lang='less'>
  .childContent{
    width: 100%;
    min-height: 40px;
    padding: 16px 16px 0 16px;
    box-sizing: border-box;
    .ant-form-item-control {
      line-height: 25px;
    }
  }
  .defaultContent{
    display: flex;
    flex-direction: row;
    .ant-form-item {
      margin-top: 0px;
      padding: 0 12px;
    }
    .anticon-delete {
      padding-top: 5px;
    }
  }
  .descriptionClass {
    display: flex;
    flex-direction: row;
  }
  .childInput{
    margin: 0 10px;
  }
  .el-icon-delete{
    margin: 10px 0 0 0;
    cursor: pointer;
  }
</style>
