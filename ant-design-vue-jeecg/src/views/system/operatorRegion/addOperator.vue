<template>
  <div>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="服务大区名称" prop="serviceRegionName">
        <a-input v-model="form.serviceRegionName" />
      </a-form-model-item>
      <a-form-model-item label="运营商" prop="operatorId">
        <a-select placeholder="请选择" v-model="form.operatorId">
          <a-select-option :value="item.id" v-for="(item, index) in operatorNameList" :key="index">{{
            item.description
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="大区" prop="regionId">
        <a-select placeholder="请选择" v-model="form.regionId">
          <a-select-option :value="item.id" v-for="(item, index) in regionNameList" :key="index">{{
            item.description
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="serverRoot" prop="serverRoot">
        <a-input v-model="form.serverRoot" />
      </a-form-model-item>
      <a-form-model-item label="fileServerRoot" prop="fileRoot">
        <a-input v-model="form.fileRoot" />
      </a-form-model-item>
      <a-form-model-item label="报备IP" prop="reportIp">
        <a-input v-model="form.reportIp" />
      </a-form-model-item>
      <a-form-model-item label="上行回调地址" prop="upCallbackUrl">
        <a-input v-model="form.upCallbackUrl" />
      </a-form-model-item>
    </a-form-model>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 14 }">
      <a-button style="margin-right: 10px" @click="cancel"> 取消 </a-button>
      <a-button v-if="!editId" type="primary" @click="onSubmit"> 提交 </a-button>
      <a-button v-if="editId" type="primary" @click="editonSubmit"> 编辑 </a-button>
      <!-- <a-button style="margin-left: 10px" @click="resetForm"> 重置 </a-button> -->
    </a-form-model-item>
  </div>
</template>
<script>
import { operator, region, addServiceRegion, forIDserviceRegion, updateServiceRegion } from '@/api/api.js'
export default {
  props: {
    editId: {
      type: String,
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
        serviceRegionName: '',
        operatorName: '',
        regionName: '',
        serverRoot: '',
        fileRoot: '',
        reportIp: '',
        upCallbackUrl: '',
      },
      operatorNameList: [],
      regionNameList: [],
      rules: {
        serviceRegionName: [{ required: true, message: '请输入服务大区名称', trigger: 'blur' }],
        operatorId: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        regionId: [{ required: true, message: '请选择大区', trigger: 'change' }],
        serverRoot: [{ required: true, message: '请输入serverRoot', trigger: 'blur' }],
        fileRoot: [{ required: true, message: 'fileServerRoot', trigger: 'blur' }],
        reportIp: [{ required: true, message: '请输入报备IP', trigger: 'blur' }],
        upCallbackUrl: [{ required: true, message: '请输入上行回调地址', trigger: 'blur' }],
      },
    }
  },
  created() {
    console.log(this.editId)
    this.getOperator()
    this.getRegion()
    if (this.editId) {
      this.getForIDserviceRegion()
    }
  },
  methods: {
    getOperator() {
      operator(this.queryParam).then((res) => {
        this.operatorNameList = res.result
      })
    },
    //  获取运营商列表
    getRegion() {
      region().then((res) => {
        this.regionNameList = res.result
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          addServiceRegion(this.form).then((res) => {
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
          updateServiceRegion(this.form).then((res) => {
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
    },
    cancel() {
      this.$emit('close')
    },

    getForIDserviceRegion() {
      forIDserviceRegion({ id: this.editId }).then((res) => {
        console.log(res)
        this.form = res.result
      })
    },
  },
}
</script>