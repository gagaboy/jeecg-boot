<template>
  <a-modal
    :title="isEdit ? '编辑变量' : '新增变量'"
    width="640px"
    :maskClosable="false"
    :centered="true"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleSubmit"
    @cancel="cancel"
    ok-text="保存"
  >
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="变量名称">
        <a-input
          v-decorator="['variableName', { rules: [
            { required: true, whitespace: true, message: '必填项不能为空' },
            {validator: checkPositiveInteger}
          ] }]"
          placeholder="请输入变量名称"
         	:maxLength="25"
        />
      </a-form-item>
      <a-form-item label="默认值">
        <a-input
          :maxLength="25"
          placeholder="请输入默认值，默认为空"
          v-decorator="['defaultValue',{ rules: [
            {validator: checkPositiveInteger}
          ] }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { insertVariable, editVariable } from '@/api/api'
import { removeEmojiAllSpace, removeEmoji } from '../assets/js/util.js'  //emoji表情

export default {
  name: 'variableModalCreate',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },

    botId: null,  //创建时需要
    //编辑时的参数
    activeData: {
				type: Object,
				default: function() {
					return {}
				},
			},
  },
  inject: ['parentVm'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'variableModalCreate' }),
      confirmLoading: false,
    }
  },
  computed: {},
  watch:{
    visible(status){
      this.$nextTick(() => {
        if(status){
          ;[
            {variableName: this.isEdit ? this.activeData.variableName : undefined},
            {defaultValue: this.isEdit ? this.activeData.defaultValue : undefined}
          ].forEach(item => this.form.setFieldsValue(item))
        }
      })
    }
  },
  methods: {
  	 // 自定义校验函数，要求输入的是一个正整数
    checkPositiveInteger(rule, value, callback) {
    	if(rule.field == 'variableName') {
    		this.variableNameFun(rule, value, callback)
    	} else {
    		this.defaultValueFun(rule, value, callback)
    	}
    },
    variableNameFun(rule, value, callback) {
//  	var trimValue = value.trim()
//  	if(value && trimValue && trimValue.length && trimValue != value) {
//  			callback('变量名称前后不能有空格');
//  	} else if (!this.decide(value)) {
//      // 如果需要返回 error msg，就把它传给 `callback()`
//      callback('变量名称不能包含emoji');
//    } else {
//      // 如果通过校验，调用无参数的 `callback()` 即可
//      callback();
//    }
		if (!removeEmojiAllSpace.test(value)) {
        // 如果需要返回 error msg，就把它传给 `callback()`
        callback('变量名称不能包含emoji和空格');
      } else {
        // 如果通过校验，调用无参数的 `callback()` 即可
        callback();
      }
    },
    defaultValueFun(rule, value, callback) {
    	if (!removeEmoji.test(value)) {
        // 如果需要返回 error msg，就把它传给 `callback()`
        callback('默认值不能包含emoji');
      } else {
        // 如果通过校验，调用无参数的 `callback()` 即可
        callback();
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (err) return
        if(!this.hasBot()) return

        this.confirmLoading = true

				const params = {
          ...values,
          botId: this.botId,
          //编辑的时候才需要，新建的时候不用
          id: this.activeData.id,
          variableId: this.activeData.variableId,
        }

        const api = this.isEdit ? editVariable : insertVariable
				var content = this.isEdit ? '编辑' : '新增'
        try {
          const { result, success, message } = await api(params)
          this.$message[success ? 'success': 'error'](success ? content+'成功': message)
          this.confirmLoading = false
          success && this.$emit('reload', {
          	...result,
          }) && this.cancel()
        } catch (err) {
          this.confirmLoading = false
          this.$message['error'](content+'失败')
        }
      })
    },
    hasBot(){
      if(!this.isEdit && !this.botId){
        this.$notification.warning({
          message: '警告',
          description: '当前企业暂无机器人，无法创建变量！'
        })
        return false
      }else{
        return true
      }
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
.remark-container{
  height: 300px;
  overflow: auto;
}
</style>
