<template>
  <div class="message-template-space">
    <h3>创建消息模板</h3>
    <div class="template-title">
      <a-form-model ref="messageConfigFrm" layout="inline" :model="data">
        <a-form-model-item label="模板名称" prop="topic" :rules="[{ required: true, message: '模板名称不能为空' }]">
          <a-input placeholder="模板名称" v-model="data.topic" />
        </a-form-model-item>
        <!-- <a-form-model-item label="5G消息账号" prop="botId" :rules="[{ required: true, message: '请选择5G消息账号' }]">
          <a-select placeholder="请选择5G消息账号" v-model="data.botId" style="width: 200px">
            <a-select-option
              v-for="item in botList"
              :key="item.botId"
              :value="item.botId"
              @click="chatbotIdChange(item)"
              >{{ item.bootName }}</a-select-option
            >
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="回落设置">
          <a-switch v-model="data.fallBackFlag" @change="changeFallBackFlag" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <a-tabs class="fullscreen-tab" @change="changeWidget">
      <a-tab-pane key="chatbot" tab="5G消息内容"> </a-tab-pane>
      <a-tab-pane key="fallBack" tab="回落消息内容" v-if="data.fallBackFlag"></a-tab-pane>
    </a-tabs>
    <div class="template-content">
      <div class="template-preview">
        <previewMsgContent :preview-data="previewData" :is-preview="true" />
      </div>
      <div class="template-editor">
        <a-row class="template-message-type">
          <a-col :span="3" class="title">消息类型：</a-col>
          <a-col :span="18">
            <ul class="message-type-select">
              <li :class="[{ active: currentType === 'text' }]" @click="selectMessageType('text', 0)">纯文本</li>
              <li :class="[{ active: currentType === 'image' }]" @click="selectMessageType('image', 1)">图片</li>
              <li :class="[{ active: currentType === 'audio' }]" @click="selectMessageType('audio', 2)">音频</li>
              <li :class="[{ active: currentType === 'video' }]" @click="selectMessageType('video', 3)">视频</li>
              <template v-if="currentWidget == 'chatbot'">
                <li :class="[{ active: currentType === 'location' }]" @click="selectMessageType('location', 4)">
                  位置消息
                </li>
                <li :class="[{ active: currentType === 'file' }]" @click="selectMessageType('file', 5)">文件</li>
                <li :class="[{ active: currentType === 'singleCard' }]" @click="selectMessageType('singleCard', 6)">
                  单卡片
                </li>
                <li :class="[{ active: currentType === 'manyCards' }]" @click="selectMessageType('manyCards', 7)">
                  多卡片
                </li>
              </template>
              <li class="bg" :style="{ left: left + 'px' }"></li>
            </ul>
          </a-col>
        </a-row>

        <a-form-model ref="editForm" :model="messageContent.reply" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
          <card
            v-if="currentType == 'singleCard' || currentType == 'manyCards'"
            :data="messageContent.reply"
            :material="materialData"
            :type="messageContent.replyType"
          />
          <render v-else :data="messageContent.reply" :type="messageContent.replyType" />
        </a-form-model>
        <template v-if="currentWidget == 'chatbot'">
          <div class="dividing-line"><span>屏幕底部浮动菜单</span></div>
          <div class="template-menu">
            <ul class="menu-list" v-if="floatMenuData.length > 0">
              <template v-for="(menu, menuIndex) in floatMenuData">
                <li @click="editMenu(menu, menuIndex)" :key="menuIndex">
                  {{ menu.description }}
                  <a-icon @click.stop="delMenu(menuIndex)" type="close-circle" class="del" theme="filled" />
                </li>
              </template>
            </ul>
            <a-button icon="plus" @click="addMenu">添加菜单</a-button>
          </div>
        </template>
        <a-row class="template-submit">
          <a-col :offset="3">
            <a-button
              type="primary"
              @click="saveTemplate"
              :loading="saveLoading"
              style="padding-left: 20px; padding-right: 20px; margin-right: 16px"
              >提交模板</a-button
            >
            <a-button type="default" @click="cancel" style="padding-left: 20px; padding-right: 20px"
              >返回</a-button
            ></a-col
          >
        </a-row>
      </div>
    </div>
    <catChoose
      ref="catChooseMedia"
      :material-type="materialType"
      @changeType="changeMaterialType"
      propsName="replyCollection"
      :visible.sync="showCatChoose"
      :id="catChooseId"
      :materialList="materialList"
      @select="selectMaterial"
    ></catChoose>

    <a-modal
      title="添加底部菜单"
      :visible="menuVisible"
      :destroyOnClose="true"
      :maskClosable="false"
      width="600px"
      @cancel="menuVisible = false"
      @ok="saveMenu"
    >
      <floatMenu :menu-data="currentMenuData" />
    </a-modal>
  </div>
