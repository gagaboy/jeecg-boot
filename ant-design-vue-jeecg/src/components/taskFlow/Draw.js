// import { jsPlumb } from 'jsplumb'

import { getUUID, querySelector } from './assets/js/util.js'

//基本连接线样式
var connectorPaintStyle = {
    strokeWidth: 4,
    stroke: "#808080"
}

class AddEndpointCommon {
    constructor() {
        var common = {
            isSource: true, //是否起点
            isTarget: true, //是否终点
            connector: ["Flowchart", { cornerRadius: 10 }], //设置连线的样式
            endpoint: ["Dot", {
                radius: 5
            }],
            paintStyle: {
                strokeWidth: 2,
                stroke: '#808080'
            },
            connectorStyle: connectorPaintStyle, //连接线的颜色，大小样式
            maxConnections: -1, //默认情况下，maxConnections的值是1，也就是一个端点最多只能拉出一条连线。
            //设置箭头的样式
            connectorOverlays: [
                ['Arrow', {
                    width: 12,
                    length: 12,
                    location: 1,
                    paintStyle: {
                        fill: "#808080"
                    },
                }],
                ["Custom", {
                    create: function(component) {
                        var childNode = document.createElement('div');
                        childNode.setAttribute('class', 'draw-flex-center aLabel');
                        childNode.innerHTML = '<i data-v-1c65e90a="" aria-label="icon: delete" tabindex="-1" class="draw-cursor-pointer anticon anticon-delete clickCloseColor" confirm="" transfer="true" popper-class="cat-drae-card-poptip" width="213"><svg viewBox="64 64 896 896" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg></i>';
                        return childNode
                            //						return $('<div class="draw-flex-center aLabel"><i data-v-1c65e90a="" aria-label="icon: delete" tabindex="-1" class="draw-cursor-pointer anticon anticon-delete clickCloseColor" confirm="" transfer="true" popper-class="cat-drae-card-poptip" width="213"><svg viewBox="64 64 896 896" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg></i></div>');
                    },
                    location: 0.5,
                    id: "customOverlay",
                }],
            ],
        }
        for (var key in common) {
            this[key] = common[key]
        }
    }
}

