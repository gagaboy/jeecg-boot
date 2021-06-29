export default [

    {
        title: '图片',
        dataIndex: 'materialUrl',
        key: 'materialUrl',
        className: 'column-img',
        width: '160px',
        scopedSlots: { customRender: 'materialUrl' }
    },
    {
        title: '素材名称',
        dataIndex: 'materialName',
        width: '252px',
        key: 'materialName'
    },
    {
        title: '素材类型',
        dataIndex: 'materialType',
        width: '128px',
        key: 'materialType'
    },
    {
        title: '素材大小',
        key: 'materialFileSize',
        dataIndex: 'materialFileSize',
        width: '128px',
        scopedSlots: { customRender: 'materialFileSize' }
    },
    {
        title: '素材标签',
        key: 'msgTmplApplyCount',
        width: '164px',
        dataIndex: 'msgTmplApplyCount'
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: '204px',
        scopedSlots: { customRender: 'action' }
    }
]