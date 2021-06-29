<template>
  <div>
    <a-card :bordered="false" style="margin-bottom: 24px">
      <a-tabs default-active-key="1" @change="callback" :animated="false" id="materail" style="margin: -26px 0 10px 0">
        <a-tab-pane key="1" tab="图片"></a-tab-pane>
        <a-tab-pane key="2" tab="视频"></a-tab-pane>
        <a-tab-pane key="3" tab="音频"></a-tab-pane>
        <a-tab-pane key="4" tab="文件"></a-tab-pane>
      </a-tabs>
      <a-form :form="form" v-filterFormAutoUi="{ expand }">
        <a-row :gutter="24">
          <a-col>
            <a-form-item label="素材名称">
              <a-input placeholder="请输入素材名称" v-model.trim="queryParam.materialName" allowClear />
            </a-form-item>
          </a-col>

          <a-col>
            <a-form-item label="素材类型">
              <a-select placeholder="请选择素材类型" v-model="queryParam.uploadMode" allowClear>
                <a-select-option value="perm">永久</a-select-option>
                <a-select-option value="temp">临时</a-select-option>
              </a-select>
              <!-- <a-select placeholder="请选择素材类型" v-model="queryParam.materialFileType" allowClear>
                <a-select-option v-for="(item, key) in materialFileTypes[key]" :value="item" :key="item">{{
                  item
                }}</a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item label="素材来源">
              <a-select placeholder="请选择素材来源" v-model="queryParam.source" allowClear>
                <a-select-option value="local">本地上传</a-select-option>
                <a-select-option value="editor">编辑器</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col>
            <a-form-item label="　　状态">
              <a-select placeholder="请选择状态" v-model="queryParam.auditStatus" allowClear>
                <a-select-option v-for="(item, key) in status" :value="key" :key="key">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <!-- <a-col>
            <a-form-item label="创建时间">
              <a-range-picker
                show-time
                separator="-"
                @change="onChangeTime"
                v-model="queryParam.sendtime"
                :style="{ width: '100%' }"
              />
            </a-form-item>
          </a-col> -->
          <a-col :style="{ textAlign: 'right' }">
            <a-form-item>
              <a-button type="primary" @click="search"> 查询 </a-button>
              <a-button @click="reset" :style="{ marginLeft: '8px' }"> 重置 </a-button>
              <!-- <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="expand = !expand">
                {{ expand ? '收起' : '展开' }} <a-icon :type="expand ? 'up' : 'down'" />
              </a> -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="materTag">
        <span class="tagTit">标签</span>
        <template v-for="(tag, index) in tags">
          <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
            <a-tag :key="tag" color="#E6F7FE" :closable="index !== 0" @close="() => handleClose(tag)">
              <img src="../../assets/tags.png" style="width: 18px; height: 18px" alt="" />
              {{ `${tag.slice(0, 20)}...` }}
            </a-tag>
          </a-tooltip>
          <a-tag v-else :key="tag" color="#E6F7FE" :closable="index !== 0" @close="() => handleClose(tag)">
            <!-- <a-icon type="plus" /> -->
            <img src="../../assets/tags.png" style="width: 18px; height: 18px" alt="" />
            {{ tag }}
          </a-tag>
        </template>
        <a-input
          v-if="inputVisible"
          ref="input"
          type="text"
          size="small"
          :style="{ width: '78px', height: '30px' }"
          :value="inputValue"
          @change="handleInputChange"
          @blur="handleInputConfirm"
          @keyup.enter="handleInputConfirm"
        />
        <a-tag class="addTag" v-else @click="showInput">
          <a-icon type="plus" />
        </a-tag>
      </div>
      <a-row :gutter="[0, 16]">
        <a-col :span="24">
          <a-button type="primary" @click="created" style="margin-right: 10px"><a-icon type="plus" />新建</a-button>

          <!-- <a-dropdown v-if="hasSelected">
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="1"> 批量删除 </a-menu-item>
              <a-menu-item key="2"> 批量送审 </a-menu-item>
            </a-menu>
            <a-button> 更多操作 <a-icon type="down" /> </a-button>
          </a-dropdown> -->
        </a-col>
        <a-col :span="24">
          <a-table
            class="showPreview"
            :columns="columns"
            :data-source="tableData"
            :pagination="pagination"
            :loading="tableLoading"
            rowKey="id"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, fixed: true }"
            :scroll="{ x: 1600 }"
            @change="pageChange"
          >
            <span slot="materialUrl" slot-scope="text, record, index">
              <div v-if="key == 1" class="column-img-border" name="sourceimg">
                <div
                  @mouseover="showimg($event, record, index)"
                  @mouseleave="hideimg(record)"
                  style="overflow: hidden"
                ></div>
                <img :src="text" @load="formatImg" />
              </div>
              <img
                v-show="key == 1 && record.showimg"
                class="overimg"
                name="overimg"
                :src="text"
                :style="{ top: top, left: left }"
              />

              <div v-if="key == 2" class="column-img-border" name="sourceimg">
                <img
                  v-if="key == 2"
                  style="cursor: pointer"
                  :src="record.materialPreviewUrl"
                  @click="showVideoM(text)"
                  @load="formatImg"
                />
              </div>

              <div v-if="key == 4" class="fileImage">
                <img src="../../assets/file.jpg" />
              </div>
              <audio v-if="key == 3" :src="text" controls="controls">您的浏览器不支持 audio 标签。</audio>
            </span>
            <span slot="msgType" slot-scope="text">
              {{ text | msgTypeC }}
            </span>
            <span slot="materialFileSize" slot-scope="text">
              {{ text | materialFileSizeC }}
            </span>
            <span slot="auditStatus" slot-scope="text, record">
              <span v-if="text == null || text == 0">
                {{ text | statusC }}
              </span>
              <span v-else>
                <a @click="showDetail(record.id)">{{ text | statusC }}</a>
              </span>
            </span>
            <span slot="materialSource" slot-scope="text">
              {{ text | materialSourceC }}
            </span>
            <span slot="action" slot-scope="text, record">
              <a style="margin-right: 10px">编辑</a>
              <a @click="deleteM(record.id, false)" style="margin-right: 10px">删除</a>
              <a @click="check(record.id)">送审</a>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>

    <!-- 新建 -->
    <a-modal
      :title="title"
      :visible="visibleCreate"
      width="735px"
      :destroyOnClose="true"
      :confirm-loading="confirmLoading"
      @ok="handleUpload"
      :maskClosable="false"
      @cancel="closeUpload"
    >
      <modalCreate :data="realdata" ref="test" />
    </a-modal>

    <!-- 视频 -->
    <a-modal
      class="previewShow"
      :visible="visibleVideo"
      width="500px"
      :destroyOnClose="true"
      :footer="null"
      @cancel="closeVideo"
      :closable="false"
    >
      <video :src="showVideo" style="width: 100%" autoplay controls="controls">您的浏览器不支持 video 标签。</video>
    </a-modal>

    <!-- 送审 -->
    <a-modal
      title="素材送审"
      :visible="visible"
      width="460px"
      :destroyOnClose="true"
      @ok="handleOk"
      :confirm-loading="confirmLoading1"
      @cancel="handleCancel"
      :maskClosable="false"
    >
      点击确定，素材将会在当前所有已上线的5G消息账号下完成送审。
    </a-modal>

    <!-- 5G送审 -->
    <a-modal
      title="素材送审"
      :visible="visible2"
      width="460px"
      :destroyOnClose="true"
      @ok="autoSubmitBatch"
      @cancel="visible2 = false"
      :maskClosable="false"
    >
      点击确定，将所有全账号审核通过的素材在新上线账号下送审。
    </a-modal>

    <!-- 审核情况 -->
    <a-modal
      title="审核情况"
      :visible="visible3"
      :width="800"
      :overflow="auto"
      :destroyOnClose="true"
      @cancel="visible3 = false"
      :maskClosable="false"
      footer=""
      id="checkPreviewTable"
    >
      <a-table class="showPreview" :columns="checkcolumns" :data-source="tableData2" rowKey="id" :scroll="{ y: 300 }">
        <span slot="auditStatus" slot-scope="text" class="statusColor">
          <div :class="text == '3' ? 'green' : text == '2' ? 'red' : 'blue'"></div>
          {{ text | status3C }}
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import columns from './tableColumnsConfig'
import checkcolumns from './checktableColumnsConfig'
// import {
//   getmaterialFileTypes,
//   queryMaterialAuditDetail,
//   autoSubmitBatch,
//   checkNewAccountOnline,
//   matUpload,
//   getMaterailList,
//   getAssociatedAccount,
//   submitById,
//   submitBatch,
//   deleteMet,
//   deleteMetB,
// } from '@/api/api'
import { materialList, materialLabel } from '@/api/api'
import { modalCreate } from './components'
import moment from 'moment'
import { changeKBM, imgReady, matUpload1, matUpload2 } from './'

