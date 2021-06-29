<template>
  <div class="main">
    <a-form-model ref="form" :model="model" :rules="validatorRules" class="user-layout-login">
      <!-- <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"  @change="handleTabClick">

        <a-tab-pane key="tab1" tab="账号密码登录"> -->
          <a-form-model-item required prop="username">
            <a-row :gutter="0">
              <a-col :span="3">
                <a-icon type="user" :class="['input-transform',{'input-focus':inputFous == 'username'}]" :style="{color: 'rgba(255,255,255,.3)', fontSize:'16px' }"/>
              </a-col>
              <a-col :span="21">
                <a-input v-model="model.username" :class="['input-transform',{'input-focus':inputFous == 'username'}]" placeholder="帐户名" @focus="inputFous = 'username'"></a-input>
              </a-col>
            </a-row>
          </a-form-model-item>

          <a-form-model-item required prop="password">
            <a-row :gutter="0">
              <a-col :span="3">
                <a-icon type="lock" :class="['input-transform',{'input-focus':inputFous == 'password'}]" :style="{ color: 'rgba(255,255,255,.3)', fontSize:'16px'}"/>
              </a-col>
              <a-col :span="21">
                <a-input v-model="model.password" :class="['input-transform',{'input-focus':inputFous == 'password'}]" type="password" autocomplete="false" placeholder="密码"  @focus="inputFous = 'password'"></a-input>
              </a-col>
            </a-row>
          </a-form-model-item>
        
          <a-row :gutter="0">
            <a-col :span="13">
              <a-form-model-item required prop="inputCode">
                <a-row :gutter="0">
                  <a-col :span="5">
                    <a-icon type="safety" :class="['input-transform',{'input-focus':inputFous == 'safety'}]"  :style="{ color: 'rgba(255,255,255,.3)', fontSize:'16px'}"/></a-col>
                  <a-col :span="19">
                    <a-input :class="['input-transform',{'input-focus':inputFous == 'safety'}]"  v-model="model.inputCode" placeholder="验证码" @focus="inputFous = 'safety'"></a-input>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :span="11" style="text-align: right">
              <img v-if="requestCodeSuccess" style="margin-top: 4px;height:30px" :src="randCodeImage" @click="handleChangeCheckCode"/>
              <img v-else style="margin-top: 4px;height:30px" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>
            </a-col>
          </a-row>
        <!-- </a-tab-pane> -->

        <!-- <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-model-item required prop="mobile">
            <a-input v-model="model.mobile" size="large" type="text" placeholder="请输入手机号">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-model-item>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-model-item required prop="captcha">
                <a-input v-model="model.captcha" size="large" type="text" placeholder="请输入验证码">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
            </a-col>
          </a-row>
        </a-tab-pane> -->

      <!-- </a-tabs> -->

      <!-- <a-form-model-item>
        <a-checkbox @change="handleRememberMeChange" default-checked>自动登录</a-checkbox>
        <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">
          忘记密码
        </router-link>
        <router-link :to="{ name: 'register'}" class="forge-password" style="float: right;margin-right: 10px" >
          注册账户
        </router-link>
      </a-form-model-item> -->

      <a-form-item style="margin-top:24px">
        <!--  -->
        <div class='bottom'>
            <a-button size="large" type="primary" htmlType="submit" class="loginBtn" :loading="loginBtn" @click.stop.prevent="handleSubmit" :disabled="loginBtn">登录</a-button>
        </div>
      </a-form-item>

    </a-form-model>

    <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
    <login-select-tenant ref="loginSelect" @success="loginSelectOk"></login-select-tenant>
    <!-- <third-login ref="thirdLogin"></third-login> -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN ,ENCRYPTED_STRING} from "@/store/mutation-types"
  import ThirdLogin from './third/ThirdLogin'
  import LoginSelectTenant from "./LoginSelectTenant"
  import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { encryption , getEncryptedString } from '@/utils/encryption/aesEncrypt'
  import { timeFix } from "@/utils/util"

  import LoginAccount from './LoginAccount'
  import LoginPhone from './LoginPhone'

  export default {
    components: {
      LoginSelectTenant,
      TwoStepCaptcha,
      ThirdLogin,
      LoginAccount,
      LoginPhone
    },
    data () {
      return {
        customActiveKey: 'tab1',
        rememberMe: true,
        loginBtn: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        encryptedString:{
          key:"",
          iv:"",
        },
      }
    },
    created() {
      Vue.ls.remove(ACCESS_TOKEN)
      this.getRouterData();
      this.rememberMe = true
    },
    methods:{
      handleTabClick(key){
        this.customActiveKey = key
      },
      handleRememberMeChange(e){
        this.rememberMe = e.target.checked
      },
      /**跳转到登录页面的参数-账号获取*/
      getRouterData(){
        this.$nextTick(() => {
          let temp = this.$route.params.username || this.$route.query.username || ''
          if (temp) {
            this.$refs.alogin.acceptUsername(temp)
          }
        })
      },

      //登录
      handleSubmit () {
        this.loginBtn = true;
        if (this.customActiveKey === 'tab1') {
          // 使用账户密码登录
          this.$refs.alogin.handleLogin(this.rememberMe)
        } else {
          //手机号码登录
          this.$refs.plogin.handleLogin(this.rememberMe)
        }
      },
      //账号密码登录
      loginByUsername(){
        this.validateFields([ 'username', 'password', 'inputCode' ], (err)=>{
          if(!err){
            let loginParams = {
              username: this.model.username,
              password: this.model.password,
              remember_me: this.model.rememberMe,
              captcha: this.model.inputCode,
              checkKey: this.currdatetime
            }
            // console.log("登录参数", loginParams)
            this.Login(loginParams).then((res) => {
              this.$refs.loginSelect.show(res.result)
            }).catch((err) => {
              this.requestFailed(err);
            });
          }else{
            this.loginBtn = false;
          }
        })
      },
      // 登录后台成功
      requestSuccess(loginResult){
        this.$refs.loginSelect.show(loginResult)
      },
      //登录后台失败
      requestFailed (err) {
        let description = ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试"
        this.$notification[ 'error' ]({
          message: '登录失败',
          description: description,
          duration: 4,
        });

        //密码错误后或者验证码错误/失效都更新验证码
        if(description.indexOf('密码错误')>0 || description.indexOf('验证码错误') == 0){
          this.handleChangeCheckCode();
        }
        this.loginBtn = false;
      },
      loginSelectOk(){
        this.loginSuccess()
      },
      //登录成功
      loginSuccess () {
        this.$router.push({ path: "/dashboard/analysis" }).catch(()=>{
          console.log('登录跳转首页出错,这个错误从哪里来的')
        })
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        });
      },

      stepCaptchaSuccess () {
        this.loginSuccess()
      },
      stepCaptchaCancel () {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      //获取密码加密规则
      getEncrypte(){
        var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
        if(encryptedString == null){
          getEncryptedString().then((data) => {
            this.encryptedString = data
          });
        }else{
          this.encryptedString = encryptedString;
        }
      }

    }

  }
