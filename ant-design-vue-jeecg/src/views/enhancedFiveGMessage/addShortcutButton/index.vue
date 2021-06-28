<template>
  <div class="addshortcutbutton">
    <div v-if="showData">
      <childContent  v-for="(item,index) in items"
                  ref="child"
                  :key="index"
                  :index="index"
                  :data="item"
                  @deleteIndex="del"
                  @uploadData="getData">
      </childContent>
    </div>
    
    <div @click="add" v-if="items.length < max" class="addButton">
      + 添加快捷按钮
    </div>
    <div v-if="items.length == max" class="addButton grayBTN">
      + 快捷按钮和设置中的固定按钮总和不能超过{{max}}个
    </div>
    <input type="hidden" :id="id" :form="form" :name="name" :value="JSON.stringify(items)"/>
  </div>
</template>
<script>
import childContent from './childContent'

export default {
  name: 'addshortcutbutton',
  props: {
    data:{
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default:''
    },
    form: {
      type: String,
      default:''
    },
    id: {
      type: String,
      default:''
    },
    max: {
      type: Number,
      default: 11
    }
  },
  data () {
    return {
      items: [],
      showData:false
    }
  },
  created(){
    if(this.data!=null && this.data.length>0){
      this.showData = true,
      this.items = this.data
    }
  },
  computed: {

  },
  components: {
    childContent
  },
  methods: {
    checkValidate() {
      let result = this.$refs.child.every((item)=>{
        let itemRes
        item.checkValidate().validate(res=>{
          itemRes = res
        })
        return itemRes
      })
      return result
    },
    add(){
      this.showData = true,
      this.items.push({type: 'reply', description: ''})
    },
    del(index){
      this.items.splice(index, 1)
    },
    getData(val) {
      let index = val.index
      this.$set(this.items,index,val.data)
    }
  }
}
</script>
<style lang='less' >

.addshortcutbutton{
  .el-input{
    width: 100% !important;
  }
  .childSelect{
    width: 200px !important;
    .el-input.el-input--mini.el-input--suffix{
      width: 200px !important;
    }
  }

  .btnMatch{
    width: 100% !important;
    margin: 8px 0;
    .matchInput{
      margin: 8px 0 0 0;
      padding-right: 23px;
    }
  }

}


.addshortcutbutton{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background: #fff;
}
.addButton{
  height: 32px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #DCDFE6;
  font-size: 14px;
}

.grayBTN{
  cursor: default;
  color: #a9aab1;
}

</style>

