<template>
  <div>
    <a-card style="padding: 30px">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>

        <div style="margin-top: 30px" v-show="current == 0">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="企业全称" prop="entName">
                <a-input placeholder="请输入企业全称" v-model="form.entName" />
              </a-form-model-item>
              <a-form-model-item label="企业地址" prop="addressValue">
                <a-cascader
                  v-model="form.addressValue"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  :options="options"
                  placeholder="请选择企业地址"
                  @change="addressChange"
                />
              </a-form-model-item>
              <a-form-model-item label="详细地址" prop="address">
                <a-input v-model="form.address" placeholder="请输入详细地址" />
              </a-form-model-item>
              <a-form-model-item label="企业电话" prop="entPhone">
                <a-input placeholder="请输入企业电话" v-model="form.entPhone" />
              </a-form-model-item>
              <a-form-model-item label="企业LOGO">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :show-upload-list="false"
                  :action="uploadUrl"
                  :before-upload="(e) => beforeUpload(e, 'logo')"
                  @change="(e) => handleChange(e, 'logo')"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <img v-if="form.logoUrl" :src="form.logoUrl" alt="avatar" style="width: 128px; height: 128px" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="企业简称" prop="abbrName">
                <a-input placeholder="请输入企业简称" v-model="form.abbrName" />
              </a-form-model-item>
              <a-form-model-item label="企业编码" prop="entCode">
                <a-input placeholder="请输入企业编码" v-model="form.entCode" />
              </a-form-model-item>
              <a-form-model-item label="所属行业" prop="industryList">
                <a-cascader
                  v-model="form.industryList"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  :options="industryOptions"
                  placeholder="请选择所属行业"
                  @change="industryChange"
                />
              </a-form-model-item>
              <a-form-model-item label="企业等级" prop="entGrade">
                <a-radio-group v-model="form.entGrade" @change="entGradeChange">
                  <a-radio :value="item.value" v-for="(item, index) in entGradeList" :key="index">
                    {{ item.name }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="企业营业执照">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :show-upload-list="false"
                  :before-upload="(e) => beforeUpload(e)"
                  :action="uploadUrl"
                  @change="(e) => handleChange(e, 'license')"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <img v-if="form.bizLicUrl" :src="form.bizLicUrl" alt="avatar" style="width: 128px; height: 128px" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <div v-show="current == 2" style="margin-top: 30px">
        <a-form-model
          ref="ruleFormLegal"
          :model="formLegal"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="企业法人姓名" prop="name">
                <a-input v-model="formLegal.name" placeholder="请输入企业法人姓名" />
              </a-form-model-item>
              <a-form-model-item label="身份证正面">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :action="uploadUrl"
                  @change="(e) => handleChange(e, 'idCardFront')"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <img
                    v-if="formLegal.idCardFrontUrl"
                    :src="formLegal.idCardFrontUrl"
                    alt="avatar"
                    style="width: 128px; height: 128px"
                  />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <!-- <div class="ant-upload-text">Upload</div> -->
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="法人身份证号" prop="idCard">
                <a-input v-model="formLegal.idCard" placeholder="请输入法人身份证号" />
              </a-form-model-item>

              <a-form-model-item label="身份证反面">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :action="uploadUrl"
                  @change="(e) => handleChange(e, 'idCardBack')"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <img
                    v-if="formLegal.idCardBackUrl"
                    :src="formLegal.idCardBackUrl"
                    alt="avatar"
                    style="width: 128px; height: 128px"
                  />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <a-form-model
        ref="ruleformPerson"
        :model="formPerson"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div style="margin-top: 30px" v-show="current == 1">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="联系人姓名" prop="name">
                <a-input placeholder="请输入联系人姓名" v-model="formPerson.name" />
              </a-form-model-item>

              <a-form-model-item label="联系人手机号" prop="phone">
                <a-input v-model="formPerson.phone" placeholder="请输入联系人手机号" />
              </a-form-model-item>

              <a-form-model-item label="身份证正面">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :action="uploadUrl"
                  @change="(e) => handleChange(e, 'contactIdFront')"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <img
                    v-if="formPerson.idCardFrontUrl"
                    :src="formPerson.idCardFrontUrl"
                    alt="avatar"
                    style="width: 128px; height: 128px"
                  />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人身份证号" prop="idCard">
                <a-input v-model="formPerson.idCard" placeholder="请输入联系人身份证号" />
              </a-form-model-item>
              <a-form-model-item label="联系人邮箱" prop="email">
                <a-input v-model="formPerson.email" placeholder="请输入联系人邮箱" />
              </a-form-model-item>

              <a-form-model-item label="身份证反面">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :action="uploadUrl"
                  @change="(e) => handleChange(e, 'contactIdBack')"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <img
                    v-if="formPerson.idCardBackUrl"
                    :src="formPerson.idCardBackUrl"
                    alt="avatar"
                    style="width: 128px; height: 128px"
                  />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <a-form-model
        ref="ruleformContract"
        :model="formContract"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div style="margin-top: 30px" v-show="current == 3">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="合同编号" prop="contractCode">
                <a-input v-model="formContract.contractCode" placeholder="请输入合同编号" />
              </a-form-model-item>
              <a-form-model-item label="合同名称" prop="contractName">
                <a-input v-model="formContract.contractName" placeholder="请输入合同名称" />
              </a-form-model-item>

              <a-form-model-item label="合同是否续签" prop="isRenew">
                <a-radio-group v-model="formContract.isRenew">
                  <a-radio value="0"> 是 </a-radio>
                  <a-radio value="-1"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="合同生效日期" prop="fromTime">
                <a-date-picker valueFormat="YYYY-MM-DD" v-model="formContract.fromTime" />
              </a-form-model-item>
              <a-form-model-item label="合同失效日期" prop="thruTime">
                <a-date-picker v-model="formContract.thruTime" valueFormat="YYYY-MM-DD" />
              </a-form-model-item>

              <a-form-model-item label="合同附件">
                <a-upload
                  name="file"
                  :action="uploadUrl"
                  :before-upload="before"
                  :file-list="fileList"
                  @change="contractChange"
                  :headers="{
                    'X-Access-Token': token,
                  }"
                  :data="biz"
                >
                  <a-button> <a-icon type="upload" />选择文件</a-button>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <div class="steps-action">
        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev"> 上一步 </a-button>
        <a-button v-if="current == 0" type="primary" @click="onSubmit"> 下一步 </a-button>
        <a-button v-if="current == 1" type="primary" @click="onFormPerson"> 下一步 </a-button>
        <a-button v-if="current == 2" type="primary" @click="onSecond"> 下一步 </a-button>
        <!-- <a-button v-if="current == 3" type="primary" @click="onFormContract"> 提交 </a-button>  -->
      </div>
      <div>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: '-53px',
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="keep"> 返回 </a-button>
          <a-button :style="{ marginRight: '8px' }" @click="onFormContract"> 提交 </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { addEntInfo, areaList, industryList } from '@/api/api.js'
