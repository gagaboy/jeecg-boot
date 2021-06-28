<template>
  <div class="msgCardList">
    <div class="main">
      <ul class="list-wrap">
        <li class="item btn-add">
          <div class="item-content">
            <div class="inner-wrap" v-if="standard" @click="standardCreate">
              <div class="control">
                <img class="icon icon-add" src="./icons/icon-add.svg" />
                <p></p>
              </div>
            </div>
            <!-- <m-link v-else :href="editUrl"> -->
            <div v-else class="inner-wrap">
              <div class="control">
                <img class="icon icon-add" src="./icons/icon-add.svg" />
                <p>新建消息</p>
              </div>
            </div>
            <!-- </m-link> -->
          </div>
        </li>
        <li class="item" v-for="(item, index) in items" :key="item.msgId">
          <div class="item-content">
            <div class="preview" :class="{ 'perview-icon': !standard }">
              <img class="img" :src="item.thumb" />
            </div>
            <div class="main">
              <div class="title" :title="item.title">{{ item.title }}</div>
              <div class="other">
                <p><label>消息ID：</label>{{ item.msgId }}</p>
                <p><label>场景名称：</label>{{ item.sceneName }}</p>
                <p v-show="item.botName"><label>机器人：</label>{{ item.botName }}</p>
                <p v-show="item.signature"><label>签名：</label>{{ item.signature }}</p>
              </div>
            </div>

            <div class="mask">
              <div class="control">
                <div v-show="item.statusId !== 'MmsSubmit'">
                  <div v-if="standard" @click="standardCreate(item)">
                    <img class="icon icon-edit" src="./icons/icon-edit.svg" />
                    <span>编辑</span>
                  </div>
                  <div v-else>
                    <!-- <m-link v-else :href="editUrlItem(item)"> -->
                    <img class="icon icon-edit" src="./icons/icon-edit.svg" />
                    <span>编辑</span>
                    <!-- </m-link> -->
                  </div>
                </div>
                <div v-show="item.statusId === 'MmsOpen'" @click="verifyBefore(item, index)">
                  <img class="icon icon-submit" src="./icons/icon-submit.svg" />
                  <span>提交</span>
                </div>
                <div @click="preview(item, index)">
                  <img class="icon icon-preview" src="./icons/icon-preview.svg" />
                  <span>预览</span>
                </div>
                <div v-show="!standard" @click="delBefore(item, index)">
                  <img class="icon icon-del" src="./icons/icon-del.svg" />
                  <span>删除</span>
                </div>
              </div>
            </div>

            <div class="flag" v-if="standard" :class="item.statusId | stateFormat">
              {{ item.statusId | stateName }}
              <a-tooltip class="tooltip" v-if="item.desc" :title="item.desc">
                <span class="el-icon-warning-outline"></span>
              </a-tooltip>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="pagination_box">
      <a-pagination
        :total="page.total"
        :current="page.current"
        :pageSize="page.pageSize"
        :show-total="(total) => `共 ${total} 条`"
        @change="pageChangeByMsgCardList"
      />
    </div>

    <!-- <m-modal
      title="预览"
      id="previewModal"
      v-model="previewVisible">
      <msgPreview align-center :message-id="activeData.msgId" :api="previewDataUrl" />
    </m-modal> -->
  </div>
</template>
<script>
import { getEnhancedMessage } from '@/api/api'

