<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="企业名称">
              <a-input v-model="queryParam.entName" placeholder="请输入企业名称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="所属行业">
              <a-cascader
                v-model="industryList"
                :field-names="{ label: 'name', value: 'id', children: 'children' }"
                :options="industryOptions"
                placeholder="请选择所属行业"
                @change="industryChange"
              />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属行业">
                <a-cascader
                  v-model="industryList"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
                  :options="industryOptions"
                  placeholder="请选择所属行业"
                  @change="industryChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="企业状态">
                <a-select placeholder="请选择" v-model="queryParam.status">
                  <a-select-option :value="0">启用</a-select-option>
                  <a-select-option :value="1">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="getentInfoList(1)">查询</a-button>
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
      <a-button type="primary" icon="plus" @click="showDrawer">新建</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :rowKey="(record) => record.id"
      :pagination="page"
      @change="pageChange"
      table-layout="fixed"
    >
      <span slot="action" slot-scope="row">
        <a @click="showEditVisible(row.id)">编辑</a>
        <a-divider type="vertical" />
        <a @click="showModal(row.id)">查看</a>
        <a-divider type="vertical" />
        <a-popconfirm :title="`确认${Number(row.status) === 0 ? '禁用' : '启用'}该客户？`" @confirm="statusChange(row)">
          <a-icon
            slot="icon"
            type="question-circle"
            :style="{ color: Number(row.status) === 1 ? '#ff7875' : '#1890FF' }"
          />
          <a-button type="link" :style="{ color: Number(row.status) === 0 ? '#ff7875' : '#1890FF' }" size="small">{{
            Number(row.status) == 0 ? '禁用' : '启用'
          }}</a-button>
        </a-popconfirm>
        <!-- 
        <a-divider type="vertical" />
        <a @click="showDeleteConfirm">删除</a> -->
        <!-- <a-divider type="vertical" />
        <a class="ant-dropdown-link"> 更多<a-icon type="down" /> </a> -->
      </span>
    </a-table>
    <!-- 编辑抽屉 -->
    <div>
      <a-drawer
        title="新增企业信息"
        :width="1000"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="onClose"
      >
        <enterprise-info :visible="visible" @changevisible="addOnClose"></enterprise-info>

        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="onClose"> 关闭 </a-button>
        </div>
      </a-drawer>
      <a-drawer
        title="编辑企业信息"
        :width="1000"
        :visible="editVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="onClose"
      >
        <edit-info :editItem="editItem" @changeEditVisible="addOnClose"></edit-info>

        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="onClose"> 关闭 </a-button>
        </div>
      </a-drawer>
      <a-modal v-model="lookvisible" title="企业信息" width="1000px" @ok="handleOk">
        <look-info :editItem="editItem"></look-info>
      </a-modal>
    </div>
  </a-card>
</template>

<script>
import enterpriseInfo from './enterpriseInfo'
import editInfo from './editInfo.vue'
import lookInfo from './lookInfo'
import { entInfoList, updateStatus, entInfoId, industryList, areaList } from '@/api/api.js'
const columns = [
  {
    title: '企业全称',
    dataIndex: 'entName',
    key: 'entName',
  },
  {
    title: '企业简称',
    dataIndex: 'abbrName',
    key: 'abbrName',
  },
  {
    title: '所属行业',
    dataIndex: 'industryName',
    key: 'index',
  },
  {
    title: '企业电话',
    dataIndex: 'entPhone',
    key: 'industry',
  },
  {
    title: '企业地址',
    key: 'address',
    dataIndex: 'address',
  },
  {
    title: '创建人',
    key: 'createBy',
    dataIndex: 'createBy',
  },
  {
    title: '创建时间',
    key: 'createTime',
    ellipsis: true,
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    key: 'updateTime',
    ellipsis: true,
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    width: '180px',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'enterprise',
  components: {
    enterpriseInfo,
    lookInfo,
    editInfo,
  },

  data() {
    return {
      industryOptions: [],
      industryList: [],
      options: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        pageSize: null,
        pageNo: null,
      },

      selectedRowKeys: [],
      selectedRows: [],
      data: [],
      columns,
      form: this.$form.createForm(this),
      visible: false,
      currentTab: 0,

      // form
      form: null,
      lookvisible: false,
      page: {
        current: 1,
        total: 100,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        defaultCurrent: 1,
      },
      editVisible: false,
      editItem: {},
    }
  },
  created() {
    this.getentInfoList()
    this.getindustryList()
    this.getareaList()
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    getindustryList() {
      industryList().then((res) => {
        this.industryOptions = res.result
        window.sessionStorage.setItem('industryOptions', JSON.stringify(res.result))
      })
    },
    getareaList() {
      areaList().then((res) => {
        // this.options = res.result
        window.sessionStorage.setItem('options', JSON.stringify(res.result))
      })
    },
    industryChange(value) {
      console.log(value)
      if (value) {
        this.queryParam.industry = value[1]
      }
    },
    getentInfoList(data) {
      if (data == 1) {
        this.queryParam.pageNo = 1
      } else {
        this.queryParam.pageSize = this.page.pageSize
        this.queryParam.pageNo = this.page.current
      }

      entInfoList(this.queryParam).then((res) => {
        console.log(res)
        this.data = res.result.records
        this.page.total = res.result.total
      })
    },
    // 分页
    pageChange(page) {
      console.log(page)
      this.page.current = page.current
      this.page.pageSize = page.pageSize
      this.getentInfoList()
    },
    async statusChange(row) {
      if (row.status == 0) {
        row.status = 1
      } else {
        row.status = 0
      }
      updateStatus({ id: row.id, status: row.status }).then((res) => {
        console.log(res)
      })
    },
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
      this.editVisible = false
    },
    addOnClose() {
      this.getentInfoList()
      this.visible = false
      this.editVisible = false
    },
    // 搜索重置
    resetSearchForm() {
      this.queryParam.entName = ''
      this.queryParam.industry = ''
      this.industryList = []
      this.queryParam.status = null
      this.getentInfoList()
    },
    showDeleteConfirm() {
      this.$confirm({
        title: '确定删除这条数据吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    showModal(entId) {
      entInfoId({ entId: entId }).then((res) => {
        this.editItem = res
        this.lookvisible = true
      })
    },
    handleOk(e) {
      console.log(e)
      this.lookvisible = false
    },
    showEditVisible(entId) {
      entInfoId({ entId: entId }).then((res) => {
        this.editItem = res
        this.editVisible = true
      })
    },
  },
}
</script>