
<template>
  <div>
    <a-card size="small" title="企业基本信息" style="width: 100%">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div style="margin-top: 30px">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="企业全称" prop="entName">
                <a-input placeholder="请输入企业全称" v-model="form.entName" disabled />
                <!-- <span>{{ form.entName }}</span> -->
              </a-form-model-item>
              <a-form-model-item label="企业地址" prop="addressValue">
                <a-cascader
                  v-model="form.addressValue"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  :options="options"
                  placeholder="请选择企业地址"
                  @change="addressChange"
                  disabled
                />
              </a-form-model-item>
              <a-form-model-item label="详细地址" prop="address">
                <a-input v-model="form.address" placeholder="请输入详细地址" disabled />
              </a-form-model-item>
              <a-form-model-item label="企业电话" prop="entPhone">
                <a-input placeholder="请输入企业电话" v-model="form.entPhone" disabled />
              </a-form-model-item>
              <a-form-model-item label="企业LOGO">
                <img v-if="form.logoUrl" :src="form.logoUrl" alt="avatar" style="width: 128px; height: 128px" />
              </a-form-model-item>
              <a-form-model-item label="企业营业执照">
                <img v-if="form.bizLicUrl" :src="form.bizLicUrl" alt="avatar" style="width: 128px; height: 128px" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="企业简称" prop="abbrName">
                <a-input placeholder="请输入企业简称" v-model="form.abbrName" disabled />
              </a-form-model-item>
              <a-form-model-item label="所属行业" prop="industryList">
                <a-cascader
                  v-model="form.industryList"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  :options="industryOptions"
                  placeholder="请选择所属行业"
                  @change="industryChange"
                  disabled
                />
              </a-form-model-item>

              <a-form-model
                ref="ruleFormLegal"
                :model="formLegal"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="企业法人姓名" prop="name">
                  <a-input v-model="formLegal.name" placeholder="请输入企业法人姓名" disabled />
                </a-form-model-item>

                <a-form-model-item label="法人身份证号" prop="idCard">
                  <a-input v-model="formLegal.idCard" placeholder="请输入法人身份证号" disabled />
                </a-form-model-item>
                <a-form-model-item label="身份证正面">
                  <img
                    v-if="formLegal.idCardFrontUrl"
                    :src="formLegal.idCardFrontUrl"
                    alt="avatar"
                    style="width: 128px; height: 128px"
                  />
                </a-form-model-item>

                <a-form-model-item label="身份证反面">
                  <img
                    v-if="formLegal.idCardBackUrl"
                    :src="formLegal.idCardBackUrl"
                    alt="avatar"
                    style="width: 128px; height: 128px"
                  />
                </a-form-model-item>
              </a-form-model>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-card>
    <a-card size="small" title="企业联系人信息" style="width: 100%; margin-top: 20px">
      <a-form-model
        ref="ruleformPerson"
        :model="formPerson"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div style="margin-top: 30px">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="联系人姓名" prop="name">
                <a-input placeholder="请输入联系人姓名" v-model="formPerson.name" disabled />
              </a-form-model-item>

              <a-form-model-item label="联系人手机号" prop="phone">
                <a-input v-model="formPerson.phone" placeholder="请输入联系人手机号" disabled />
              </a-form-model-item>

              <a-form-model-item label="身份证正面">
                <img
                  v-if="formPerson.idCardFrontUrl"
                  :src="formPerson.idCardFrontUrl"
                  alt="avatar"
                  style="width: 128px; height: 128px"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人身份证号" prop="idCard">
                <a-input v-model="formPerson.idCard" placeholder="请输入联系人身份证号" disabled />
              </a-form-model-item>
              <a-form-model-item label="联系人邮箱" prop="email">
                <a-input v-model="formPerson.email" placeholder="请输入联系人邮箱" disabled />
              </a-form-model-item>

              <a-form-model-item label="身份证反面">
                <img
                  v-if="formPerson.idCardBackUrl"
                  :src="formPerson.idCardBackUrl"
                  alt="avatar"
                  style="width: 128px; height: 128px"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-card>
    <a-card size="small" title="合同信息" style="width: 100%; margin-top: 20px">
      <a-form-model
        ref="ruleformContract"
        :model="formContract"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div style="margin-top: 30px">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="合同编号" prop="contractCode">
                <a-input v-model="formContract.contractCode" placeholder="请输入合同编号" disabled />
              </a-form-model-item>
              <a-form-model-item label="合同名称" prop="contractName">
                <a-input v-model="formContract.contractName" placeholder="请输入合同名称" disabled />
              </a-form-model-item>

              <a-form-model-item label="合同是否续签" prop="isRenew">
                <a-radio-group v-model="formContract.isRenew" disabled>
                  <a-radio :value="0"> 是 </a-radio>
                  <a-radio :value="-1"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="合同生效日期" prop="fromTime">
                <a-date-picker valueFormat="YYYY-MM-DD" v-model="formContract.fromTime" disabled />
              </a-form-model-item>
              <a-form-model-item label="合同失效日期" prop="thruTime">
                <a-date-picker v-model="formContract.thruTime" valueFormat="YYYY-MM-DD" disabled />
              </a-form-model-item>

              <a-form-model-item label="合同附件">
                <div v-for="(item, index) in contractList" :key="index">
                  <a target="_blank" :href="item.url">{{ item.name }}</a>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-card>
    <div></div>
  </div>