export default {
  name: 'msgCardList',
  data() {
    return {
      previewVisible: false,
      confirmModal: {
        type: '',
        title: '',
        desc: '',
      },
      activeData: {},
      standard: true,
      page: {
        total: 10,
        current: 0,
        pageSize: 30,
      },
      items: [],
      formParams: {},
    }
  },
  props: {
    targetModal: {
      type: String,
      default: '',
    },
    editUrl: {
      type: String,
      default: '',
    },
    delUrl: {
      type: String,
      default: '',
    },
    previewDataUrl: {
      type: String,
      default: '',
    },
    verifyUrl: {
      type: String,
      default: '',
    },
    searchForm: String,
  },
  computed: {
    pageMaxIndex() {
      let p = this.page.count / this.page.pageSize
      return p < 1 ? 1 : Math.ceil(p) + 1
    },
  },
  mounted() {
    // this.$root.eventBus.$on('pageChangeByMsgCardList', data => {
    //   this.page.pageIndex = data.pageIndex
    //   this.page.pageSize = data.pageSize
    //   this.getData()
    // })
    // if (this.searchForm) {
    //   this.$root.eventBus.$on('search_form_data_' + this.searchForm, data => {
    //     let formParams = {}
    //     if (typeof data.entries === 'function') {
    //       for (let pair of data.entries()) {
    //         let key = pair[0]
    //         let value = pair[1]
    //         if (value === '' || key === 'moquiSessionToken' || key === 'moquiFormName') continue
    //         formParams[key] = value
    //         if (value.split(',').length > 1) {
    //           formParams[pair[0] + '_op'] = 'in'
    //         } else {
    //           formParams[pair[0] + '_op'] = 'includes'
    //         }
    //       }
    //     } else {
    //       formParams = data
    //     }
    //     this.formParams = formParams
    //     this.getData()
    //   })
    // }
    // this.getData()
  },
  filters: {
    // MmsOpen 待提交， MmsSubmit 待审核， MmsApproved 审核通过， MmsReject 审核不通过
    stateFormat(v) {
      if (v === 'MmsOpen') {
        return 'warning'
      } else if (v === 'MmsSubmit') {
        return 'info'
      } else if (v === 'MmsApproved') {
        return 'success'
      } else if (v === 'MmsReject') {
        return 'danger'
      }
    },
    stateName(v) {
      let name
      switch (v) {
        case 'MmsOpen':
          name = '待提交'
          break
        case 'MmsSubmit':
          name = '待审核'
          break
        case 'MmsApproved':
          name = '审核通过'
          break
        case 'MmsReject':
          name = '审核不通过'
          break
      }
      return name
    },
  },
  methods: {
    async getData() {
      try {
        const { data } = await getEnhancedMessage({
          params: {
            ...this.formParams,
            pageIndex: this.page.pageIndex,
            pageSize: this.page.pageSize,
          },
        })
        this.standard = data.messageType === 'standard'
        this.page.count = data.count
        this.items = data.data
      } catch (err) {
        console.log('request err', err)
      }
    },
    preview(item, index) {
      this.previewVisible = true
      this.activeIndex = index
      this.activeData = item
    },
    standardCreate(item) {
      this.$root.eventBus.$emit(`dynamic_visible_change_${this.targetModal}`, {
        title: item ? '编辑' : '新建',
        href: item ? `${this.editUrl}?messageId=${item.msgId}` : this.editUrl,
      })
    },
    editUrlItem(item) {
      return `${this.editUrl}?messageId=${item.msgId}`
    },
    verifyBefore(item, index) {
      this.confirmModal = {
        type: 'verify',
        title: '提交审核',
        desc: '确认提交审核',
      }

      this.activeIndex = index
      this.activeData = item
      this.alertConfirm()
    },
    delBefore(item, index) {
      this.confirmModal = {
        type: 'del',
        title: '删除',
        desc: '确认删除消息',
      }

      this.activeIndex = index
      this.activeData = item
      this.alertConfirm()
    },
    alertConfirm() {
      this.handleConfirm({
        title: this.confirmModal.title,
        content: this.confirmModal.desc,
        onOk: () => {
          this.confirm()
        },
      })
    },
    async confirm() {
      try {
        const { type } = this.confirmModal
        const api = type === 'del' ? this.delUrl : this.verifyUrl

        const { data } = await this.$root.$http.post(api, {
          messageId: this.activeData.msgId,
        })

        if (data.type === 'success') {
          if (type === 'verify') {
            this.activeData.statusId = data.statusId
          } else {
            this.page.pageIndex = 0
            this.getData()
            // this.items.splice(this.activeIndex, 1)
          }
        }

        this.handleMessage(data.messages, data.type)
      } catch (err) {
        this.handleMessage(err.messages, err.type)
      }
    },
  },
  beforeDestroy() {},
}
</script>
<style lang='less' scoped>
.msgCardList {
  .main {
    overflow-x: auto;
  }

  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    min-width: 1175px;
    .item {
      margin-bottom: 20px;
      overflow: hidden;
      min-height: 200px;
    }
    @media (max-width: 1600px) {
      .item {
        flex: 0 0 25%;
      }
    }
    @media (min-width: 1601px) and (max-width: 1920px) {
      .item {
        flex: 0 0 20%;
      }
    }
    @media (min-width: 1921px) and (max-width: 2240px) {
      .item {
        flex: 0 0 16.6%;
      }
    }
    @media (min-width: 2241px) and (max-width: 2560px) {
      .item {
        flex: 0 0 14.28%;
      }
    }
    @media (min-width: 2561px) {
      .item {
        flex: 0 0 12.5%;
      }
    }
    .item-content {
      width: 272px;
      margin: 0 auto;
      position: relative;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      height: 100%;
      background: #fff;
      color: #303133;
      &.blank {
        border: none;
        background: none;
      }
      &:hover {
        .mask {
          visibility: visible;
        }
      }
    }

    .btn-add {
      font-size: 12px;
      .inner-wrap {
        color: #c0c4cc;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }

    .preview {
      font-size: 14px;
      position: relative;
      height: 153px;
      overflow: hidden;
      border-radius: 6px 6px 0 0;
      text-align: center;
      background: #ebeef5;
      .img {
        width: 100%;
        vertical-align: bottom;
      }
      &.perview-icon {
        .img {
          width: 72px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .title {
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .main {
      padding: 8px 16px;
    }

    .other {
      color: #606266;
      font-size: 12px;
      line-height: 1.75;
      label {
        display: inline-block;
        // width:5em;
        // text-align:justify;
        // text-align-last: justify;
        // margin-right: .5em;
      }
    }

    .flag {
      font-size: 12px;
      color: #fff;
      position: absolute;
      top: -1px;
      left: -1px;
      padding: 0.5em 1em;
      width: 108px;
      text-align: center;
      border-radius: 6px 0 3px 0;
      .tooltip {
        font-size: 1.2em;
        position: absolute;
        top: 50%;
        right: 0.6em;
        transform: translate(0, -50%);
      }
      &.warning {
        background: #e6a23c;
      }
      &.info {
        background: #3c64b9;
      }
      &.danger {
        background: #d35656;
        padding-right: 2.2em;
      }
      &.success {
        background: #52bb90;
      }
    }

    .mask {
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.4);
      visibility: hidden;
      text-align: center;
      border-radius: 6px;
      button {
        width: 95px;
        margin-bottom: 15px;
        vertical-align: bottom;
      }
    }

    .control {
      text-align: center;
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .icon {
        width: 12px;
        height: 12px;
      }
      .icon-add {
        width: 24px;
        height: 24px;
      }
      span {
        display: none;
        font-size: 12px;
      }
      div {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background: #fff;
        display: inline-block;
        border-radius: 50%;
        cursor: pointer;
        color: #fff;
        position: relative;
        a:hover {
          color: #fff;
        }
        span {
          width: 100%;
        }
        img,
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        &:hover {
          background: #3c64b9;
          span {
            display: inline;
          }
          .icon {
            display: none;
          }
        }
      }
    }
  }
}
</style>