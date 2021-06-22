<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="服务大区编码">
              <a-input v-model="queryParam.serviceRegionCode" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="服务大区名称">
              <a-input v-model="queryParam.serviceRegionName" placeholder="" />
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="运营商">
                <a-select v-model="queryParam.operatorId" placeholder="请选择" default-value="0">
                  <a-select-option :value="item.id" v-for="(item, index) in operatorNameList" :key="index">{{
                    item.description
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
              <a-button type="primary" @click="getserviceRegion(1)">查询</a-button>
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

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="() => this.handleModalVisible(true)">添加服务大区</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      :rowKey="(record) => record.id"
      :columns="columns"
      :data="serviceRegionList"
      :data-source="serviceRegionList"
      @onSelect="onChange"
      :pagination="page"
      @change="pageChange"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a style="color: #ff4d4f" @click="deleteItem(record.id)">删除</a>
      </span>
    </a-table>

    <a-modal
      :title="title"
      destroyOnClose
      :visible="visibleCreateModal"
      @ok="handleCreateModalOk"
      @cancel="handleCreateModalCancel"
      :footer="null"
      width="700px"
    >
      <add-operator :editId="editId" @close="handleCreateModalCancel"></add-operator>
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import { operator, region, serviceRegion, deleteServiceRegion } from '@/api/api.js'
import AddOperator from './addOperator'
export default {
  name: 'operator',
  components: {
    AddOperator,
  },
  data() {
    return {
      title: '添加服务大区',
      visibleCreateModal: false,
      visible: false,

      mdl: {},

      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '服务大区编码',
          dataIndex: 'serviceRegionCode',
        },
        {
          title: '服务大区名称',
          dataIndex: 'serviceRegionName',
        },
        {
          title: '运营商',
          dataIndex: 'operatorName',
          needTotal: true,
        },
        {
          title: '大区',
          dataIndex: 'regionName',
          needTotal: true,
        },
        {
          title: 'serverRoot',
          dataIndex: 'serverRoot',
        },
        {
          title: 'fileServerRoot',
          dataIndex: 'fileRoot',
        },
        {
          title: '报备IP',
          dataIndex: 'reportIp',
        },
        {
          title: '上行回调地址',
          dataIndex: 'upCallbackUrl',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        },
      ],

      operatorNameList: [],
      regionNameList: [],
      serviceRegionList: [],
      page: {
        current: 1,
        total: 100,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        defaultCurrent: 1,
      },
      editId: null,
    }
  },
  created() {
    this.getOperator()
    this.getRegion()
    this.getserviceRegion()
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
    getserviceRegion(data) {
      if (data == 1) {
        this.queryParam.pageNo = 1
      } else {
        this.queryParam.pageSize = this.page.pageSize
        this.queryParam.pageNo = this.page.current
      }
      serviceRegion(this.queryParam).then((res) => {
        console.log(res)
        this.serviceRegionList = res.result.records
        this.page.total = res.result.total
        console.log(this.serviceRegionList)
      })
    },
    pageChange(page) {
      console.log(page)
      this.page.current = page.current
      this.page.pageSize = page.pageSize
      this.getserviceRegion()
    },
    handleEdit(id) {
      console.log(id)
      this.editId = id
      this.title = '编辑服务大区'
      // this.mdl = Object.assign({}, record)
      // console.log(this.mdl)
      this.visibleCreateModal = true
    },
    handleOk() {},

    //添加逻辑
    handleModalVisible(isVisible) {
      this.title = '添加服务大区'
      this.visibleCreateModal = isVisible
    },
    handleCreateModalOk() {
      this.visibleCreateModal = false
    },
    handleCreateModalCancel() {
      this.editId = null
      this.visibleCreateModal = false
      this.getserviceRegion()
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
      this.getserviceRegion()
    },
    getdeleteServiceRegion(id) {
      deleteServiceRegion({ id: id }).then((res) => {
        this.getserviceRegion()
      })
    },
    deleteItem(id) {
      let _this = this
      this.$confirm({
        title: '确定删除这条数据吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          _this.getdeleteServiceRegion(id)
          // _this.getserviceRegion()
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
  },
  watch: {},
}
</script>