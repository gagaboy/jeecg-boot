<template>
  <div>
    <a-row>
      <a-col :offset="3" style="width: 940px; margin-bottom: 40px">
        <template v-if="type == 'singleCard'">
          <div class="template-card" style="width: 240px; margin-left: 10px; margin-bottom: 60px">
            <a-form-model-item
              label=""
              prop="material"
              class="noMarginBottom"
              :rules="[{ value: data.card.media.cspMediaUrl, validator: customValidate, message: '请选择图片素材' }]"
              :wrapper-col="{ span: 24 }"
            >
              <div class="card-material" @click="selectMaterial">
                <template v-if="JSON.stringify(data.card.media) == '{}'">
                  <a-icon type="plus" /><span>添加素材</span>
                </template>
                <template v-else>
                  <img
                    v-if="data.card.media.mediaType == 'image'"
                    :src="data.card.media.cspMediaUrl"
                    style="width: 100%; height: 100%"
                  />
                  <img
                    v-if="data.card.media.mediaType == 'video'"
                    :src="data.card.media.cspThumbnailMediaUrl"
                    style="width: 100%; height: 100%"
                  />
                </template>
              </div>
            </a-form-model-item>
            <div class="card-content">
              <a-form-model-item
                label=""
                prop="title"
                :rules="[{ value: data.card.title, validator: customValidate, message: '卡片标题不能为空' }]"
                :wrapper-col="{ span: 24 }"
              >
                <a-input placeholder="卡片标题" style="margin-bottom: 12px" v-model="data.card.title" />
              </a-form-model-item>
              <a-textarea
                :autoSize="{ minRows: 4, maxRows: 10 }"
                v-model="data.card.description"
                placeholder="请输入文本信息"
                style="margin-bottom: 12px"
              />
              <ul class="card-menu">
                <template v-for="(menu, index) in data.card.buttons">
                  <li @click="editCardMenu(menu, index)" :key="index">
                    {{ menu.description }}
                    <a-icon @click.stop="delCardMenu(index)" type="close-circle" class="del" theme="filled" />
                  </li>
                </template>
              </ul>
              <a-button v-if="data.card.buttons.length < 4" type="dashed" block @click="addCardMenu"
                >+ 卡片菜单</a-button
              >
            </div>
          </div>
        </template>
        <template v-if="type == 'manyCards'">
          <swiper
            class="swiper-no-swiping"
            style="width: 900px; margin-left: -20px"
            :options="swiperOption"
            ref="swiper"
          >
            <swiper-slide v-for="(card, index) in data.cards" :key="index">
              <div class="template-card">
                <div class="card-handle">
                  <a-button size="small" icon="delete" @click="delCard(index)" v-if="data.cards.length > 1" />
                  <a-button size="small" icon="plus" @click="addCard(index)" />
                </div>
                <a-form-model-item
                  label=""
                  prop="material"
                  class="noMarginBottom"
                  :rules="[{ value: card.media.cspMediaUrl, validator: customValidate, message: '请选择图片素材' }]"
                  :wrapper-col="{ span: 24 }"
                >
                  <div class="card-material" @click="selectMaterial(index)">
                    <template v-if="JSON.stringify(card.media) == '{}'">
                      <a-icon type="plus" /><span>添加素材</span>
                    </template>
                    <template v-else>
                      <img
                        v-if="card.media.mediaType == 'image'"
                        :src="card.media.cspMediaUrl"
                        style="width: 100%; height: 100%"
                      />
                      <img
                        v-if="card.media.mediaType == 'video'"
                        :src="card.media.cspThumbnailMediaUrl"
                        style="width: 100%; height: 100%"
                      />
                    </template>
                  </div>
                </a-form-model-item>
                <div class="card-content">
                  <a-form-model-item
                    label=""
                    prop="title"
                    :rules="[{ value: card.title, validator: customValidate, message: '卡片标题不能为空' }]"
                    :wrapper-col="{ span: 24 }"
                  >
                    <a-input placeholder="卡片标题" style="margin-bottom: 12px" v-model="card.title" />
                  </a-form-model-item>

                  <a-textarea
                    :autoSize="{ minRows: 4, maxRows: 10 }"
                    v-model="card.description"
                    placeholder="请输入文本信息"
                    style="margin-bottom: 12px"
                  />
                  <ul class="card-menu">
                    <template v-for="(menu, menuIndex) in card.buttons">
                      <li @click="editCardMenu(menu, menuIndex)" :key="menuIndex">
                        {{ menu.description }}
                        <a-icon
                          @click.stop="delCardMenu(index, menuIndex)"
                          type="close-circle"
                          class="del"
                          theme="filled"
                        />
                      </li>
                    </template>
                  </ul>
                  <a-button v-if="isManyCardMenu(index)" type="dashed" block @click="addCardMenu(index)"
                    >+ 卡片菜单</a-button
                  >
                </div>
              </div>
              <div style="text-align: center">{{ index + 1 }}/{{ data.cards.length }}</div>
            </swiper-slide>
          </swiper>
          <!-- 如果需要导航按钮 -->
          <template v-if="data.cards.length > 3">
            <div class="swiper-button-prev" style="left: -55px" @click="prev"></div>
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
      @cancel="cardMenuVisible = false"
      @ok="saveCardMenu"
    >
      <cardMenu :menu-data="currentMenuData" />
    </a-modal>
  </div>
