export default [
  {
    title: '5G消息账号名称',
    dataIndex: 'bootName',
    key: 'bootName',
    width: '160px',
    ellipsis: true
  },
  {
    title: '5G消息账号',
    dataIndex: 'appId',
    key: 'appId',
    width: '160px',
    ellipsis: true
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    width: '128px',
    ellipsis: true,
    key: 'supplierName'
  },
  {
    title: '审核结果',
    key: 'auditStatus',
    dataIndex: 'auditStatus',
    width: '128px',
    scopedSlots: { customRender: 'auditStatus' }
  }
]