import { mapGetters } from 'vuex'

export default {
  name: 'enterpriseInfo',
  props: {
    visible: {
      type: Boolean,
    },
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
        entGrade: '3',
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
          title: '联系人信息',
          content: 'Second-content',
        },
        {
          title: '法人信息',
          content: 'Three-content',
        },
        {
          title: '合同信息',
          content: 'Last-content',
        },
      ],
      rules: {
        entName: [{ required: true, message: '请输入企业全称', trigger: 'blur' }],
        abbrName: [{ required: true, message: '请输入企业简称', trigger: 'blur' }],
        entCode: [
          { required: true, message: '请输入企业编码', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]{0,}$/,
            message: '请输入正确的格式',
            trigger: 'blur',
          },
        ],
        addressValue: [{ required: true, message: '请选择企业地址', trigger: 'change' }],
        industryList: [{ required: true, message: '请选择企业等级', trigger: 'change' }],
        entGrade: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
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
      entGradeList: [
        { value: '0', name: '金牌级' },
        { value: '1', name: '银牌级' },
        { value: '2', name: '铜牌级' },
        { value: '3', name: '标准级' },
      ],
    }
  },
  created() {
    // this.getareaList()
    // this.getindustryList()
  },
  computed: {
    ...mapGetters(['token']),
  },
  methods: {
    add() {
      this.addparams.entContractsList.push(this.formContract)
      this.addparams.entPersonList.push(this.formPerson)
      this.addparams.entPersonList.push(this.formLegal)
      this.addparams.entInfo = this.form
      addEntInfo(this.addparams).then((res) => {
        if (res.code == 200) {
          this.$message.success('新建成功!')
          setTimeout(() => {
            // this.$emit('changevisible')
            this.$router.push('/enterpriseManage')
            this.resetForm()
          }, 1000)
        }
      })
    },
    getareaList() {
      areaList().then((res) => {
        this.options = res.result
      })
    },
    getindustryList() {
      industryList().then((res) => {
        this.industryOptions = res.result
      })
    },
    addressChange(value) {
      this.form.city = value[1]
      this.form.province = value[0]
    },
    industryChange(value) {
      this.form.industry = value[1]
    },
    prev() {
      this.current--
    },
    onSubmit() {
      this.current++
      // this.$refs.ruleForm.validate((valid) => {
      //   if (valid) {
      //     if (this.form.logoUrl == '') {
      //       this.$message.warning('请上传企业logo')
      //     } else if (this.form.bizLicUrl == '') {
      //       this.$message.warning('请上传营业执照照片')
      //     } else {
      //       this.current++
      //     }
      //   } else {
      //     return false
      //   }
      // })
    },
    onSecond() {
      this.current++ //2
      // this.$refs.ruleFormLegal.validate((valid) => {
      //   if (valid) {
      //     if (this.formLegal.idCardFrontUrl == '') {
      //       this.$message.warning('请上传身份证正面照片')
      //     } else if (this.formLegal.idCardBackUrl == '') {
      //       this.$message.warning('请上传身份证反面照片')
      //     } else {
      //       this.current++
      //     }
      //   } else {
      //     console.log('error submit!!')
      //   }
      // })
    },
    onFormPerson() {
      this.current++ //ruleformPerson 1
      // this.$refs.ruleformPerson.validate((valid) => {
      //   if (valid) {
      //     console.log(1111)
      //     if (this.formPerson.idCardFrontUrl == '') {
      //       this.$message.warning('请上传身份证正面照片')
      //       // this.$refs.ruleformPerson.clearValidate('contactIdFrontUrl')
      //     } else if (this.formPerson.idCardBackUrl == '') {
      //       this.$message.warning('请上传身份证反面照片')
      //       // this.$refs.ruleformPerson.clearValidate('contactIdBackUrl')
      //     } else {
      //       this.current++
      //     }
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    onFormContract() {
      // this.$refs['basic'].$refs['ruleForm'].validate(valid=>{
      // this.$refs['ruleForm'] &&
      const p1 = new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.form.logoUrl == '') {
              this.$message.warning('请上传企业logo')
            } else if (this.form.bizLicUrl == '') {
              this.$message.warning('请上传营业执照照片')
            } else {
              resolve()
            }
          } else {
            return false
          }
        })
      })
      const p2 = new Promise((resolve, reject) => {
        this.$refs.ruleformPerson.validate((valid) => {
          if (valid) {
            console.log(1111)
            if (this.formPerson.idCardFrontUrl == '') {
              this.$message.warning('请上传身份证正面照片')
              // this.$refs.ruleformPerson.clearValidate('contactIdFrontUrl')
            } else if (this.formPerson.idCardBackUrl == '') {
              this.$message.warning('请上传身份证反面照片')
              // this.$refs.ruleformPerson.clearValidate('contactIdBackUrl')
            } else {
              resolve()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
      const p3 = new Promise((resolve, reject) => {
        this.$refs.ruleFormLegal.validate((valid) => {
          if (valid) {
            if (this.formLegal.idCardFrontUrl == '') {
              this.$message.warning('请上传身份证正面照片')
            } else if (this.formLegal.idCardBackUrl == '') {
              this.$message.warning('请上传身份证反面照片')
            } else {
              resolve()
            }
          } else {
            console.log('error submit!!')
          }
        })
      })
      const p4 = new Promise((resolve, reject) => {
        this.$refs['ruleformContract'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
      // this.$refs['ruleformContract'].validate((valid) => {
      //   if (valid) {
      //     this.add()
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
      Promise.all([p1, p2, p3, p4]).then(() => {
        console.log('验证通过,提交表单')
        this.add()
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
      // fileList = fileList.slice(-2)
      this.formContract.contractsUrlList = fileList.map((file) => {
        if (file.response) {
          return file.response.message
        }
      })
      this.fileList = fileList
    },
    beforeUpload(file, type) {
      if (file && type == 'logo') {
        const isLt2k = file.size / 1024 / 1024 < 0.02
        if (!isLt2k) {
          this.$message.error('请上传小于20k的图片')
        }
        return isLt2k
      } else {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('请上传小于2M的图片')
        }
        return isLt2M
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
    entGradeChange() {},
    keep() {
      this.$router.push('/enterpriseManage')
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