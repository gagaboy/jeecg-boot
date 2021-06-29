<template>
  <div class="bcat-chat-message-box">
    <div class="message-tip" v-if="tipShow"><a-icon type="question-circle" style="color:#faad14" /> {{tipMessage}} <a-icon type="close" class="delete" @click="tipShow=false" /></div>
    <div class="bcat-chat-message-content" ref="chatWindow">
      <div class="content-empty" v-if="chatMessage.length == 0">
        <div></div>
      </div>
      <template v-for="robot in chatMessage" v-else>
        <chatMessage :class="robot.type" :key="robot.id" :data="robot" />
      </template>
    </div>
    <div class="bcat-chat-message-footer">
      <div class="bact-chat-footer-info">
        <!-- <div class="copyright">Copyright ©2021</div> -->
        <ul class="bact-chat-button-list drop-handle" @mousedown="Drop" @mouseup="noDrop">
          <li v-for="(btn,index) in floatBtnList" :key="index" @click="btnSendMessage(btn)">{{btn.displayText}}</li>
        </ul>
      </div>

      <div class="user-input-wrapper" v-if="!isPreview">
        <div class="user-input-button">
          <i class="iconfont menu" v-if="accountMenuList.length > 0" :class="isMenu ? 'iconinput' : 'iconicon_menu' " @click="isMenu = !isMenu"></i>
        </div>

        <div class="chat-menu-list" v-if="isMenu">
          <template v-for="menu in accountMenuList">
            <a-popover overlay-class-name="chat-menu-popover" trigger="click" :key="menu.order" v-if="menu.submenu.length > 0">
              <template slot="content">
                <ul class="chat-submenu-list">
                  <li v-for="child in menu.submenu" :key="child.order" @click="accountMenuClick(child)">{{child.itemName}}</li>
                </ul>
              </template>
              <div class="chat-menu-title" @click="accountMenuClick(menu)"><i class="iconfont icondrag "></i>{{menu.itemName}}</div>
            </a-popover>
            <div v-else class="chat-menu-title" :key="menu.order"  @click="accountMenuClick(menu)">{{menu.itemName}}</div>
          </template>
        </div>

        <div class="user-input-text" v-else>
          <input class="text" v-model.trim="userSendMessage" @keyup.enter="sendMessage('text')" />
          <div class="send" @click="sendMessage('text')">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"/>
                    <path d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z" fill="#ffffff"/>
                </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { dropMixin } from './mixin'
import chatMessage from './component/message'
export default {
  name: "robot-chat-message-box",
  mixins: [dropMixin],
  components: {
    chatMessage
  },
  props: {
    chatApi: String,
    chatAccount: String,
    chatBot: String,
    previewData: Object,
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chatbotSessionId: undefined,
      userSendMessage: "",
      chatMessage: [],// message,
      floatBtnList: [],
      tipShow: false,
      tipMessage:"",
      isMenu: false,
      btnMessageStyle:"",
      accountMenuList:[],
    }
  },
  inject:['isShare'],
  provide() {
    let _self = this
    return {
      sendCardMessage(data) {
        _self.btnSendMessage(data,data.type)
      }
    }
  },
  watch: {
    previewData: {
      handler:function(newVal) {
        if(this.isPreview) {
          if(JSON.stringify(newVal) != '{}') {
            let receivedData = newVal.retContent
            this.floatBtnList = newVal.buttons
            this.chatMessage = []
            this.dialogMessage({
              "id": Math.random(),
              "content": receivedData,
            },"received")
          } else {
            this.chatMessage = []
            this.floatBtnList = []
          }
        } 
      },
      immediate: true
    }
  },
  methods: {
    accountMenuClick(data) {
      switch(data.itemType) {
        case 'REPLY':
          this.userSendMessage = data.itemName
          this.sendMessage('text')
          break;
        case 'OPEN_URL':
          if(data.openType == 'browser') {
            this.openUrl({
              content: data.href
            })
          }
          break;
      }
    },
    async reloadChatMessage() {
      this.clearMessage()
      if(!this.chatAccount) return
      this.chatbotSessionId = uuidv4()
      let accountUrl = window._CONFIG['chatbotWelcome'] + `${this.chatBot}/${this.chatAccount}`
      const { data } = await axios.get(accountUrl,{withCredentials: false})
      let welcomeData = JSON.parse(data.retContent)
      this.accountMenuList = welcomeData.menu ? JSON.parse(welcomeData.menu) : []
      this.isMenu = this.accountMenuList.length > 0
      if(welcomeData.message == null) return
      welcomeData.message.map(item => {
        this.floatBtnList = JSON.parse(item).buttons
        this.dialogMessage({
          "id": Math.random(),
          "content": item,
        },"received",false)
      })
    },
    clearMessage() {
      this.chatMessage = []
      this.floatBtnList = []
    },
    sendMessage(type,data) {
      if(this.isPreview) return
      if(this.userSendMessage == '') return
      this.dialogMessage({
      "id": Math.random(),
      "content":`{"replyCollection":[{"contentType":"text","contentText":{"content":"${this.userSendMessage}"}}]}`,
      },"sent")

      if(!data) {
        data = {
          "message":this.userSendMessage
        }
      }
      this.fetchChatMessage({
        "contentType": type,
        "content":data,
        "contributionId": this.chatbotSessionId
      })
    },
    openUrl(data) {
      if(this.isShare) {
        location.href = data.content
      } else {
        window.open(data.content,"_blank")
      }
    },
    btnSendMessage(data,type='float') {
      switch(data.type) {
        case 'reply':
          this.userSendMessage = data.description
          this.sendMessage('reply',{
            postback:data.postback
          })
          break;
        case 'url':
          this.openUrl(data)
          break;
        default:
          this.tipBtnMessage(data,type)
          break;
      }
    },
    tipBtnMessage(data,type) {

    },
    dialogMessage(data,type,scroll=true) {
      this.chatMessage.push({...data,"type":type})
      scroll && this.scrollBottom()
    },

    async fetchChatMessage(data) {
      let {data:respData} = await axios.post(this.chatApi + this.chatBot, JSON.stringify(data),{withCredentials: false})
      if(respData.retContent != null) {
        let receivedData = JSON.parse(respData.retContent)
        receivedData.map(item => {
          this.floatBtnList = JSON.parse(item).buttons
          this.dialogMessage({
            "id": Math.random(),
            "content": item,
          },"received")
        })
      }
    },
    scrollBottom() {
      this.$nextTick(function() {
        this.userSendMessage = ""
        setTimeout(()=>{
          if(this.isShare) {
            window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight);
          } else {
            let boxEl = this.$refs.chatWindow
            boxEl.scrollTop = boxEl && boxEl.scrollHeight + 150
          }
        },100)
      })
    },

  }
}
</script>
<style lang="less" >