class Draw {
    constructor(page) {
        this.loadEasyFlowFinish = false //是否加载完毕
        this.page = page //设置页面
        this.addNodeSuccess = null //添加节点时的操作
        this.addNodeLineSuccess = null //添加连线的函数
        this.deleteLineSuccess = null //删除成功的函数

        this.jsPlumb = jsPlumb.getInstance()
        this.jsPlumb.setContainer(querySelector("#flowContainer"))

        // 默认设置参数
        this.jsplumbSetting = {
            // 动态锚点、位置自适应
            Anchors: ['Right', 'Left'],
            Container: 'flowContainer',
            // 连线的样式 StateMachine、Flowchart
            Connector: 'Flowchart',
            // 鼠标不能拖动删除线
            ConnectionsDetachable: false,
            // 删除线的时候节点不删除
            DeleteEndpointsOnDetach: false,
            RenderMode: "svg",
        }

        this.jsplumbSourceOptions = {
            /*"span"表示标签，".className"表示类，"#id"表示元素id*/
            filter: ".flow-node-drag",
            filterExclude: false,
            //                  filterExclude: true,
            //								anchor: "Continuous",
            allowLoopback: false,
            //                  allowLoopback: true,
        }
        this.jsplumbTargetOptions = {
            /*"span"表示标签，".className"表示类，"#id"表示元素id*/
            filter: ".flow-node-drag",
            filterExclude: false,
            //                  filterExclude: true,
            //						anchor: "Continuous",
            allowLoopback: false,
            //                  allowLoopback: true,
        }
    }
    jsPlumbInit(data) {
            const _this = this
            this.data = data //设置所有的值
            var that = this
            this.jsPlumb.ready(() => {
                // 导入默认配置
                this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                this.jsPlumb.setSuspendDrawing(false, true);

                //			this.loadEasyFlow()
                this.loadEasyFlowFirst() //新增设置节点信息

                // 单点击了连接线,
                this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.jsPlumb.deleteConnection(conn)
                    })
                    // 连线
                this.jsPlumb.bind("connection", (evt) => {
                    let from = evt.source.id
                    let to = evt.target.id
                    if (this.loadEasyFlowFinish) {
                        //限制不能重复
                        if (this.hasLine(from, to)) {
                            //					that.page.$message.info('不能重复连线')
                            return false
                        }
                        this.data.lineList.push({
                            from: from,
                            to: to
                        })
                    }
                })

                // 删除连线回调
                this.jsPlumb.bind("connectionDetached", (evt) => {
                    this.deleteLine(evt.sourceId, evt.targetId)
                })

                // 改变线的连接节点
                this.jsPlumb.bind("connectionMoved", (evt) => {
                    this.changeLine(evt.originalSourceId, evt.originalTargetId)
                })

                // 单击endpoint
                // jsPlumb.bind("endpointClick", function (evt) {
                // })
                //
                // // 双击endpoint
                // jsPlumb.bind("endpointDblClick", function (evt) {
                // })

                // contextmenu
                this.jsPlumb.bind("contextmenu", (evt) => {

                })

                // 连线
                this.jsPlumb.bind("beforeDrop", (evt) => {
                    let from = evt.sourceId
                    let to = evt.targetId
                    if (from === to) {
                        that.page.$message.info('不能连接自己')
                        return false
                    }
                    if (this.hasLine(from, to)) {
                        that.page.$message.info('不能重复连线')
                        return false
                    }
                    //      04.27**连线修改
                    //				if(this.hashOppositeLine(from, to)) {
                    //					that.page.$message.info('不能回环')
                    //					return false
                    //				}

                    var judgeBeforeConnecting = this.page.judgeBeforeConnecting(from, to)
                    if (judgeBeforeConnecting) {
                        that.page.$message.success('连线成功')
                        this.page.$nextTick(() => {
                            //新增连线成功
                            this.addNodeLineNew(from, to)
                        })
                    }
                    return judgeBeforeConnecting
                })

                // beforeDetach
                this.jsPlumb.bind("beforeDetach", (evt) => {})
            })
        }
        //	连线内容
    setJsPlumb(node) {
            var addEndpointUuids = node.addEndpointUuids
            for (var item in addEndpointUuids) {
                var common = new AddEndpointCommon()
                if (item == 'Left' && addEndpointUuids[item]) {
                    common.isSource = false
                    common.isTarget = true

                    common.endpoint = ["Dot", {
                        radius: 0.5,
                    }]
                    common.paintStyle = {
                        strokeWidth: 11,
                        stroke: '#808080',
                    }

                    //				common.maxConnections = 1 //左侧只能连1条线  //04.27**连线修改
                } else if (item == 'Right' && addEndpointUuids[item]) {
                    common.isSource = true
                    common.isTarget = false
                }

                //0511新增多个锚点
                if (item == 'Right' && node.nodeType == "judge") {

                    common.isSource = true
                    common.isTarget = false
                    common.maxConnections = 1 //左侧只能连1条线  //04.27**连线修改

                    var rights = node.judgeModuleList
                    for (let i = 0; i < rights.length; i++) {
                        //0821新增处理：先添加后删除的节点，也添加锚点的bug
                        if (rights[i].showJudgeModule) {
                            this.jsPlumb.addEndpoint(rights[i].jsplumbNodeId, {
                                anchor: item,
                                uuid: rights[i].jsplumbNodeId,
                            }, common)
                        }
                    }
                } else {
                    this.jsPlumb.addEndpoint(node.jsplumbNodeId, {
                        anchor: item,
                        uuid: addEndpointUuids[item], //设置唯一标识
                    }, common)

                    this.jsPlumb.draggable(node.jsplumbNodeId, {
                        containment: 'parent'
                    })
                }
            }

            //设置层级，让线显示在最下面
            var divId = node.jsplumbNodeId
                //  $(`#${divId}`).css({ 'z-index': 2})
            if (querySelector(`#${divId}`)) {
                querySelector(`#${divId}`).style.zIndex = 2
            }
        }
        //循环去处理数据
    func(i, fun) {
            var firstData = this.page.abuotApi.firstData
            let node = firstData[i]
            this.data.nodeList.push(node)
            this.page.$nextTick(() => {
                //设置节点信息
                this.setJsPlumb(node)
                i = i + 1
                if (i >= firstData.length) {
                    fun()
                    return
                }
                this.func(i, fun)
            })
        }
        // 加载流程图
    loadEasyFlowFirst() {
            this.func(0, () => {
                this.page.$nextTick(() => {
                    // 初始化连线
                    for (var i = 0; i < this.data.lineList.length; i++) {
                        let line = this.data.lineList[i]

                        this.addNodeLine(line.from, line.to, true)
                    }
                    this.loadEasyFlowFinish = true
                })
            })
        }
        // 加载流程图
    loadEasyFlow() {
            // 初始化节点
            for (var i = 0; i < this.data.nodeList.length; i++) {
                let node = this.data.nodeList[i]

                //设置节点信息
                this.setJsPlumb(node)
            }

            // 初始化连线
            for (var i = 0; i < this.data.lineList.length; i++) {
                let line = this.data.lineList[i]

                this.addNodeLine(line.from, line.to, true)
            }
            this.page.$nextTick(() => {
                this.loadEasyFlowFinish = true
            })
        }
        // 删除线
    deleteLine(from, to) {
        //删除线
        var index = this.findLineList(from, to)
        this.data.lineList.splice(index, 1)

        //设置成功函数
        if (typeof this.deleteLineSuccess == 'function') {
            this.deleteLineSuccess(from, to)
        }
    }
    findLineList(from, to) {
            var lineList = this.data.lineList
            var ind = 0
            lineList.forEach((line, index) => {
                if (line.from == from && line.to == to) {
                    ind = index
                }
            })
            return ind
        }
        // 改变连线
    changeLine(oldFrom, oldTo) {
            this.deleteLine(oldFrom, oldTo)
        }
        // 改变节点的位置
    changeNodeSite(data) {
        return new Promise((resolve, reject) => {
            for (var i = 0; i < this.data.nodeList.length; i++) {
                let node = this.data.nodeList[i]
                if (node.jsplumbNodeId === data.jsplumbNodeId) {
                    node.left = data.left
                    node.top = data.top
                    resolve(node)
                }
            }
        })
    }

    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    //新建节点
    addNode(node) {
            if (!node.jsplumbNodeId) {
                node.jsplumbNodeId = getUUID()
            }
            if (!node.left) {
                node.left = '300px' //位置关系
            }
            if (!node.top) {
                node.top = '300px' //位置关系
            }
            node.show = true //是否显示出来

            /**
             * 这里可以进行业务判断、是否能够添加该节点
             */
            this.data.nodeList.push(node)
            this.page.$nextTick(() => {
                this.setJsPlumb(node)

                //设置成功函数，自动连线
                if (typeof this.addNodeSuccess == 'function') {
                    this.addNodeSuccess(node)
                }
            })
        }
        /**
         * 删除节点
         * @param nodeId 被删除节点的ID
         */
    deleteNode(jsplumbNodeId) {
            this.data.nodeList = this.data.nodeList.filter((node) => {
                if (node.jsplumbNodeId === jsplumbNodeId) {
                    // 伪删除，将节点隐藏，否则会导致位置错位
                    node.show = false
                }
                return true
            })

            this.page.$nextTick(() => {
                this.jsPlumb.removeAllEndpoints(jsplumbNodeId);

                //0511新增删除后面的连线
                this.dealJudgeModuleList(jsplumbNodeId)
            })
        }
        //0511新增删除后面的连线
    dealJudgeModuleList(jsplumbNodeId) {
            var nodeObj = this.findNode(jsplumbNodeId)
            var judgeModuleList = nodeObj.judgeModuleList || []
            judgeModuleList.forEach((item) => {
                this.jsPlumb.removeAllEndpoints(item.jsplumbNodeId);
            })
        }
        /**
         * 编辑节点
         * @param nodeId 被点击编辑的节点的ID
         */
    editNode(jsplumbNodeId) {
            //              this.nodeFormVisible = true
            //              this.page.$nextTick(function () {
            //                  this.$refs.nodeForm.init(this.data, jsplumbNodeId)
            //              })
        }
        // 是否具有该线
    hasLine(from, to) {
            for (var i = 0; i < this.data.lineList.length; i++) {
                var line = this.data.lineList[i]
                if (line.from === from && line.to === to) {
                    return true
                }
            }
            return false
        }
        // 是否含有相反的线
    hashOppositeLine(from, to) {
        return this.hasLine(to, from)
    }
    addNodeLineNew(source, target, isFirst) {
            //设置成功函数
            if (typeof this.addNodeLineSuccess == 'function') {
                this.addNodeLineSuccess(source, target, isFirst)
            }
        }
        //0511修改
    addNodeLine(source, target, isFirst) {
        //isFirst是否是首次连线
        var sourceNode = this.findNode(source)
        var targetNode = this.findNode(target)
        var Right = sourceNode.addEndpointUuids.Right
        var Left = targetNode.addEndpointUuids.Left
            ////		//0511修改的内容
        if (sourceNode.nodeType == 'judge') {
            Right = source
        }
        this.jsPlumb.connect({
            uuids: [Right, Left],
        })

        //设置成功函数
        if (typeof this.addNodeLineSuccess == 'function') {
            this.addNodeLineSuccess(source, target, isFirst)
        }
    }
    findIndexOld(jsplumbNodeId) {
        var nodeList = this.data.nodeList
        for (var i = 0; i < nodeList.length; i++) {
            let node = nodeList[i]
            if (node.jsplumbNodeId === jsplumbNodeId) {
                return i
            }
        }
    }
    findNodeOld(jsplumbNodeId) {
        var index = this.findIndexOld(jsplumbNodeId)
        return this.data.nodeList[index]
    }
    findIndex(jsplumbNodeId) {
        var nodeList = this.data.nodeList
        for (var i = 0; i < nodeList.length; i++) {
            let node = nodeList[i]
            if (node.jsplumbNodeId === jsplumbNodeId) {
                return i
            }
        }
    }
    findIndexNew(nodeListMy, jsplumbNodeId) {
        for (var i = 0; i < nodeListMy.length; i++) {
            let node = nodeListMy[i]
            if (node.jsplumbNodeId === jsplumbNodeId) {
                return i
            }
        }
    }
    returnNodeListMy() {
        var result = this.data.nodeList
        var nodeListMy = []
        for (var i = 0; i < result.length; i++) {
            var nodeOne = result[i]
                //0511新增判断节点处理,如果是判断节点，就去这里处理
            if (nodeOne.nodeType == 'judge') {
                var judgeModuleList = nodeOne.judgeModuleList
                for (let j = 0; j < judgeModuleList.length; j++) {
                    var judgeNodeOne = judgeModuleList[j]
                    var obj = {}
                    for (let key1 in nodeOne) {
                        obj[key1] = nodeOne[key1]
                    }
                    for (let key in judgeNodeOne) {
                        obj[key] = judgeNodeOne[key]
                    }
                    obj.jsplumbNodeId = judgeNodeOne.jsplumbNodeId
                    obj.id = judgeNodeOne.id
                    nodeListMy.push(obj)
                        //0512新增设置在哪个id里面,分支中才有这个属性，父组件中是没有的
                    obj.judgeFather = {
                        jsplumbNodeIdFather: nodeOne.jsplumbNodeId,
                        index: j,
                    }
                    obj.tos = judgeNodeOne.tos //这里设置到对应的后接节点
                }
                nodeListMy.push(nodeOne)
            } else {
                nodeListMy.push(nodeOne)
            }
        }
        return nodeListMy
    }
    findNode(jsplumbNodeId) {
        var nodeListMy = this.returnNodeListMy()
        var index = this.findIndexNew(nodeListMy, jsplumbNodeId)
        return nodeListMy[index]
    }
    FilterData(oldJudgeModuleList, newJudgeModuleList) {  //循环判断数组a里的元素在b里面有没有，有的话就放入新建立的数组中
        var result = new Array();
        var a = oldJudgeModuleList
        var b = []
        newJudgeModuleList.forEach((item) => {
            b.push(item.jsplumbNodeId)
        })

        for (var i = 0; i < a.length; i++) {
            if (b.indexOf(a[i].jsplumbNodeId) == -1) {
                result.push(a[i]);
            }   
        }
        return result;    
    }

    //	0512新增去除节点
    dealJudgeModuleListAll(index, obj) {
        var oldNode = this.data.nodeList[index] || {}
        var oldJudgeModuleList = oldNode.judgeModuleList || []
        var newNode = obj || {}
        var newJudgeModuleList = newNode.judgeModuleList || []
            //说明删除了
        if (oldJudgeModuleList.length > newJudgeModuleList.length) {
            var result = this.FilterData(oldJudgeModuleList, newJudgeModuleList) || []
                //去除已经删除的节点
            result.forEach((item) => {
                this.jsPlumb.removeAllEndpoints(item.jsplumbNodeId);
            })
        }
    }
    hiddenJudgeModuleListAll(index, obj) {
            var oldNode = this.data.nodeList[index] || {}
            var oldJudgeModuleList = oldNode.judgeModuleList || []
            var newJsplumbNodeIds = []

            var newNode = obj || {}
            var newJudgeModuleList = newNode.judgeModuleList || []
            newJudgeModuleList.forEach((item) => {
                newJsplumbNodeIds.push(item.jsplumbNodeId)
                if (!item.showJudgeModule && !item.isDefaultBranch) {
                    this.jsPlumb.removeAllEndpoints(item.jsplumbNodeId);
                }
            })
        }
        //	0512新增保存一份数据--12:58
    saveJudgeModuleListAll(index, obj) {
            var oldNode = this.data.nodeList[index] || {}
            var oldJudgeModuleList = oldNode.judgeModuleList || []
            var result = {}
            oldJudgeModuleList.forEach((item) => {
                result[item.jsplumbNodeId] = item.tos //设置后接节点
                this.jsPlumb.removeAllEndpoints(item.jsplumbNodeId); //去除所有的节点
            })

            return result
        }
        //更新节点数据
    upData(obj) {
        var nodeList = this.data.nodeList
        var index = this.findIndex(obj.jsplumbNodeId)
            //更新数据，时间更新
        this.data.nodeList.splice(index, 1, obj)

        //		//0512新增设置新的节点线条
        if (obj.nodeType == 'judge') {
            this.page.$nextTick(() => {
                this.jsPlumb.repaintEverything()

                //				//重新去刷新
                this.page.$nextTick(() => {
                    jsPlumb.ready(() => {
                        this.setJsPlumb(this.data.nodeList[index]) //重现设置锚点

                        this.hiddenJudgeModuleListAll(index, obj) //去除已经删除的节点
                    })
                })
            })
        }
    }

    //设置菜单栏
    setAddNode(jsplumbNodeId) {
            var nodeList = this.data.nodeList //所有的节点
                //已经被删除的节点
            var lineList = this.data.lineList //连线关系
            var node = this.findNode(jsplumbNodeId)
            var nodeType = node.nodeType
        }
        //	0511修改后接节点=====
        //找到每个节点的前置和后置节点，数组.type可取from和to
    findLinkNodeArray(jsplumbNodeId, type = 'from', type1 = 'to') {
            var lineList = this.data.lineList
            var result = []
            for (var i = 0; i < lineList.length; i++) {
                var obj = lineList[i]
                if (obj[type] == jsplumbNodeId) {
                    result.push(obj[type1])
                }
            }
            return result
        }
        //设置每个节点的后置节点
    followedByNodes() {
        var nodeListMy = this.returnNodeListMy()
        nodeListMy.forEach((item) => {
            var jsplumbNodeId = item.jsplumbNodeId
            item.tos = this.findLinkNodeArray(jsplumbNodeId, 'from', 'to', nodeListMy) //所有下接的线
            item.froms = this.findLinkNodeArray(jsplumbNodeId, 'to', 'from', nodeListMy) //所有上接的线

            if (item.nodeType == 'judge' && item.judgeFather) {
                var father = this.findNode(item.judgeFather.jsplumbNodeIdFather)
                father.judgeModuleList[item.judgeFather.index].tos = item.tos
            }
        })


        this.calculateAllNextNodes()
    }
    calculateAllNextNodes() {
        //0512新增计算判断节点的所有下接节点
        var result = this.data.nodeList
        result.forEach((item) => {
            if (item.nodeType == 'judge') {
                var judgeModuleList = item.judgeModuleList
                judgeModuleList.forEach((item1) => {
                    var tos = item1.tos || []
                    if (tos[0]) {
                        if (item.tos.indexOf(tos[0]) == -1) {
                            item.tos.push(tos[0])
                        }
                    }
                })
            }
        })
    }
}

export {
    Draw
}