</script>
<style lang="less" scoped>
  .input-focus {
    transform: translateX(-8px);
    color:white !important
  }
  .input-transform{
    transition: all .2s;
  }
  
  .ant-input{
      color:#61BFFF;
      border:none;
      font-size: 14px;
      border-bottom: 1px solid #61BFFF;
      outline: none;
      box-shadow: none;
      background: transparent;
      border-radius: 0px;
  }

  /*更改谷歌浏览器input背景*/
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    /*延迟背景颜色载入*/
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
  }

  .user-layout-login {
    label {
      font-size: 14px;
    }
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 90px 40px 40px 40px;
    backface-visibility: hidden;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='rgba(53, 57, 74, 0)', endColorstr='rgb(0, 0, 0)',GradientType=1 );
    box-shadow: -15px 15px 15px rgba(0,0,0,.4);
    transition: all 1s;

    .loginBtn{
      padding: 10px 50px;
      border: 2px solid #4FA1D9;
      border-radius: 50px;
      background: transparent;
      font-size: 14px;
      color: #4FA1D9;
      transition: all .2s;
      margin: 0 auto;
    }

    .bottom{
      display: flex;
      height: 42px;
      justify-content: space-between;
      align-items: center;
    }
    .loginBtn:hover{
      color: white;
      background: #4FA1D9;
      cursor: pointer;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
        text-align: left;
        margin-top: 24px;
        line-height: 22px;

      .item-icon {
          font-size: 24px;
          color: rgba(0,0,0,.2);
          margin-left: 16px;
          vertical-align: middle;
          cursor: pointer;
          transition: color .3s;

        &:hover {
            color: #1890ff;
          }
        }

      .register {
          float: right;
        }
      }
  }

</style>
<style>
  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }
</style>