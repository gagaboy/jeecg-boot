<template>
  <div class="msgCardList">
    <div class="main">
      <ul class="list-wrap">
        <li class="item btn-add">
          <div class="item-content">
            <div class="inner-wrap" @click="add">
              <div class="control">
                <img class="icon icon-add" src="./icons/icon-add.svg" />
                <p style="margin-top: 10px; font-size: 14px">新建消息</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item" v-for="item in data" :key="item.msgId">
          <div class="item-content">
            <div class="preview" :class="{ 'perview-icon': messageType === 'enhanced' }">
              <img class="img" v-if="messageType === 'standard'" :src="item.posterUrl" />
              <img class="img" v-if="messageType === 'enhanced'" :src="item.thumb" />
            </div>
            <div class="main">
              <template v-if="messageType === 'standard'">
                <div class="title" :title="item.tmplTitle" style="margin-bottom: 16px">{{ item.tmplTitle }}</div>
                <div class="title" :title="item.id" style="margin-bottom: 6px; font-weight: bold">
                  模板ID：{{ item.id }}
                </div>
              </template>
              <div class="title" v-if="messageType === 'enhanced'" :title="item.title">{{ item.title }}</div>
              <div class="other" v-if="messageType === 'standard'">
                <!--  && item.oprStatus !== null -->
                <!-- <label>创建时间：</label>{{item.createTime}} -->
                <status-dot
                  v-for="opt in operators"
                  :key="opt.value"
                  :status="statusFormat(item.oprStatus ? item.oprStatus[opt.value] : '')"
                  >{{ opt.label }}</status-dot
                >
              </div>
              <div class="other" v-if="messageType === 'enhanced'">
                <div>
                  <label>5G消息账号：</label>
                  {{ item.botId }}
                </div>
                <div>
                  <label>编辑时间：</label>
                  {{ item.createTime }}
                </div>
              </div>
            </div>

            <div class="mask">
              <div class="controls">
                <!-- // 0 待提交， 1 待审核， 2 审核通过， 3 审核不通过 -->
                <a-tooltip title="预览">
                  <div @click="preview(item)">
                    <svg
                      class="icon"
                      height="200.00px"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#909399"
                        d="M512 192C298.666667 192 116.48 324.693333 42.666667 512c73.813333 187.306667 256 320 469.333333 320s395.52-132.693333 469.333333-320c-73.813333-187.306667-256-320-469.333333-320zM512 725.333333c-117.76 0-213.333333-95.573333-213.333333-213.333333s95.573333-213.333333 213.333333-213.333333 213.333333 95.573333 213.333333 213.333333-95.573333 213.333333-213.333333 213.333333z m0-341.333333c-70.826667 0-128 57.173333-128 128s57.173333 128 128 128 128-57.173333 128-128-57.173333-128-128-128z"
                      />
                    </svg>
                  </div>
                </a-tooltip>

                <a-tooltip title="提交" v-if="item.status === '0'">
                  <div @click="submit(item)">
                    <svg
                      class="icon"
                      height="200.00px"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#909399"
                        d="M384 682.666667h256v-256h170.666667l-298.666667-298.666667-298.666667 298.666667h170.666667z m-170.666667 85.333333h597.333334v85.333333H213.333333z"
                      />
                    </svg>
                  </div>
                </a-tooltip>

                <a-tooltip title="编辑" v-if="item.status === '0' || messageType === 'enhanced'">
                  <div @click="edit(item)">
                    <svg
                      class="icon"
                      height="200.00px"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#909399"
                        d="M128 736V896h160L759.893333 424.106667l-160-160L128 736zM883.626667 300.373333a42.496 42.496 0 0 0 0-60.16l-99.84-99.84a42.496 42.496 0 0 0-60.16 0l-78.08 78.08 160 160 78.08-78.08z"
                      />
                    </svg>
                  </div>
                </a-tooltip>

                <template
                  v-if="
                    item.status === '0' &&
                    (item.status === '0' || messageType === 'enhanced') &&
                    messageType === 'standard' &&
                    ((item.status === '0' && !item.externalTmplId) || item.status === '3' || messageType === 'enhanced')
                  "
                >
                  <a-dropdown placement="bottomCenter">
                    <div>
                      <svg
                        class="icon"
                        viewBox="64 64 896 896"
                        data-icon="ellipsis"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M176 511a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0z"
                        ></path>
                      </svg>
                    </div>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <div @click="copy(item)">复制</div>
                      </a-menu-item>
                      <a-menu-item>
                        <div @click="del(item)">删除</div>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </template>

                <template v-else>
                  <a-tooltip title="复制" v-if="messageType === 'standard'">
                    <div @click="copy(item)">
                      <svg
                        class="icon"
                        style="width: 12px; height: 12px"
                        height="200.00px"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#909399"
                          d="M928 0c53.02 0 96 42.98 96 96v576c0 53.02-42.98 96-96 96H352c-53.02 0-96-42.98-96-96V96c0-53.02 42.98-96 96-96h576M352 832c-88.224 0-160-71.776-160-160V256H96c-53.02 0-96 42.98-96 96v576c0 53.02 42.98 96 96 96h576c53.02 0 96-42.98 96-96v-96H352z"
                        />
                      </svg>
                    </div>
                  </a-tooltip>

                  <a-tooltip
                    title="删除"
                    v-if="
                      (item.status === '0' && !item.externalTmplId) || item.status === '3' || messageType === 'enhanced'
                    "
                  >
                    <div @click="del(item)">
                      <svg
                        class="icon"
                        style="width: 16px; height: 16px"
                        height="200.00px"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#909399"
                          d="M640 682.666667h170.666667v85.333333h-170.666667z m0-341.333334h298.666667v85.333334h-298.666667z m0 170.666667h256v85.333333h-256zM128 768c0 46.933333 38.4 85.333333 85.333333 85.333333h256c46.933333 0 85.333333-38.4 85.333334-85.333333V341.333333H128v426.666667zM597.333333 213.333333h-128l-42.666666-42.666666H256L213.333333 213.333333H85.333333v85.333334h512z"
                        />
                      </svg>
                    </div>
                  </a-tooltip>
                </template>
              </div>
            </div>

            <div class="flag" v-if="messageType === 'standard'" :class="item.status | stateFormat">
              {{ item.status | stateName }}
              <a-tooltip
                class="tooltip"
                v-if="
                  (item.status === '3' || item.status === '1' || item.status === '2') &&
                  (item.oprRejectReason.length || item.rejectReason)
                "
              >
                <!--  @mouseenter.native="fetchRejectReason(item)" -->
                <a-icon type="exclamation-circle" style="cursor: help" />

                <template #title>
                  <!-- <template v-if="item.supportAll === '1'"> -->
                  <p v-for="(item, key) in item.oprRejectReason" :key="key">
                    {{ getOperator(item.name) }}：{{ item.reason }}
                  </p>
                  <!-- </template> -->
                  <!-- <template v-else>
                    <span>{{item.rejectReason}}</span>
                  </template> -->
                </template>
              </a-tooltip>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import StatusDot from '@comp/statusDot'