</template>

<script>
import { entInfoUpdate } from '@/api/api.js'
import { mapGetters } from 'vuex'
import { getFathersById } from './editInfo.js'

export default {
  name: 'editInfo',
  props: {
    editItem: {
      type: Object,
    },
  },
  watch: {
    editItem: 'getentInfoId',
  },
  data() {
    return {
      options: JSON.parse(window.sessionStorage.getItem('options')) || [],
      industryOptions: JSON.parse(window.sessionStorage.getItem('industryOptions')) || [],
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      addparams: {
        entContractsList: [], // 基本信息
        entInfo: {}, // 合同信息
        entPersonList: [], // 联系人
      },
      form: {
        logoUrl: '',
        bizLicUrl: '',
        city: '', //城市
        province: '', //省份
        industryList: [], // 所属行业
        industry: '',
        addressValue: [],
      },
      formPerson: {
        idCardBackUrl: '',
        idCardFrontUrl: '',
        personType: 'contact',
      },
      formContract: {
        contractsUrlList: [],
      },
      formLegal: {
        idCard: '',
        name: '',
        phone: '',
        idCardBackUrl: '',
        idCardFrontUrl: '',
        personType: 'legal',
      },

      loading: false,
      fileList: [],
      current: 0,
      steps: [
        {
          title: '企业基本信息',
          content: 'First-content',
        },
        {
          title: '企业联系人信息',
          content: 'Second-content',
        },
        {
          title: '合同信息',
          content: 'Last-content',
        },
      ],
      rules: {
        entName: [{ required: true, message: '请输入企业全称', trigger: 'blur' }],
        abbrName: [{ required: true, message: '请输入企业简称', trigger: 'blur' }],
        addressValue: [{ required: true, message: '请选择企业地址', trigger: 'change' }],
        industryList: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
        address: [
          { required: true, message: '请输入企业详细地址', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
        ],
        entPhone: [
          { required: true, message: '请输入企业电话', trigger: 'blur' },
          {
            pattern: /^[1]([3-9])[0-9]{9}$/,
            message: '请输入正确的格式',
            trigger: 'blur',
          },
        ],
        resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证格式',
            trigger: 'blur',
          },
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],

        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: 'blur',
          },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^[1]([3-9])[0-9]{9}$/,
            message: '请输入正确的格式',
            trigger: 'blur',
          },
        ],
        contractCode: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        contractName: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        fromTime: [{ required: true, message: '请选择合同生效日期', trigger: 'change' }],
        thruTime: [{ required: true, message: '请选择合同失效日期', trigger: 'change' }],
        isRenew: [{ required: true, message: '请选择合同是否续签', trigger: 'change' }],
        logoImgUrl: [{ required: true, message: '请上传LOGO图片', trigger: 'blur' }],
        licenseImgUrl: [{ required: true, message: '请上传营业执照照片', trigger: 'blur' }],
        idCardFrontUrl: [{ required: true, message: '请上传身份证正面图片', trigger: 'blur' }],
        idCardBackUrl: [{ required: true, message: '请上传身份证反面图片', trigger: 'blur' }],
        contactIdFrontUrl: [{ required: true, message: '请上传身份证正面照片', trigger: 'blur' }],
        contactIdBackUrl: [{ required: true, message: '请上传身份证反面图片', trigger: 'blur' }],
      },
      uploadUrl: window._CONFIG['domianURL'] + 'sys/upload/uploadMinio',
      biz: {
        biz: 'entInfo',
      },
      logoImgUrl: '',
      licenseImgUrl: '',
      idCardFrontUrl: '',
      idCardBackUrl: '',
      contactIdFrontUrl: '',
      contactIdBackUrl: '',
      nodes: [],
      contractList: [],
    }
  },
  created() {
    this.getentInfoId()
  },
  computed: {
    ...mapGetters(['token']),
  },
  methods: {
    getentInfoId() {
      this.formContract = this.editItem.result.entContractsList[0]
      this.contractList = this.editItem.result.entContractsList[0].contractsUrlObjectList
      this.formPerson = this.editItem.result.entPersonList[0]
      this.formLegal = this.editItem.result.entPersonList[1]
      this.form = this.editItem.result.entInfo
      this.form = {
        ...this.form,
        industryList: getFathersById(this.form.industry, this.industryOptions),
        addressValue: getFathersById(this.form.province, this.options),
      }
    },

    getEntInfoUpdate() {
      this.addparams.entContractsList.push(this.formContract)
      this.addparams.entPersonList.push(this.formPerson)
      this.addparams.entPersonList.push(this.formLegal)
      this.addparams.entInfo = this.form
      entInfoUpdate(this.addparams).then((res) => {
        if (res.code == 200) {
          this.$message.success('编辑成功!')
          setTimeout(() => {
            this.$emit('changeEditVisible')
            this.resetForm()
          }, 1000)
        }
      })
    },

    addressChange(value) {
      this.form.addressValue = value
      this.form.city = value[1]
      this.form.province = value[0]
    },
    industryChange(value) {
      this.form.industryList = value

      this.form.industry = value[1]
    },
    prev() {
      this.current--
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.logoUrl == '') {
            this.$message.warning('请上传企业logo')
          } else if (this.form.bizLicUrl == '') {
            this.$message.warning('请上传营业执照照片')
          } else {
            this.$refs.ruleFormLegal.validate((valid) => {
              if (valid) {
                if (this.formLegal.idCardFrontUrl == '') {
                  this.$message.warning('请上传身份证正面照片')
                } else if (this.formLegal.idCardBackUrl == '') {
                  this.$message.warning('请上传身份证反面照片')
                } else {
                  this.current++
                }
              } else {
                console.log('error submit!!')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    onFormPerson() {
      this.$refs.ruleformPerson.validate((valid) => {
        if (valid) {
          if (this.formPerson.idCardBackUrl == '') {
            this.$message.warning('请上传身份证正面照片')
            // this.$refs.ruleformPerson.clearValidate('contactIdFrontUrl')
          } else if (this.formPerson.idCardFrontUrl == '') {
            this.$message.warning('请上传身份证反面照片')
            // this.$refs.ruleformPerson.clearValidate('contactIdBackUrl')
          } else {
            this.current++
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onFormContract() {
      this.$refs.ruleformContract.validate((valid) => {
        if (valid) {
          this.getEntInfoUpdate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$refs.ruleFormLegal.resetFields()
      this.$refs.ruleformPerson.resetFields()
      this.$refs.ruleformContract.resetFields()
    },
    validate(rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback('需要以 user- 开头')
      }
      callback()
    },
    handleChange(info, v) {
      if (info.file.status === 'done') {
        if (v == 'logo') {
          this.form.logoUrl = info.file.response.message
        } else if (v == 'license') {
          this.form.bizLicUrl = info.file.response.message
        } else if (v == 'idCardFront') {
          this.formLegal.idCardFrontUrl = info.file.response.message
        } else if (v == 'idCardBack') {
          this.formLegal.idCardBackUrl = info.file.response.message
        } else if (v == 'contactIdFront') {
          this.formPerson.idCardFrontUrl = info.file.response.message
        } else if (v == 'contactIdBack') {
          this.formPerson.idCardBackUrl = info.file.response.message
        }
      }
    },
    contractChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-2)
      this.formContract.contractsUrlList = fileList.map((file) => {
        if (file.response) {
          return file.response.message
        }
      })
      this.fileList = fileList
    },
    beforeUpload(file) {
      if (file) {
        const isLt2k = file.size / 1024 / 1024 < 0.02
        if (!isLt2k) {
          this.$message.error('请上传小于20k的图片')
        }
        return isLt2k
      }
    },
    before(file) {
      if (file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('请上传小于2M的图片')
        }
        return isLt2M
      }
    },
  },
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>