</template>

<script>
import cardMenu from './menu'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
export default {
  name: 'template-card',
  components: {
    Swiper,
    SwiperSlide,
    cardMenu,
  },
  props: {
    data: Object,
    type: String,
    material: Object,
  },
  inject: ['selectMaterialModal'],
  data() {
    return {
      cardMenuVisible: false,
      currentMenuData: {},
      currentIndex: 0,
      selectMenuDeep: undefined,

      isEditMenu: false,
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
      if (this.type === 'singleCard') {
        this.data.card.media = { mediaType: newVal.type, ...newVal.materialObj }
      } else {
        this.data.cards[currentIndex].media = { mediaType: newVal.type, ...newVal.materialObj }
      }
    },
    data: {
      immediate: true,
      handler(newVal) {
        if (newVal.cards || newVal.card) {
        } else {
          let newData = {
            title: '',
            description: '',
            media: {},
            buttons: [],
          }
          //配置卡片基础设置
          this.$set(this.data, 'cardOrientation', 'VERTICAL')
          this.$set(this.data, 'cardWidth', 'MEDIUM_WIDTH')
          this.$set(this.data, 'cardHeight', 'TALL_HEIGHT')
          this.$set(this.data, 'height', 'SHORT_HEIGHT')
          this.$set(this.data, 'imageAlignment', 'LEFT')
          if (this.type === 'singleCard') {
            this.$set(this.data, 'card', newData)
          } else {
            this.$set(this.data, 'cards', [newData])
          }
        }
      },
    },
  },
  methods: {
    selectMaterial(index) {
      this.selectMaterialModal('image')
      this.currentIndex = index
    },
    isManyCardMenu(index) {
      return this.data.cards[index].buttons.length < 4
    },
    delCardMenu(index, menuIndex) {
      if (this.type == 'singleCard') {
        this.data.card.buttons.splice(index, 1)
      } else {
        this.data.cards[index].buttons.splice(menuIndex, 1)
      }
    },
    editCardMenu(data, index) {
      this.isEditMenu = true
      this.cardMenuVisible = true
      this.currentMenuData = { ...data }
      this.selectMenuDeep = index
    },
    saveCardMenu() {
      if (this.type == 'singleCard') {
        if (this.isEditMenu) {
          this.data.card.buttons.splice(this.selectMenuDeep, 1, { ...this.currentMenuData })
        } else {
          this.data.card.buttons.push({
            ...this.currentMenuData,
          })
        }
      } else {
        let index = this.currentIndex
        if (this.isEditMenu) {
          this.data.cards[index].buttons.splice(this.selectMenuDeep, 1, { ...this.currentMenuData })
        } else {
          this.data.cards[index].buttons.push({
            ...this.currentMenuData,
          })
        }
      }
      this.isEditMenu = false
      this.cardMenuVisible = false
    },
    addCardMenu(index) {
      this.currentIndex = index
      this.cardMenuVisible = true
      this.currentMenuData = {
        type: 'reply',
      }
    },
    addCard(index) {
      this.data.cards.splice(index + 1, 0, {
        title: '',
        description: '',
        media: {},
        buttons: [],
      })
    },
    delCard(index) {
      this.data.cards.splice(index, 1)
    },
    prev() {
      this.$refs.swiper.$swiper.slidePrev()
    },
    next() {
      this.$refs.swiper.$swiper.slideNext()
    },
    customValidate(rule, value, callback) {
      let { value: material } = rule
      if (this.type == 'singleCard') {
        if (!material) {
          callback(new Error())
        } else {
          callback()
        }
      } else {
        if (!material) {
          callback(new Error())
        } else {
          callback()
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.swiper {
  margin-bottom: 50px;
}
.template-card {
  margin: 20px 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .ant-form-item {
    margin-bottom: 10px;
    input {
      margin-bottom: 0 !important;
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
    color: #fff;
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
    position: absolute;
    right: -30px;
    display: flex;
    flex-direction: column;
    button {
      margin-bottom: 5px;
    }
  }
}
</style>