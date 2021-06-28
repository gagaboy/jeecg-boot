<template>
  <div class="enhanced-5g">
    <!-- 新增，编辑5g消息 -->
    <messageTemplate v-if="msgTempVisible" :data="tmpData" :botList="botList" @close="closeMsgTemp" />
    <!-- <msgTemp v-if="msgTempVisible" :botList="botList" :data="tmpData" @close="closeMsgTemp" class="msgTemp"></msgTemp> -->
    <a-card v-show="!msgTempVisible" class="e5g-header" :bordered="false">
      <a-form v-filterFormAutoUi="{ expand }">
        <a-row :gutter="24">
          <a-col>
            <a-form-item label="消息名称">
              <a-input placeholder="请输入消息名称" v-model="searchParam.topic" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="5G消息账户">
              <a-select v-model="searchParam.botId" placeholder="请选5G消息账户">
                <a-select-option value="">全部5G消息</a-select-option>
                <a-select-option v-for="item in botList" :key="item.id" :value="item.botId">{{
                  item.bootName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="创建时间">
              <a-range-picker valueFormat="YYYY-MM-DD" v-model="searchParam.createTime" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="编辑时间">
              <a-range-picker valueFormat="YYYY-MM-DD" v-model="searchParam.updateTime" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :style="{ textAlign: 'right' }">
            <a-form-item>
              <a-button type="primary" @click="searchMessage">查询</a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="restSearchParam">重置</a-button>
              <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="expand = !expand">
                {{ expand ? '收起' : '展开' }} <a-icon :type="expand ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <div class="e5g-list" v-show="!msgTempVisible">
      <a-spin :spinning="listLoading">
        <msg-card-list
          messageType="enhanced"
          :data="cardListData"
          @on-add="addMsg"
          @on-preview="previewMsg"
          @on-edit="editMsg"
          @on-delete="deleteMsg"
        >
        </msg-card-list>
      </a-spin>
    </div>
    <a-pagination
      v-show="!msgTempVisible"
      :current="pageCofig.current"
      :total="pageCofig.total"
      :pageSize="pageCofig.pageSize"
      :showSizeChanger="pageCofig.showSizeChanger"
      :showQuickJumper="pageCofig.showQuickJumper"
      :showTotal="pageCofig.showTotal"
      :defaultCurrent="pageCofig.defaultCurrent"
      @change="pageChange"
      @showSizeChange="showSizeChange"
    />
    <a-modal
      dialogClass="previewDialog"
      :closable="false"
      v-model="previewVisible"
      :destroyOnClose="true"
      :footer="null"
    >
      <msgPreview
        :isDialog="true"
        :visible.sync="previewVisible"
        align-center
        messageType="enhanced"
        :data="previewData"
      />
    </a-modal>
  </div>
</template>

<script>
import { getEnhancedMessage, getChatBotList, getPreviewData, delEnhancedMessage } from '@/api/api'
import msgCardList from '../msgCardList'
import msgPreview from '../msgPreview'
import msgTemp from './msgTemlate'
import messageTemplate from '../messageTemplate'

export default {
  components: {
    msgCardList,
    msgPreview,
    msgTemp,
    messageTemplate,
  },
  data() {
    return {
      expand: false,
      botList: [],
      cardListData: [],
      listLoading: false,
      searchParam: {
        topic: '',
        botId: undefined,
        createTime: [],
        updateTime: [],
      },
      pageCofig: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        defaultCurrent: 1,
      },
      tmpData: undefined,
      msgTempVisible: false,
      previewVisible: false,
      previewData: undefined,
    }
  },
  mounted() {
    // 获取5g消息列表
    // this.queryEnhancedMessage()
    // 获取5g消息账户列表 即机器人列表
    // this.queryChatBotList()
    this.initVar()
  },
  methods: {
    // 获取卡片列表
    async queryEnhancedMessage() {
      try {
        this.listLoading = true
        let pageParam = {
          pageIndex: this.pageCofig.current,
          pageSize: this.pageCofig.pageSize,
        }
        let param = {
          topic: this.searchParam.topic,
          botId: this.searchParam.botId,
          createTime_begin: this.searchParam.createTime[0],
          createTime_end: this.searchParam.createTime[1],
          updateTime_begin: this.searchParam.updateTime[0],
          updateTime_end: this.searchParam.updateTime[1],
        }
        const { result } = await getEnhancedMessage({ ...pageParam, ...param })
        this.cardListData = result.records
        this.pageCofig.current = result.current
        this.pageCofig.pageSize = result.size
        this.pageCofig.total = result.total
        this.listLoading = false
      } catch (err) {
        this.listLoading = false
      }
    },
    // 获取机器人列表数据
    async queryChatBotList() {
      try {
        const { result } = await getChatBotList()
        this.botList = result.records
      } catch (err) {}
    },
    // 获取预览的数据
    async queryPreviewData(messageId) {
      try {
        const { result } = await getPreviewData({
          messageId: messageId,
        })
        this.previewData = result
        this.previewVisible = true
      } catch (err) {
        console.log('request err', err)
      }
    },
    // 删除数据
    async delMessage(messageId) {
      try {
        const { result } = await delEnhancedMessage({
          messageId: messageId,
        })
        this.queryEnhancedMessage()
        this.$notification.open({
          message: '删除成功',
          description: '删除消息成功',
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />,
        })
      } catch (err) {
        this.$notification.open({
          message: '删除失败',
          description: '删除消息失败',
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" />,
        })
        console.log('request err', err)
      }
    },
    searchMessage() {
      this.queryEnhancedMessage()
    },
    restSearchParam() {
      this.searchParam = {
        topic: '',
        botId: undefined,
        createTime: [],
        updateTime: [],
      }
      this.queryEnhancedMessage()
    },
    pageChange(page, pageSize) {
      this.pageCofig.current = page
      this.pageCofig.pageSize = pageSize
      this.queryEnhancedMessage()
    },
    showSizeChange(current, size) {
      this.pageCofig.current = current
      this.pageCofig.pageSize = size
      this.queryEnhancedMessage()
    },
    initVar(flag) {
      window.__VAR__ = {}
      let obj = window.__VAR__
      obj.text = {}
      obj.text.arr = this.varTemp()
      obj.text.init = this.varTemp
      obj.url = {}
      obj.url.arr = this.varTemp('url', 10)
      obj.url.init = () => {
        return this.varTemp('url', 10)
      }
      console.log(obj.url)
    },
    // 变量模板
    varTemp(type = 'text', num = 20) {
      const arr = []
      for (let i = 1; i < num + 1; i++) {
        arr.push({
          text: `${type}${i}`,
          times: 0,
        })
      }
      return arr
    },
    addMsg(item) {
      this.tmpData = {
        topic: undefined,
        chatbotId: undefined,
        fallBackFlag: false,
      }
      this.msgTempVisible = true
    },
    previewMsg(item) {
      this.queryPreviewData(item.msgId)
    },
    async editMsg(item) {
      const { result } = await getPreviewData({
        messageId: item.msgId,
      })
      result.fallBackFlag = !!result.fallBackFlag
      this.tmpData = result
      this.msgTempVisible = true
    },
    deleteMsg(item) {
      this.$confirm({
        title: '确认删除',
        content: '确认删除【' + item.title + '】吗？',
        onOk: () => {
          this.delMessage(item.msgId)
        },
        onCancel() {},
      })
    },
    closeMsgTemp(msg) {
      if (msg === 'cancel') this.msgTempVisible = false
      if (msg === 'save') {
        this.msgTempVisible = false
        this.queryEnhancedMessage()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.enhanced-5g {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .e5g-header {
    width: 100%;
    // margin-bottom: 20px;
  }

  .e5g-list {
    width: 100%;
    padding: 24px 0;
  }

  .msgTemp {
    // position: absolute;
    // width: 100%;
    // height: 100%;
    background: #fff;
    z-index: 2;
  }
}
</style>
<style lang="less">
.enhanced-5g .e5g-header .ant-calendar-picker {
  width: auto !important;
}
.enhanced-5g .ant-pagination {
  align-self: flex-end;
}
.m-form-error-tip {
  position: relative;
  padding-top: 6px;
  color: #ed3f14;
}
</style>