let _vm = null

export default {
  name: 'materailManage',
  components: {
    modalCreate,
  },
  data() {
    return {
      newOnlineStateText: [
        `您上线了新的5G消息账号，请将已审核通过的素材进行新账号的送审。`,
        '正在同步素材至新账号...',
        '素材送审完成，素材状态会在审核后变更，请关注',
        '素材送审完成，素材状态会在审核后变更，请关注。由于网络波动，部分素材送审失败，请单独送审',
        '批量送审失败。当前服务异常，请稍后进行批量送审或联系运营人员',
      ],
      currentOnlineState: 0, //0 新账号送审，1 送审中， 2 送审完成， 3 送审部分失败 ， 4 送审失败
      checkid: null,
      newOnline: false,
      auto: 'auto',
      loadpass: false,
      top: 0,
      left: 0,
      bottom: 0,
      showVideo: '',
      visibleVideo: false,
      oldkey: '1',
      key: '1',
      confirmLoading: false,
      confirmLoading1: false,
      text: '图片',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      data: [
        {},
        {
          selectedRowKeys: [],
          pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultCurrent: 1,
          },
          queryParam: {
            //查询参数
            materialSource: undefined,
            auditStatus: undefined,
            materialName: '',
            materialFileType: undefined,
            id: '',
            materialType: '',
            createTime_begin: '',
            createTime_end: '',
            sendtime: ['', ''],
          },
        },
        {
          selectedRowKeys: [],
          pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultCurrent: 1,
          },
          queryParam: {
            //查询参数
            materialSource: undefined,
            auditStatus: undefined,
            materialName: '',
            materialFileType: undefined,
            id: '',
            materialType: '',
            createTime_begin: '',
            createTime_end: '',
            sendtime: ['', ''],
          },
        },
        {
          selectedRowKeys: [],
          pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultCurrent: 1,
          },
          queryParam: {
            //查询参数
            materialSource: undefined,
            auditStatus: undefined,
            materialName: '',
            materialFileType: undefined,
            id: '',
            materialType: '',
            createTime_begin: '',
            createTime_end: '',
            sendtime: ['', ''],
          },
        },
        {
          selectedRowKeys: [],
          pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            defaultCurrent: 1,
          },
          queryParam: {
            //查询参数
            materialSource: undefined,
            auditStatus: undefined,
            materialName: '',
            materialFileType: undefined,
            id: '',
            materialType: '',
            createTime_begin: '',
            createTime_end: '',
            sendtime: ['', ''],
          },
        },
      ],
      title: '',
      realdata: {
        title: '',
        materialFileType: '',
      },
      id: '',
      single: true,
      AssociatedAccount: '',
      AssociatedAccounts: [],
      visible: false,
      visible2: false,
      visible3: false,
      visibleCreate: false,
      form: this.$form.createForm(this, { name: 'searchForm' }),
      form1: this.$form.createForm(this, { name: 'searchForm1' }),
      expand: false,
      queryParam: {
        //查询参数
        source: undefined,
        auditStatus: undefined,
        materialName: '',
        materialFileType: undefined,
        materialType: '',
        uploadMode: '',
      },
      materialFileTypes: [
        [],
        ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
        ['mp4', '3gp', 'avi', 'f4v', 'm4v', 'mpg', 'ogv', 'vob', 'wmv'],
        ['aac', 'mp3', 'amr'],
        [''],
      ],
      tableLoading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        defaultCurrent: 1,
      },
      columns, // 表头
      checkcolumns,
      tableData: [{ id: 1 }],
      tableData2: [],
      materialSource: { localUpload: '本地上传', editorUpload: '多媒体消息编辑器' },
      status: { 0: '待送审', 1: '审核中', 2: '审核完成' },
      status3: { 1: '审核中', 2: '审核不通过', 3: '审核通过' },
      msgType: { S5G: '标准5G消息', E5G: '增强5G消息' },
      selectedRowKeys: [],
      // 标签
      tags: ['Unremovable', 'Tag 2', 'Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3'],
      inputVisible: false,
      inputValue: '',
    }
  },
  computed: {
    // hasSelected() {
    //   return this.selectedRowKeys.length > 0
    // },
  },
  mounted() {
    // this.checkNewAccountState()
    this.getData()
    this.getMaterialLabel()
  },
  created() {},
  beforeMount() {
    _vm = this
    //this.getAssociatedAccount()
  },
  filters: {
    statusC: function (v) {
      if (v == null) {
        return '待送审'
      } else {
        return _vm.status[v]
      }
    },
    status3C: (v) => _vm.status3[v],
    materialFileSizeC: function (v) {
      return _vm.changeKBM(v)
    },
    materialSourceC: (v) => _vm.materialSource[v],
  },
  methods: {
    formatImg(evt) {
      let img = evt.target
      let width = img.naturalWidth
      let height = img.naturalHeight

      if (width <= 128 && height <= 72) {
        img.style.width = width + 'px'
        img.style.height = height + 'px'
      } else if (width / height >= 16 / 9) {
        if ((height * 128) / width < 32) {
          img.style.width = 'auto'
          img.style.height = '32px'
        } else {
          img.style.width = '128px'
          img.style.height = 'auto'
        }
      } else if (width / height < 16 / 9) {
        if ((width * 72) / height < 32) {
          img.style.width = '32px'
          img.style.height = 'auto'
        } else {
          img.style.width = 'auto'
          img.style.height = '72px'
        }
      } else {
        img.style.width = '128px'
        img.style.height = '72px'
      }
    },
    changeKBM: changeKBM,
    imgReady: imgReady,
    moment,
    closeUpload() {
      this.confirmLoading = false
      this.visibleCreate = false
    },
    showDetail(id) {
      this.checkid = id
      this.queryMaterialAuditDetail()
    },
    async handleUpload() {
      if (!this.$refs.test.handleSubmit()) {
        return
      }
      try {
        let formData = new FormData()
        if (this.key == '1') {
          formData.append('type', 'image')
        } else if (this.key == '2') {
          formData.append('type', 'video')
        } else if (this.key == '3') {
          formData.append('type', 'audio')
        } else {
          formData.append('type', 'file')
        }

        this.$refs.test.fileList.forEach((file) => {
          formData.append('files', file)
        })
        this.confirmLoading = true

        var { code } = await matUpload1(formData)

        if (code == 200) {
          this.notify('success', '上传成功', '上传成功' + this.text + '：' + this.$refs.test.fileList.length + '个')
          this.getmaterialFileTypes()
        } else {
          this.notify('error', '上传失败', '上传失败' + this.text + '：' + this.$refs.test.fileList.length + '个')
        }
        this.getData()
        this.visibleCreate = false
        this.confirmLoading = false
      } catch (e) {
        if (JSON.stringify(e).indexOf('timeout') > -1) {
          this.notify('error', '上传失败', '可能问题：1、上传文件较大，且较多！ 2、网络较慢！请分批上传')
          this.visibleCreate = false
          this.confirmLoading = false
        }
      }
    },
    showVideoM(temp) {
      this.showVideo = temp
      this.visibleVideo = true
    },
    showimg(e, temp, index) {
      this.top = e.target.getBoundingClientRect().top + 'px'
      this.left = e.target.getBoundingClientRect().left + 150 + 'px'
      this.tableLoading = true
      temp.showimg = true
      this.tableLoading = false

      var t1 = document.body.offsetHeight
      var t2 = document.getElementsByName('overimg')
      setTimeout(() => {
        var t = t2[index].getBoundingClientRect().bottom
        if (t > t1) {
          t2[index].style.top = 'auto'
          t2[index].style.bottom = '10px'
        }
      })
    },
    hideimg(temp) {
      this.tableLoading = true
      temp.showimg = false
      this.tableLoading = false
    },
    async getmaterialFileTypes() {
      try {
        const { result, code } = await getmaterialFileTypes({ materialType: 'file' })
        if (code == 200) {
          this.materialFileTypes[4] = result
        }
      } catch (e) {}
    },
    async queryMaterialAuditDetail() {
      try {
        const { result, code, message } = await queryMaterialAuditDetail({ materialId: this.checkid })
        if (code == 200) {
          this.tableData2 = result
        } else {
          this.notify('error', '加载数据错误', message)
        }
        this.visible3 = true
      } catch (e) {}
    },
    async handleOk() {
      this.confirmLoading1 = true
      try {
        let formData = new FormData()
        //formData.append('msgId', this.AssociatedAccount)
        if (this.single) {
          formData.append('id', this.id)
          const { code } = await submitById(formData)
          if (code == 200) {
            this.notify('success', '送审成功', '送审成功：1个')
          } else {
            this.notify('error', '送审失败', '送审失败：1个')
          }
          this.confirmLoading1 = false
          this.visible = false
          this.getData()
        } else {
          formData.append('ids', this.selectedRowKeys.join(','))
          const { code, result } = await submitBatch(formData)
          if (code == 200) {
            this.notify('success', '送审成功', '送审成功：' + result + '个')
            this.pagination.current = 1
            this.selectedRowKeys = []
          } else {
            this.notify('error', '送审失败', '送审失败：' + this.selectedRowKeys.length + '个')
          }
          this.confirmLoading1 = false
          this.visible = false
          this.getData()
        }
      } catch (e) {
        this.confirmLoading1 = false
        this.visible = false
      }
    },
    check(id) {
      this.visible = true
      this.single = true
      this.id = id
      if (this.AssociatedAccounts.length > 0) {
        this.AssociatedAccount = this.AssociatedAccounts[0].msgId
      }
    },
    closeVideo() {
      this.visibleVideo = false
    },
    handleCancel() {
      this.visible = false
    },
    callback(e) {
      this.key = e
      if (e == '1') {
        this.text = '图片'
      } else if (e == '2') {
        this.text = '视频'
      } else if (e == '3') {
        this.text = '音频'
      } else {
        this.text = '文件'
        this.getmaterialFileTypes()
      }
      //this.text=this.key=='1' ? '图片' : this.key=='2' ? '视频' : '音频'

      this.data[this.oldkey].selectedRowKeys = this.selectedRowKeys
      this.data[this.oldkey].pagination = this.pagination
      this.data[this.oldkey].queryParam = this.queryParam

      this.selectedRowKeys = this.data[e].selectedRowKeys
      this.pagination = this.data[e].pagination
      // this.queryParam = this.data[e].queryParam

      this.oldkey = e
      this.getData()
    },
    created() {
      if (this.key == '1') {
        this.title = '上传图片'
        this.realdata.title = '上传图片'
        this.realdata.materialFileType = this.materialFileTypes[1]
      } else if (this.key == '2') {
        this.title = '上传视频'
        this.realdata.title = '上传视频'
        this.realdata.materialFileType = this.materialFileTypes[2]
      } else if (this.key == '3') {
        this.title = '上传音频'
        this.realdata.title = '上传音频'
        this.realdata.materialFileType = this.materialFileTypes[3]
      } else {
        this.title = '上传文件'
        this.realdata.title = '上传文件'
        this.realdata.materialFileType = ''
      }
      this.visibleCreate = true
    },
    clearSelected() {
      this.selectedRowKeys = []
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleMenuClick(e) {
      if (e.key == 1) {
        this.deleteM()
      } else {
        this.single = false
        this.visible = true
      }
    },
    reset() {
      this.queryParam = {
        materialSource: undefined,
        auditStatus: undefined,
        materialName: '',
        materialFileType: undefined,
        id: '',
        materialType: '',
        createTime_begin: '',
        createTime_end: '',
        sendtime: ['', ''],
      }
      this.selectedRowKeys = []
      this.getData()
    },
    onChangeTime(date, dateString) {
      console.log(date, dateString)
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    search() {
      this.pagination.current = 1
      this.selectedRowKeys = []
      this.getData()
    },
    pageChange({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getData()
    },
    closeNewOnline() {
      this.newOnline = false
    },
    //等待时间
    async waitTime(time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },

    async checkNewAccountState() {
      let arr = new Array(20).fill(0)
      for (const index of arr) {
        const { result } = await checkNewAccountOnline()
        if (result.online) {
          this.newOnline = result.online
          this.currentOnlineState = Number(result.status)
          if (result.status > 1 || result.status == 0) {
            break
          }
        } else {
          break
        }
        await this.waitTime(60000)
      }
    },
    async autoSubmitBatch() {
      try {
        const { code, message } = await autoSubmitBatch()
        if (code == 200) {
          this.currentOnlineState = 1
          this.visible2 = false
          this.checkNewAccountState()
          // this.notify('success','送审中','请跟进相关素材的审核情况')
        } else {
          this.currentOnlineState = 4
          // this.notify('error','送审失败',message)
        }
      } catch (e) {}
    },
    async checkNewAccountOnline() {
      try {
        const { result } = await checkNewAccountOnline()
        this.newOnline = result.online
        this.currentOnlineState = Number(result.status)
      } catch (e) {}
    },
    async getAssociatedAccount() {
      try {
        const { result } = await getAssociatedAccount()
        this.AssociatedAccounts = result
        if (this.AssociatedAccounts.length > 0) {
          this.AssociatedAccount = this.AssociatedAccounts[0].msgId
        }
      } catch (e) {}
    },
    async getData() {
      this.tableLoading = true
      try {
        if (this.key == '1') {
          this.queryParam.materialType = 'image'
        } else if (this.key == '2') {
          this.queryParam.materialType = 'video'
        } else if (this.key == '3') {
          this.queryParam.materialType = 'audio'
        } else {
          this.queryParam.materialType = 'file'
        }

        // let formData = new FormData()
        // formData.append('pageNo', this.pagination.current)
        // formData.append('pageSize', this.pagination.pageSize)
        // for (var i in this.queryParam) {
        //   formData.append(i, this.queryParam[i])
        // }
        this.queryParam.pageNo = this.pagination.current
        this.queryParam.pageSize = this.pagination.pageSize
        const { result, code, message } = await materialList(this.queryParam)

        if (code == 200) {
          this.tableData = result.records
          this.pagination.total = result.total
        } else {
          this.notify('error', '加载数据错误', message)
        }

        this.tableLoading = false
      } catch (err) {
        this.tableLoading = false
      }
    },
    deleteM(id) {
      const that = this
      this.$confirm({
        title: '确认删除',
        content: '删除后不影响已使用该' + this.text + '的消息，只是在库中不再展示该' + this.text,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if (id) {
            that.deleteMconfirm(id)
            return new Promise((resolve, reject) => {
              var t = setInterval(() => {
                if (that.loadpass) {
                  setTimeout(Math.random() > 0.5 ? resolve : reject, 1)
                  clearInterval(t)
                  that.loadpass = false
                }
              }, 100)
            }).catch(() => console.log(''))
          } else {
            that.deleteMBconfirm()
            return new Promise((resolve, reject) => {
              var t = setInterval(() => {
                if (that.loadpass) {
                  setTimeout(Math.random() > 0.5 ? resolve : reject, 1)
                  clearInterval(t)
                  that.loadpass = false
                }
              }, 100)
            }).catch(() => console.log(''))
          }
        },
      })
    },
    async deleteMconfirm(id) {
      // e.preventDefault()
      let formData = new FormData()
      formData.append('id', id)
      try {
        const { result, code, message } = await deleteMet(formData)

        if (code == 200) {
          this.notify('success', '删除成功', '删除' + this.text + '成功：1个')
          this.getmaterialFileTypes()
          this.selectedRowKeys.some((t, i) => {
            if (t == id) {
              this.selectedRowKeys.splice(i, 1)
              return true
            }
          })
          this.pagination.current = 1
        } else {
          this.notify('error', '删除失败', '删除' + this.text + '失败：1个')
        }
        this.loadpass = true
        this.getData()
      } catch (err) {
        this.loadpass = true
      }
    },
    async deleteMBconfirm() {
      let formData = new FormData()
      formData.append('ids', this.selectedRowKeys.join(','))

      try {
        const { result, code, message } = await deleteMetB(formData)

        if (code == 200) {
          this.notify('success', '删除成功', '删除' + this.text + '成功：' + this.selectedRowKeys.length + '个')
          this.getmaterialFileTypes()
          this.pagination.current = 1
          this.selectedRowKeys = []
        } else {
          this.notify('error', '删除失败', '删除' + this.text + '失败：' + this.selectedRowKeys.length + '个')
        }
        this.loadpass = true
        this.getData()
      } catch (err) {
        this.loadpass = true
        this.getData()
      }
    },
    notify(type, m, d) {
      // success  error warning
      this.$notification[type]({
        message: m,
        description: d,
      })
    },
    // 标签
    getMaterialLabel() {
      materialLabel().then((res) => {
        console.log(res)
      })
    },
    handleClose(removedTag) {
      const tags = this.tags.filter((tag) => tag !== removedTag)
      console.log(tags)
      this.tags = tags
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    handleInputChange(e) {
      this.inputValue = e.target.value
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      console.log(tags)
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
      })
    },
  },
}
</script>

