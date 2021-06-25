<template>
  <div>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="通道名称" prop="channelName">
        <a-input v-model="form.channelName" />
      </a-form-model-item>
      <a-form-model-item label="通道类型" prop="channelType">
        <a-select placeholder="请选择" v-model="form.channelType">
          <a-select-option :value="item.id" v-for="(item, index) in channelTypeListData" :key="index">{{
            item.itemText
          }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="关联账号" prop="chatbotAccountListRef">
        <a-select
          placeholder="请选择"
          mode="multiple"
          v-model="form.chatbotAccountListRef"
          @change="(e) => AccountListChange(e)"
        >
          <a-select-option :value="item.chatbotId" v-for="(item, index) in chatbotAccountList" :key="index"
            >{{ item.chatbotName }} <span>{{ '(' + item.operatorName + ')' }}</span></a-select-option
          >
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 14 }">
      <a-button style="margin-right: 10px" @click="cancel"> 取消 </a-button>
      <a-button v-if="!editId" type="primary" @click="onSubmit"> 提交 </a-button>
      <a-button v-if="editId" type="primary" @click="editonSubmit"> 编辑 </a-button>
      <a-button style="margin-left: 10px" @click="resetForm"> 重置 </a-button>
    </a-form-model-item>
  </div>
</template>
<script>
import { channelTypeList, listUnlinkChannel, addChannel, updateChannel } from '@/api/api.js'
export default {
  props: {
    editId: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      form: {
        channelName: '',
        chatbotAccountList: [],
        chatbotAccountListRef: [],
      },
      channelTypeListData: [],
      chatbotAccountList: [],
      regionNameList: [],
      rules: {
        channelName: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
        channelType: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        chatbotAccountListRef: [{ required: true, message: '请选择关联账号', trigger: 'change' }],
      },
    }
  },
  created() {
    this.getChannelTypeList()
    this.getListUnlinkChannel()
    if (this.editId) {
      this.form = this.editId
      console.log(this.form)

      for (let i in this.form.chatbotAccountList) {
        this.chatbotAccountList.push(this.form.chatbotAccountList[i])
      }
      this.form.chatbotAccountListRef = []
      for (let i = 0; i < this.form.chatbotAccountList.length; i++) {
        console.log(this.form.chatbotAccountList[i].chatbotId)

        this.form.chatbotAccountListRef.push(this.form.chatbotAccountList[i].chatbotId)
      }
    }
  },
  methods: {
    AccountListChange(v) {
      this.channelTypeListData = v
      let x = []
      for (let i = 0; i < this.channelTypeListData.length; i++) {
        console.log(this.channelTypeListData[i])
        x.push({ chatbotId: this.channelTypeListData[i] })
      }
      this.form.chatbotAccountList = x
      console.log(this.form.chatbotAccountList)
    },
    getListUnlinkChannel() {
      listUnlinkChannel().then((res) => {
        this.chatbotAccountList = res.result
        // for (let i in res.result) {
        //   this.chatbotAccountList.push(this.form.chatbotAccountList[i])
        // }
      })
    },
    getChannelTypeList() {
      channelTypeList().then((res) => {
        this.channelTypeListData = res.result
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          delete this.form.chatbotAccountListRef
          console.log(this.form)
          addChannel(this.form).then((res) => {
            this.$message.success(res.message)
            this.$emit('close')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    editonSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updateChannel(this.form).then((res) => {
            console.log(res)
            this.$message.success(res.message)
            this.$emit('close')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.form.chatbotAccountList = []
    },
    cancel() {
      this.$emit('close')
    },
  },
}
</script>