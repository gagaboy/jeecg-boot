<template>
<div>
  <a-row>
    <a-col :offset="3" style="width:940px;margin-bottom:40px">
      <template v-if="type == 'singleCard' ">
        <div class="template-card" style="width:240px;margin-left:10px; margin-bottom:60px">
          <a-form-model-item label="" prop="material"  class="noMarginBottom" :rules="[{value:data.content.media.cspMediaUrl,validator: customValidate,message:'请选择图片素材'}]" :wrapper-col="{ span: 24 }">
          <div class="card-material" @click="selectMaterial">
            <template v-if="JSON.stringify(data.content.media) == '{}'">
              <a-icon type="plus" /><span>添加素材</span>
            </template>
            <template v-else>
              <img v-if="data.content.media.mediaType == 'image' " :src="data.content.media.cspMediaUrl" style="width:100%;height:100%">
              <img v-if="data.content.media.mediaType == 'video'" :src="data.content.media.cspThumbnailMediaUrl" style="width:100%;height:100%" />
            </template>
          </div>
          </a-form-model-item>
          <div class="card-content">
            <a-form-model-item label="" prop="title" :rules="[{value:data.content.title,validator: customValidate,message:'卡片标题不能为空'}]" :wrapper-col="{ span: 24 }">
              <a-input placeholder="卡片标题" style="margin-bottom:12px" v-model="data.content.title" />
            </a-form-model-item>
            <a-textarea :autoSize="{ minRows: 4, maxRows: 10 }" v-model="data.content.description" placeholder="请输入文本信息" style="margin-bottom:12px" />
            <ul class="card-menu">
              <template v-for="(menu,index) in data.content.suggestions">
                <li @click="editCardMenu(menu,index)" :key="index">{{menu.displayText}} <a-icon @click.stop="delCardMenu(index)" type="close-circle" class="del" theme="filled" /></li>
              </template>
            </ul>
            <a-button v-if="data.content.suggestions.length < 4" type="dashed" block @click="addCardMenu">+ 卡片菜单</a-button>
          </div>
        </div>
      </template>
      <template v-if="type == 'manyCards' ">
        <swiper class="swiper-no-swiping" style="width:900px;margin-left:-20px;" :options="swiperOption" ref="swiper" >
          <swiper-slide v-for="(card,index) in data.content" :key="index">
            <div class="template-card">
              <div class="card-handle">
                <a-button size="small" icon="delete" @click="delCard(index)" v-if="data.content.length > 1" />
                <a-button size="small" icon="plus" @click="addCard(index)" />
              </div>
              <a-form-model-item label="" prop="material"  class="noMarginBottom" :rules="[{value:card.media.cspMediaUrl,validator: customValidate,message:'请选择图片素材'}]" :wrapper-col="{ span: 24 }">
                <div class="card-material" @click="selectMaterial(index)">
                  <template v-if="JSON.stringify(card.media) == '{}'">
                    <a-icon type="plus" /><span>添加素材</span>
                  </template>
                  <template v-else>
                    <img v-if="card.media.mediaType == 'image' " :src="card.media.cspMediaUrl" style="width:100%;height:100%">
                    <img v-if="card.media.mediaType == 'video'" :src="card.media.cspThumbnailMediaUrl" style="width:100%;height:100%" />
                  </template>
                </div>
              </a-form-model-item>
              <div class="card-content">
                <a-form-model-item label="" prop="title" :rules="[{value:card.title,validator: customValidate,message:'卡片标题不能为空'}]" :wrapper-col="{ span: 24 }">
                  <a-input placeholder="卡片标题" style="margin-bottom:12px" v-model="card.title" />
                </a-form-model-item>
                
                <a-textarea :autoSize="{ minRows: 4, maxRows: 10 }" v-model="card.description" placeholder="请输入文本信息" style="margin-bottom:12px" />
                <ul class="card-menu">
                  <template v-for="(menu,menuIndex) in card.suggestions">
                    <li @click="editCardMenu(menu,menuIndex)" :key="menuIndex">{{menu.displayText}} <a-icon @click.stop="delCardMenu(index,menuIndex)" type="close-circle" class="del" theme="filled" /></li>
                  </template>
                </ul>
                <a-button v-if="isManyCardMenu(index)" type="dashed" block @click="addCardMenu(index)">+ 卡片菜单</a-button>
              </div>
              
            </div>
            <div style="text-align:center">{{index+1}}/{{data.content.length}}</div>
          </swiper-slide>
        </swiper>
        <!-- 如果需要导航按钮 -->
        <template v-if="data.content.length > 3">
          <div class="swiper-button-prev" style="left:-55px" @click="prev"></div>
          <div class="swiper-button-next" @click="next"></div>
        </template>
      </template>
    </a-col>
  </a-row>

   <a-modal
      title="添加卡片菜单"
      :visible="cardMenuVisible"
      :destroyOnClose="true"
      :maskClosable="false"
      width="600px"
      @cancel="cardMenuVisible=false"
      @ok="saveCardMenu"
    >
      <cardMenu :menu-data="currentMenuData" @update="updateCurrentMenuData" />
    </a-modal>