</template>

<script>
import { getMaterialsByType, saveOrUpdateE5GMsg } from '@/api/api'
import previewMsgContent from '@comp/robotChat/message'
import catChoose from '@views/catDraw/catChoose/catChoose' //素材的弹窗
import { AboutMaterial } from '@views/catDraw/catChoose/aboutMaterial.js' //选择素材的弹窗
import { emojiCharStringLen, emojiCharStringSubstr, getUUID } from '@views/catDraw/util' //新增处理emoji表情等
import render from './render'
import card from './card'
import floatMenu from './menu'

export default {
  name: 'message-template-editor',
  components: {
    previewMsgContent,
    catChoose,
    render,
    card,
    floatMenu,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    botList: Array,
  },
  data() {
    return {
      saveLoading: false,
      acceptUrl: {
        getMaterialsByType,
      },
      materialTypeList: [
        { type: 'text', text: '文本', pos: 0 },
        { type: 'image', text: '图片', pos: 1 },
        { type: 'video', text: '视频', pos: 2 },
        { type: 'audio', text: '音频', pos: 3 },
        { type: 'location', text: '位置消息', pos: 4 },
        { type: 'file', text: '文件', pos: 5 },
        { type: 'singleCard', text: '单卡片', pos: 6 },
        { type: 'manyCards', text: '多卡片', pos: 7 },
      ],
      aboutMaterial: undefined,
      messageContent: {},
      currentWidget: 'chatbot',
      currentType: 'text',
      materialType: undefined,
      left: 0,
      showCatChoose: false,
      catChooseId: getUUID(),
      materialList: {
        imageList: [],
        audioList: [
          {
            auditDesc: '审核通过',
            auditStatus: 2,
            botId: '12580012102002',
            createTime: '2021-01-22 10:44:12',
            delStatus: '1',
            materialFileContentType: 'video/mp4',
            materialFileProperty: {
              fileName: '暴雪预警视频_1611283441373.mp4',
              cspMediaUrl: 'http://124.71.47.200/group1/M00/00/02/wKgA1mAKO_uAfMU0ADDdd4Br-4Q823.mp4',
              cspThumbnailMediaUrl: 'http://124.71.47.200/group1/M00/00/02/wKgA1mAKO_uABZCkAAAk6EYP1p4484.jpg',
              mediaUrl: 'http://47.103.149.126:8001/bot/v1/medias/fid/512425991630987264',
              thumbnailMediaContentType: 'image/jpeg',
              thumbnailMediaUrl: 'http://47.103.149.126:8001/bot/v1/medias/fid/512425990758572032',
              materialId: '198511375427989504',
              thumbnailUntil: '2099-12-30T12:17:07Z',
              imosMediaUrl: 'http://124.71.47.200/group1/M00/00/02/wKgA1mAKO_uAfMU0ADDdd4Br-4Q823.mp4',
              fileSize: 3202423,
              clientCorrelator: '198212455455944704',
              notifyUrl: 'http://124.71.47.200:8082/material/callbackInterface',
              until: '2099-12-30T12:17:07Z',
              mediaContentType: 'video/mp4',
              contentType: 'video/mp4',
              thumbnailFileSize: 9448,
              playingLength: 19,
              imosThumbnailMediaUrl: 'http://124.71.47.200/group1/M00/00/02/wKgA1mAKO_uABZCkAAAk6EYP1p4484.jpg',
            },
            materialFileSize: '3202423',
            materialFileType: 'mp4',
            materialId: '198511375427989504',
            materialName: '暴雪预警视频_1611283441373',
            materialType: 'video',
            materialUrl: 'http://124.71.47.200/group1/M00/00/02/wKgA1mAKO_uAfMU0ADDdd4Br-4Q823.mp4',
            thumbnailContentType: 'image/jpeg',
            thumbnailUrl: 'http://124.71.47.200/group1/M00/00/02/wKgA1mAKO_uABZCkAAAk6EYP1p4484.jpg',
            updateTime: '2021-01-22 10:45:00',
          },
        ],
        videoList: [],
        fileList: [],
      },
      materialData: {},
      dataCeche: {
        chatbot: {
          type: undefined,
          data: '',
        },
        fallBack: {
          type: undefined,
          data: '',
        },
      },
      menuIndex: undefined,
      menuVisible: false,
      currentMenuData: {},
      floatMenuData: [], // 浮动菜单
    }
  },
  provide() {
    let _self = this
    return {
      isShare: false,
      selectMaterialModal(type) {
        _self.selectMaterialModal(type)
      },
    }
  },
  created() {
    this.aboutMaterial = new AboutMaterial(this)
    console.log(this.data)
    this.data.botId && this.getAllMaterial(this.data.botId)
    if (this.data.id) {
      let massMessage = JSON.parse(this.data.massMessage)
      this.messageContent = massMessage.replyCollection[0]
      this.currentType = this.messageContent.replyType
      this.floatMenuData = massMessage.buttons

      let fallBackContent = JSON.parse(this.data.fallBackContent)[0]
      this.dataCeche['fallBack'].type = fallBackContent.replyType
      this.dataCeche['fallBack'].data = JSON.stringify(fallBackContent)
      this.navMove()
    } else {
      this.messageContent = {
        replyType: 'text',
        reply: {},
      }
    }
  },
  computed: {
    previewData() {
      if ('{}' == JSON.stringify(this.messageContent.reply)) {
        return {}
      } else {
        return {
          retContent: `{"replyCollection":[${JSON.stringify(this.messageContent)}]}`,
          buttons: this.floatMenuData,
        }
      }
    },
  },
  methods: {
    changeMaterialType(val) {
      this.materialType = val
    },
    chatbotIdChange(val) {
      this.getAllMaterial(val.botId)
    },
    selectMaterial(data) {
      console.log(data)
      if (['image', 'video', 'audio', 'file'].indexOf(this.currentType) < 0) {
        this.materialData = { type: this.materialType, ...data }
      } else {
        this.messageContent.reply = { mediaType: this.currentType, ...data.materialObj }
      }
      this.materialType = 'image'
      this.$refs.editForm.resetFields()
    },
    selectMaterialModal(type) {
      // if (this.data.botId) {
      this.materialType = type
      this.showCatChoose = true
      // } else {
      //   this.$message.error('请选择5G消息账号')
      // }
    },
    validate(frm) {
      return new Promise((resolve, reject) => {
        this.$refs[frm].validate(async (valid) => {
          resolve(valid)
        })
      })
    },

    async saveTemplate() {
      const configValidate = await this.validate('messageConfigFrm')
      const contentValidate = await this.validate('editForm')
      if (configValidate && contentValidate) {
        let formData = new FormData()
        formData.append('id', this.data.id)
        formData.append('chatbotId', this.data.botId) //5g账号id
        formData.append('topic', this.data.topic) // 模板名称
        let replyCollection, fallBackContent
        if (this.currentWidget == 'chatbot') {
          replyCollection = this.messageContent
          fallBackContent = this.dataCeche['fallBack'].data != '' ? JSON.parse(this.dataCeche['fallBack'].data) : ''
        } else {
          replyCollection = JSON.parse([this.dataCeche['chatbot'].data])
          fallBackContent = this.messageContent
        }
        formData.append('replyCollection', JSON.stringify([replyCollection]))
        formData.append('buttons', JSON.stringify(this.floatMenuData))
        formData.append('fallBackFlag', this.data.fallBackFlag ? 1 : 0)
        if (this.data.fallBackFlag) {
          formData.append('fallBackContent', JSON.stringify([fallBackContent]))
        }

        formData.append('convertSmsFlag', 0)
        formData.append('convertSmsContent', '')
        formData.append('textParamList', '[]')
        formData.append('urlParamList', '[]')
        console.log(this.messageContent)

        // const { success, message } = await saveOrUpdateE5GMsg(formData)

        // if (success) {
        //   this.$notification.open({
        //     message: '保存成功',
        //     description: '保存消息成功',
        //     icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />,
        //   })
        //   this.$emit('close', 'save')
        // } else {
        //   this.saveLoading = false
        //   this.$notification.open({
        //     message: '保存失败',
        //     description: message,
        //     icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" />,
        //   })
        // }
      }
    },
    changeWidget(val) {
      this.dataCeche[this.currentWidget].data = JSON.stringify(this.messageContent)
      this.dataCeche[this.currentWidget].type = this.currentType
      this.currentWidget = val
      if (this.dataCeche[val].data == '') {
        this.currentType = this.dataCeche[val].type = 'text'
        this.messageContent = {
          replyType: 'text',
          reply: {},
        }
      } else {
        this.currentType = this.dataCeche[val].type
        this.messageContent = JSON.parse(this.dataCeche[val].data)
      }
      this.navMove()
    },
    changeFallBackFlag(val) {
      if (!val) {
        this.currentWidget = 'chatbot'
      }
    },
    selectMessageType(val, index) {
      console.log(val)
      this.left = index * 68
      this.dataCeche[this.currentWidget][this.currentType] = JSON.stringify(this.messageContent)
      if (!this.dataCeche[this.currentWidget][val]) {
        this.messageContent = {
          replyType: val,
          reply: {},
        }
      } else {
        this.messageContent = JSON.parse(this.dataCeche[this.currentWidget][val])
      }
      this.currentType = val
      this.$refs.editForm.clearValidate()
    },
    // 获取所有的素材列表 选择文件的列表
    getAllMaterial(botId) {
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
    cancel() {
      this.$emit('close', 'cancel')
    },
    delMenu(index) {
      this.floatMenuData.splice(index, 1)
    },
    editMenu(data, index) {
      this.menuIndex = index
      this.menuVisible = true
      this.currentMenuData = { ...data }
    },
    saveMenu() {
      if (this.menuIndex != undefined) {
        this.floatMenuData.splice(this.menuIndex, 1, { ...this.currentMenuData })
      } else {
        this.floatMenuData.push({
          ...this.currentMenuData,
        })
      }
      this.menuVisible = false
    },
    addMenu() {
      this.menuIndex = undefined
      this.menuVisible = true
      this.currentMenuData = {
        type: 'reply',
      }
    },
    navMove() {
      let currentType = this.materialTypeList.filter((item) => item.type == this.currentType)
      let pos = currentType[0].pos
      this.left = pos * 68
    },
  },
}
</script>

<style lang="less">
.message-template-space {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  h3 {
    margin: 0 0 10px;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .template-content {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
    .template-preview {
      width: 340px;
      height: 633px;
      margin: 0 10px 0 30px;
      background-image: url(./img/phone_bg.png);
      background-size: 100% 100%;
      padding: 32px 11px 0 13px;
      .bcat-chat-message-box {
        height: 570px;
        min-height: 570px;
        border-radius: 16px;
        background-color: #edf0f587;
      }
      .bcat-chat-message-content {
        height: 100% !important;
        background: none;
      }
      .bcat-chat-message-footer {
        background: none;
      }
    }
    .template-editor {
      flex: 1;
      width: 648px;
    }
    .template-message-type {
      margin-bottom: 24px;
      .title {
        text-align: right;
        line-height: 32px;
      }
      .message-media-list {
        display: flex;
        flex-direction: row;
        .select-media-btn {
          width: 90px;
          height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fafafa;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          border-radius: 4px;
          margin-right: 15px;
          &:hover {
            border-color: rgb(146, 146, 146);
          }
        }
      }
    }
  }
  .message-type-select {
    display: inline-flex;
    flex-direction: row;
    background-color: #f6f5fc;
    border-radius: 5px;
    position: relative;
    margin: 0;
    margin-right: 8px;
    height: 32px;
    li {
      width: 68px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border: 1px solid transparent;
      z-index: 2;
      cursor: pointer;
      color: #999;
      transition: all 0.25s;
      font-size: 14px;
      &.active {
        color: #6157cc;
        font-weight: 700;
      }
    }
    .bg {
      position: absolute;
      border-radius: 5px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 0;
      transition: all 0.2s ease-out;
      box-shadow: 0px 3px 6px -2px rgba(13, 8, 57, 0.12);
    }
  }
  .dividing-line {
    margin: 0 0 10px 0;
    height: 30px;
    line-height: 30px;
    position: relative;
    text-align: center;
  }

  .dividing-line span {
    display: inline-block;
    width: 200px;
    font-size: 13px;
    background: #fff;
    color: #909399;
  }

  .dividing-line:before {
    left: 0;
  }

  .dividing-line:after,
  .dividing-line:before {
    position: absolute;
    content: '';
    width: calc(50% - 60px);
    top: 15px;
    border-top: 1px dashed #e4e7ed;
  }

  .dividing-line:after {
    right: 0;
  }
  .template-menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 50px;
  }
  .menu-list {
    display: flex;
    flex-direction: row;
    li {
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #f8f9fd;
      margin: 0 8px;
      position: relative;
      padding: 0 10px;
      cursor: pointer;
      &:hover {
        background-color: #eaefff;
      }
      .del {
        cursor: pointer;
        position: absolute;
        right: -3px;
        top: -3px;
        &:hover {
          color: #f00;
        }
      }
    }
  }
}
</style>