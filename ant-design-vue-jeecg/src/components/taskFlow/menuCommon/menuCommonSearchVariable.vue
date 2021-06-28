<template>
	<div style="position: relative">
		<a-select v-model="monitorItem.monitorId" @change="handleChangeMonitorItem" placeholder="选择变量" :showSearch="true" optionFilterProp="children" style="width: 320px;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
		    <div slot="dropdownRender" slot-scope="menu">
		      <v-nodes :vnodes="menu" />
		      <a-divider style="margin: 4px 0;" />
		      <div
		        style="padding: 4px 8px; cursor: pointer; color: #1890FF;"
		        @mousedown="e => e.preventDefault()"
		        @click="addVariableSlotList"
		      >
		        <a-icon type="plus" /> 新增变量
		      </div>
		    </div>
		    <a-select-option v-for="item in variableSlotList" :value="item.variableId" :key="item.variableId" >{{ item.variableName }}</a-select-option>
		 </a-select>
	</div>
</template>
<script>
	//	这个是顶部的title部分，新增了返回按钮。画布公共组件
	export default {
		name: 'menuCommonSearchVariable',
		props: {
			variableSlotList: {
				type: Array,
				default: function() {
					return []
				},
			},
			searchVariableIndex: {
				type: Number,
  				default: 0,
			},
			monitorItem: {
				type: Object,
				default: function() {
					return {}
				},
			}
		},
		components: {
		},
		 components: {
		    VNodes: {
		      functional: true,
		      render: (h, ctx) => ctx.props.vnodes,
		    },
		 },
		data: function() {
			return {
				open: false,
			}
		},
		methods: {
			addVariableSlotList(e) {
				this.open = true
				//10.12新增变量列表项
				this.$root.eventBus.$emit("add_variable_slot_list", {
					searchVariableIndex: this.searchVariableIndex,
				})
		   },
		    handleChangeMonitorItem(value) {
		    	var variableSlotList = this.variableSlotList || []
				var res = {}
				variableSlotList.forEach((item) => {
					res[item.variableId] = item
				})
		    	this.monitorItem.monitorName = value && res[value] && res[value].variableName || ''
		    }
		},
		created() {},
		mounted() {},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
</style>