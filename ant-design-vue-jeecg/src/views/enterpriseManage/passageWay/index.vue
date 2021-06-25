<template>
  <div :bordered="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="企业名称">
                <a-input v-model="queryParam.entName" placeholder="请输入企业名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="通道名称">
                <a-input v-model="queryParam.channelName" placeholder="请输入通道名称" />
              </a-form-item>
            </a-col>

            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="通道类型">
                  <a-select placeholder="请选择" v-model="queryParam.channelType">
                    <a-select-option :value="item.id" v-for="(item, index) in channelTypeListData" :key="index">{{
                      item.itemText
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="getChannelList(1)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card style="margin-top: 20px">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="() => this.handleModalVisible(true)">新建</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        :rowKey="(record) => record.channelId"
        :columns="columns"
        :data="channelListData"
        :data-source="channelListData"
        @onSelect="onChange"
        :pagination="page"
        @change="pageChange"
      >
        <span slot="chatbotAccountList" slot-scope="record">
          <div v-for="(item, index) in record" :key="index">{{ index + 1 + '. ' + item.chatbotName }}</div>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a style="color: #ff4d4f" @click="deleteItem(record.channelId)">删除</a>
        </span>
      </a-table>
    </a-card>

    <a-modal
      :title="title"
      destroyOnClose
      :width="800"
      :visible="visibleCreateModal"
      :footer="null"
      @ok="handleCreateModalOk"
      @cancel="handleCreateModalCancel"
    >
      <add-passage-way :editId="editId" @close="handleCreateModalCancel"></add-passage-way>
    </a-modal>
  </div>
</template>

<script>
import { channelList, deleteChannel, channelTypeList } from '@/api/api'
import AddPassageWay from './addPassageWay'
export default {
  name: 'passageWay',
  components: {
    AddPassageWay,
  },
  data() {
    return {
      page: {
        current: 1,
        total: 100,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        defaultCurrent: 1,
      },
      title: '新建通道信息',
      visibleCreateModal: false,
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '企业Logo',
          dataIndex: 'entLogoUrl',
        },
        {
          title: '企业名称',
          dataIndex: 'entName',
        },
        {
          title: '通道名称',
          dataIndex: 'channelName',

          needTotal: true,
        },
        {
          title: '通道类型',
          dataIndex: 'channelTypeName',
          needTotal: true,
        },
        {
          title: '关联账号',
          dataIndex: 'chatbotAccountList',
          scopedSlots: { customRender: 'chatbotAccountList' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        },
      ],

      selectedRowKeys: [],
      selectedRows: [],
      channelListData: [],
      editId: null,
      channelTypeListData: [],
    }
  },
  created() {
    this.getChannelList()
    this.getChannelTypeList()
  },
  methods: {
    getChannelTypeList() {
      channelTypeList().then((res) => {
        this.channelTypeListData = res.result
      })
    },
    getChannelList(data) {
      if (data == 1) {
        this.queryParam.pageNo = 1
      } else {
        this.queryParam.pageSize = this.page.pageSize
        this.queryParam.pageNo = this.page.current
      }
      channelList(this.queryParam).then((res) => {
        console.log(res)
        this.channelListData = res.result.records
        this.page.total = res.result.total
      })
    },
    handleEdit(record) {
      console.log(record)
      this.editId = record
      this.title = '编辑通道信息'
      this.visibleCreateModal = true
    },
    handleOk() {},

    //添加逻辑
    handleModalVisible(isVisible) {
      this.editId = null
      this.title = '新建通道信息'
      this.visibleCreateModal = isVisible
    },
    handleCreateModalOk() {
      this.createForm.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        const description = this.createForm.getFieldValue('description')
        axios
          .post('/saveRule', {
            desc: description,
          })
          .then((res) => {
            this.createForm.resetFields()
            this.visibleCreateModal = false
            this.loadRuleData()
          })
      })
    },
    handleCreateModalCancel() {
      this.visibleCreateModal = false
      this.editId = null
      this.getChannelList()
    },

    onChange(row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows

      console.log(this.$refs.table)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    resetSearchForm() {
      this.queryParam = {}
    },
    getDeleteChannel(channelId) {
      deleteChannel({ channelId: channelId }).then((res) => {
        console.log(res)
        this.getChannelList()
      })
    },
    deleteItem(channelId) {
      let _this = this
      this.$confirm({
        title: '确定删除这条数据吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          _this.getDeleteChannel(channelId)
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    pageChange(page) {
      this.page.current = page.current
      this.page.pageSize = page.pageSize
      this.getChannelList()
    },
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  },
}
</script>