import { getRejectReasons } from '@api/api'

export default {
  name: 'msgCardList',
  components: {
    StatusDot,
  },

  props: {
    messageType: String,
    data: Array,
  },
  data() {
    return {
      operators: [
        { label: '移动', value: 'cmcc' },
        { label: '联通', value: 'cucc' },
        { label: '电信', value: 'ctcc' },
      ],
      reasonLoading: false,
    }
  },

  mounted() {},
  filters: {
    // 0 待提交， 1 待审核， 2 审核通过， 3 审核不通过
    stateFormat(v) {
      if (v === '0') {
        return 'warning'
      } else if (v === '1') {
        return 'info'
      } else if (v === '2') {
        return 'success'
      } else if (v === '3') {
        return 'danger'
      }
    },
    stateName(v) {
      let name
      switch (v) {
        case '0':
          name = '待提交'
          break
        case '1':
          name = '待审核'
          break
        case '2':
          name = '审核通过'
          break
        case '3':
          name = '审核不通过'
          break
      }
      return name
    },
  },
  methods: {
    moment,
    preview(item) {
      this.$emit('on-preview', item)
    },
    add(item) {
      this.$emit('on-add')
    },
    edit(item) {
      this.$emit('on-edit', item)
    },
    submit(item) {
      this.$emit('on-submit', item)
    },
    del(item) {
      this.$emit('on-delete', item)
    },
    copy(item) {
      this.$emit('on-copy', item)
    },

    getOperator(opt) {
      return (this.operators.find((operator) => operator.value === opt) || {}).label || ''
    },
    statusFormat(status) {
      if (status === '2') {
        return 'success'
      } else if (status === '3') {
        return 'error'
      } else {
        return ''
      }
    },

    // 获取审核不通过原因
    async fetchRejectReason(item) {
      if (item.oprRejectReason !== null && typeof item.oprRejectReason === 'object') {
        // if(typeof item.oprRejectReason === 'object'){
        item.oprRejectReason = item.oprRejectReason
        // }else{
        // item.oprRejectReason = JSON.parse(item.oprRejectReason)
        // }
      } else {
        this.reasonLoading = true

        let { id } = item

        let fd = new FormData()
        fd.append('messageId', id)

        let { code, message } = await getRejectReasons(fd)

        let _results = {
          cucc: '联通审核不通过',
          ctcc: '电信也说不通过',
        }

        if (code === 200) {
          item.oprRejectReason = message
            ? JSON.parse(message).oprRejectReason
              ? JSON.parse(JSON.parse(message).oprRejectReason)
              : {}
            : {} // result.oprRejectReason
        }

        this.reasonLoading = false
      }
    },
  },
  beforeDestroy() {},
}
</script>
<style lang='less'>
.msgCardList {
  .main {
    overflow-x: auto;
  }

  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    min-width: 1175px;
    padding: 0;
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
      display: flex;
      flex-direction: column;
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
    }

    .title {
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
      top: 0;
      left: 0;
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
        background: #3c64b9;
      }
      &.info {
        background: #e6a23c;
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
      text-align: center;
      button {
        width: 95px;
        margin-bottom: 15px;
        vertical-align: bottom;
      }
    }

    .control {
      text-align: center;
      position: absolute;
      line-height: 1;
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
    }

    .controls {
      display: flex;
      justify-content: center;
      background-color: #f7f7f7;
      border-top: 1px solid rgba(0, 0, 0, 0.07);
      .icon {
        width: 16px;
        height: 16px;
        color: #909399;
      }
      div {
        flex: 1;
        width: 48px;
        height: 20px;
        line-height: 24px;
        margin: 10px 0;
        display: inline-block;
        cursor: pointer;
        position: relative;
        &:hover .icon path {
          fill: #0018ff;
        }
        &:not(:last-child) {
          border-right: 1px solid #e4e2e4;
        }
      }
    }
  }
}
</style>