<style lang="less">
.fileImage {
  width: 128px;
  height: 72px;
  background: #f9f9f9;
  overflow: hidden;
  img {
    width: 48px !important;
    height: 48px !important;
    margin: 14px 0 0 40px !important;
  }
}
#checkPreviewTable {
  .ant-pagination.ant-table-pagination {
    display: none;
  }

  .ant-table-header,
  .ant-table-body {
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: #fff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
    }
  }
}
.selectedTxt {
  margin-bottom: 16px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid rgb(186, 231, 255);
  line-height: 40px;
  background: #e8f7ff;
  position: relative;
}
.statusColor {
  div {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    vertical-align: bottom;
    margin-bottom: 8px;
  }
  .blue {
    background: #1890ff;
  }
  .green {
    background: #52c41a;
  }
  .gray {
    background: #d9d9d9;
  }
  .red {
    background: #ff4d4f;
  }
}
th.column-time,
td.column-time {
  white-space: nowrap;
}
.column-img-border {
  width: 128px;
  height: 72px;
  background: rgba(0, 0, 0, 0.03);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 127px;
    height: 72px;
  }
}
.column-img {
  position: relative;
  img {
    width: 0;
    height: 0;
  }
  audio {
    width: 128px;
    height: 30px;
  }
  img.overimg {
    position: fixed !important;
    width: 352px;
    height: auto !important;
    padding: 16px;
    border-radius: 5px;
    background: #fff;
    -webkit-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 99999;
  }
  .previewShow .ant-modal-content {
    background-color: transparent !important;
    box-shadow: none !important;
  }
}
.ant-calendar-range-picker-input {
  font-size: 13.2px !important;
  margin-top: 1px !important;
}
#materail .ant-tabs-tab {
  padding: 10px 16px 12px;
}
.infoIcon {
  color: #3994ff;
  font-size: 18px;
  vertical-align: middle;
  margin: -4px 10px 0 2px;
}
.infoIconTxt {
  display: inline-block;
  margin-top: -1px;
  vertical-align: top;
}
.newClose {
  position: absolute;
  right: 0;
  top: 14px;
}
.materTag {
  margin-bottom: 20px;
  .tagTit {
    padding-right: 20px;
    font-size: 24px;
    color: #232323;
  }
  .ant-tag-has-color {
    height: 30px;
    border: 1px solid #3f8fb0;
    line-height: 30px;
  }
  .ant-tag-has-color,
  .ant-tag-has-color a,
  .ant-tag-has-color a:hover,
  .ant-tag-has-color .anticon-close,
  .ant-tag-has-color .anticon-close:hover {
    color: #3f8fb0;
  }
  .addTag {
    width: 50px;
    height: 30px;
    background: #e7fee6;
    border-radius: 3px;
    border: 1px solid #3fb06d;
    margin-top: 2px;
    i {
      color: #3fb06d;
      text-align: center;
      font-size: 18px;
      // margin: 6px 0 0 8px;
      line-height: 30px;
      margin-left: 6px;
    }
  }
}
</style>