</div>

</template>

<script>
import cardMenu from './menu'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
export default {
  name:"template-card",
  components: {
    Swiper,
    SwiperSlide,
    cardMenu
  },
  props: {
    data: Object,
    type: String,
    material: Object
  },
  inject:['selectMaterialModal'],
  data() {
    return {
      cardMenuVisible:false,
      currentMenuData:{},
      currentIndex:0,
      selectMenuDeep:undefined,
      
      isEditMenu:false,
      swiperOption: {
        slidesPerView: 3,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    }
  },

  watch: {
      material(newVal) {
        let currentIndex = this.currentIndex
        if(this.type === 'singleCard') {
          this.data.content.media = {mediaType:newVal.type,...newVal.materialObj}
        } else {
          this.data.content[currentIndex].media = {mediaType:newVal.type,...newVal.materialObj}
        }
      },
      data:{
        immediate:true,
        handler(newVal) {
          if(newVal.content) {

          } else {
            let newData = {
              title:"",
              description:"",
              media:{},
              suggestions:[],
            }
            //配置卡片基础设置
            let layout = {
              cardOrientation: "VERTICAL",
              cardWidth: "MEDIUM_WIDTH",
              cardHeight: "TALL_HEIGHT",
              height: "SHORT_HEIGHT",
              imageAlignment: "LEFT"
            }
            this.$set(this.data,'layout',layout)
 
            if(this.type === 'singleCard') {
              this.$set(this.data,'content',newData)
            } else {
              this.$set(this.data,'content',[newData])
            }
          }
        },
      }
  },
  methods: {
    selectMaterial(index) {
      this.selectMaterialModal('image')
      this.currentIndex = index
    },
    isManyCardMenu(index) {
      return this.data.content[index].suggestions.length < 4
    },
    delCardMenu(index,menuIndex) {
      if(this.type == 'singleCard') {
        this.data.content.suggestions.splice(index,1)
      } else {
        this.data.content[index].suggestions.splice(menuIndex,1)
      }
    },
    editCardMenu(data,index) {
      this.isEditMenu = true
      this.cardMenuVisible = true
      this.currentMenuData = {...data}
      this.selectMenuDeep = index
    },
    saveCardMenu() {
      if(this.type == 'singleCard') {
        if(this.isEditMenu) {
          this.data.content.suggestions.splice(this.selectMenuDeep,1,{...this.currentMenuData})
        } else {
          this.data.content.suggestions.push({
            ...this.currentMenuData
          })
        }
      } else {
        let index = this.currentIndex
        if(this.isEditMenu) {
            this.data.content[index].suggestions.splice(this.selectMenuDeep,1,{...this.currentMenuData})
        } else {
          this.data.content[index].suggestions.push({
              ...this.currentMenuData
          })
        }
      }
      this.isEditMenu = false
      this.cardMenuVisible = false
    },
    updateCurrentMenuData(data) {
      this.currentMenuData = data
    },    
    addCardMenu(index) {
      this.currentIndex = index
      this.cardMenuVisible = true
      this.currentMenuData = {
        type:'reply',
        displayText: "回复信息",
        postback:{
          data:''
        }
      }
    },
    addCard(index) {
      this.data.content.splice(index+1,0,{
        title:"",
        description:"",
        media:{},
        suggestions:[],
      })

    },
    delCard(index) {
      this.data.content.splice(index,1)
    },
    prev(){
        this.$refs.swiper.$swiper.slidePrev();
    },
    next(){
        this.$refs.swiper.$swiper.slideNext();
    },    
    customValidate(rule, value, callback) {
      let {value:material} = rule
      if(this.type == 'singleCard') {
        if(!material) {
          callback(new Error())
        } else {
          callback()
        }
      } else {
        if(!material) {
          callback(new Error())
        } else {
          callback()
        }
      }
    },
  }
}
</script>
<style lang="less" scoped>
.swiper {
  margin-bottom: 50px;
}
.template-card {
  margin: 20px 30px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  position: relative;
  .ant-form-item {
    margin-bottom: 10px;
    input {
      margin-bottom: 0!important;
    }
  }
  .noMarginBottom {
    margin-bottom: 0;
  }
  .card-material {
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: #90a1fc;
    color:#fff;
    display: flex;
    height: 120px;
    cursor: pointer;
  }
  .card-content {
    padding: 12px;
  }
  .card-menu {
    li {
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #f8f9fd;
      margin-bottom: 8px;
      position: relative;
      cursor: pointer;
      &:hover {
        background-color: #eaefff;
      }
      .del {
        cursor: pointer;
        position: absolute;
        right: -3px;
        top: -3px;
        &:hover {
          color: #f00;
        }
      }
    }
  }
  .card-handle {
    position:absolute;
    right: -30px;
    display: flex;
    flex-direction: column;
    button {
      margin-bottom: 5px;
    }
  }
}
</style>