.bcat-chat-message-box {
  position:relative;
  height: 560px;
  min-height: 560px;
  background-color:#EDF0F5;
  .message-tip {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 30px 8px 15px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    word-wrap: break-word;
    background-color: #fffbe6;
    position: absolute;
    z-index: 100;
    .delete {
      position: absolute;
      right: 8px;
      top: 11px;
    }
  }
  .btn-message-tip {
    position: absolute;
    left: 10%;
    width: 80%;
    padding: 8px 30px 8px 15px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
    border-radius: 10px;
    z-index: 100;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 24px;
  }
}


.bcat-chat-message-box {
  position:relative;
  background-color:#EDF0F5;
}

.bcat-chat-message {
  &-content {
    overflow-y: auto;
    background-size: 100%;
    padding: 20px 10px 40px;
    background-color:#EDF0F5;
    height: calc(100% - 54px);
    ol, ul, dl {
      margin: 0;
    }
    video {
      outline: none;
    }
    .drop-handle {
      cursor:grabbing;
      user-select: none;
    }
    .content-empty {
      color: rgba(0, 0, 0, 0.25);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      line-height: 50px;
    }
  }
  &-footer {
    height: 54px;
    margin: 0;
    position: relative;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background-color:#FFF;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 99;
    .bact-chat-footer-info {
      width: 100%;
      position: absolute;
      bottom: 65px;
      display: flex;
      flex-direction: column;
    }
    .copyright {
      text-align: center;
      width: 100%;
    }
    .bact-chat-button-list {
      display: flex;
      flex-direction: row;
      margin:0 10px;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      li {
        flex:none;
        border-radius: 5px;
        padding: 5px 8px;
        font-size: 12px;
        background-color: #6f99ff;
        color: #fff;
        margin-right: 8px;
        margin-top: 10px;
        cursor: pointer;
      }
    }

    .user-input-wrapper {
      padding: 6px 8px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex:1;
      .user-input-text {
        background-color: #FFF;
        flex:1;
        display: flex;
        flex-direction: row; 
        align-items: center;
        padding: 3px;
        .text {
          flex:1;
          outline: none;
          border:none;
          padding:0 10px;
          background-color: #F4F4F8;
          line-height: 36px;
          height: 36px;
          border-radius: 4px;
          &:focus {
            border:none;
            box-shadow: none;
          }
        }
        .send {
          width: 36px;
          height: 36px;
          background: #6157CC;
          border-radius: 4px;
          display: flex;
          flex-direction: row; 
          align-items: center;
          justify-content: center;
          margin-left: 8px;
          cursor: pointer;
        }
      }
      .user-input-button {
        display: flex;
        flex-direction: row; 
        align-items: center; 
        margin: 0 2px;
        .icon {
          cursor: pointer;
          font-size: 20px;
          margin-right: 10px;
          color: rgb(170, 170, 170);
          &:hover {
            color: rgba(97,87,204,0.8);
          }
        }
        .menu {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.55);
          margin-right: 8px;
          cursor: pointer;
        }
      }
    }
    .chat-menu-list {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      flex:1;
      line-height: 22px;
      .chat-menu-title {
        flex: 1 1 33.33%;
        text-align: center;
        position: relative;
        i {
          margin-right: 3px;
        }
        &::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 16px;
          background-color: #d7d7d7;
          left: 0;
          top: 50%;
          transform: translateY(-8px);
        }
      }
    }
  }
}
.chat-submenu-list {
  margin: 0 -16px;
  li {
    padding:0 16px;
    line-height:40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  li:last-child {
    border-bottom:none
  }
}
.chat-menu-popover {
  .ant-popover-arrow {
    display: none!important;;
  }
}
</style>