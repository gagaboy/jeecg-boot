<template>
  <div
    v-if="reload"
    class="msgPreview"
    :style="{
      margin: alignCenter !== undefined ? '0 auto' : 0
    }">
    <div class="title" v-if="messageType === 'standard'">{{messageName}}</div>
    <a-carousel class="carousel" :autoplay="false" arrows :dots="false">
      <div
        slot="prevArrow"
        class="custom-slick-arrow"
        style="left: 10px;zIndex: 1"
      >
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow"  class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div v-for="(card, index) in cards" :key="index">
        <div class="scroll-wrap">
          <div v-for="(item, index) in card" :key="index">
            <div :class="{
              card: item.replyType,
              horizontal: item.cardOrientation === 'HORIZONTAL',
              [item.cardWidth]: item.cardWidth
            }">
              <div class="main">
                <div class="resources" :class="{[item.cardHeight]: item.cardHeight}">
                  <p v-if="item.type === 'text'" v-html="formatText(item.content)"></p>
                  <div v-if="(item.type === 'image' || item.type === 'pic') && item.content">
                    <img :src="item.content" />
                  </div>
                  <div v-if="item.type === 'video' && item.content" class="media-bg">
                    <img v-if="item.cardOrientation === 'HORIZONTAL'" src="./video.svg" />
                    <video v-else controls :src="item.content" preload="metadata" :poster="item.poster"></video>
                  </div>
                  <div v-if="(item.type === 'audio' || item.type === 'voice') && item.content" class="media-bg">
                    <img v-if="item.cardOrientation === 'HORIZONTAL'" src="./audio.svg" />
                    <audio v-else controls :src="item.content"></audio>
                  </div>
                  <div v-if="(item.type === 'file') && item.content" class="media-bg">
                    <div class="fileWrap">
                      <div class="fileIcon">
                        <img src="./fileIcon.jpg" />
                      </div>
                      <div class="fileText">
                        <div class="preview_fileName" id="preview_fileName">{{item.fileName}}</div>
                        <div class="fileSize">{{item.fileSize | materialFileSize}}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="desc" v-if="item.title">
                  <h3>{{item.title}}</h3>
                  <p>{{item.desc}}</p>
                </div>
              </div>

              <div class="inner-btns" v-if="item.buttons">
                <span v-for="(btn, index) in item.buttons" :key="index">{{btn.description || btn.originalDescription}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-carousel>
    <div class="btns">
      <span v-for="(btn, index) in buttons" :key="index">{{btn.description}}</span>
    </div>
    <a-button type="primary" v-if="isDialog" @click="closeDialog" style="position: absolute;bottom: -50px;left: 105px;">关闭</a-button>
  </div>
</template>
<script>
export default {
  name: 'msgPreview',
  data () {
    return {
      reload: true,
      loading: false,
      cards: [],
      buttons: [],
      messageName: ''
    }
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    visible: Boolean,
    messageType: String,
    data: Object,
    alignCenter: {}
  },
  computed: {
    formatText(val) {
      return (val)=>{
        return val=val.replace(/\n/g,"<br/>")
      }
    }
  },
  watch: {
    messageId (v) {
      this.getData()
    },
    data(newVal){
      if (newVal != null) {
        // 标准5g数据
        if (this.messageType === 'standard') {
          this.cards = this.filterData(newVal.data || newVal.templateContent)
          this.messageName = newVal.name || newVal.templateTitle
        }
        // 增强5g数据
        if (this.messageType === 'enhanced') {
          this.messageName = newVal.topic
          this.cards = this.filterData(newVal.massMessage || newVal.templateContent)
        }
        // 强制刷新页面
        this.reload = false
        this.$nextTick(()=>{
          this.reload = true
        })
      }else{
        this.messageName = ''
        this.cards = []
        this.buttons = []
      }
    },
  },
  mounted () {
    this.initData()
  },
  updated() {
    // file类型  宽度过宽时，中间显示省略号
    let fileDom = document.getElementById('preview_fileName')
    if(!fileDom) return
    let text = fileDom.innerText
    
    if(fileDom.offsetWidth > 158) {
      let textBegin = text.slice(0, 10)
      let txtEnd = text.substr(text.length-10, 10)
      document.getElementById('preview_fileName').innerHTML = textBegin+"..."+txtEnd
    }
  },
  filters: {
      materialFileSize:function(limit){
        var size = "";
        if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
          size = limit.toFixed(2) + "B"
        }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
          size = (limit/1024).toFixed(2) + "KB"
        }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
          size = (limit/(1024 * 1024)).toFixed(2) + "MB"
        }else{                                            //其他转化成GB
          size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
        }

        var sizeStr = size + "";                        //转成字符串
        var index = sizeStr.indexOf(".");                    //获取小数点处的索引
        var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
        if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
          return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
        }
        return size;
      },
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false)
    },
    initData() {
      this.loading = true
      this.cards = []
      this.buttons = []
      if (this.data!=null) {
      // 标准5g数据
      if(this.messageType === 'standard') {
        this.cards = this.filterData(this.data.data || this.data.templateContent)
        this.messageName = this.data.name || this.data.templateTitle
      }
      // 增强5g数据
      if(this.messageType === 'enhanced') {
        this.messageName = this.data.topic
        
        this.cards = this.filterData(this.data.massMessage || this.data.templateContent)
      }
      }else{
        this.messageName = ''
        this.cards = []
      }

      this.loading = false
    },

    filterData (massMessage) {
      let [cards, dataJson] = [[], {}]

      if (typeof massMessage === 'object') {
        massMessage.replyCollection = JSON.parse(massMessage.replyCollection)
        dataJson = massMessage
      } else {
        dataJson = JSON.parse(massMessage)
      }

      if (this.messageType === 'standard') {
        let card = dataJson.map(item => {
          return {
            content: item.content,
            type: item.type,
            poster: item.poster
          }
        })
        cards.push(card)
      } else {
        this.buttons = typeof dataJson.buttons === 'string' ? JSON.parse(dataJson.buttons) : dataJson.buttons
        dataJson.replyCollection.forEach(item => {
          if (['text','audio', 'voice', 'video', 'image', 'file'].includes(item.replyType)) {
            cards.push([
              {
                content: item.replyType === 'text'
                  ? (item.originalMessage || (item.reply && item.reply.content) || '')
                  : item.reply.imosMediaUrl || item.reply.mediaUrl,
                type: item.replyType,
                fileName: item.replyType === 'file'?item.reply.fileName:'',
                fileSize: item.replyType === 'file'?item.reply.fileSize:'',
                poster: item.reply.imosThumbnailMediaUrl || item.reply.thumbnailMediaUrl
              }
            ])
          } else if (item.replyType === 'singleCard') {
            const {originalTitle, description, buttons, originalDescription} = item.reply.card
            const {mediaUrl, imosMediaUrl, mediaType, thumbnailMediaUrl, imosThumbnailMediaUrl} = item.reply.card.media
            cards.push([{
              content: imosMediaUrl || mediaUrl,
              title: originalTitle,
              desc: description || originalDescription,
              buttons,
              replyType: item.replyType,
              type: mediaType,
              poster: imosThumbnailMediaUrl || thumbnailMediaUrl,
              cardOrientation: item.reply.cardOrientation,
              cardHeight: item.reply.height
            }])
          } else {
            item.reply.cards.forEach(card => {
              const {mediaUrl, imosMediaUrl, mediaType, thumbnailMediaUrl, imosThumbnailMediaUrl} = card.media
              cards.push([
                {
                  content: imosMediaUrl || mediaUrl,
                  title: card.originalTitle,
                  desc: card.description || card.originalDescription,
                  buttons: card.buttons,
                  replyType: item.replyType,
                  type: mediaType,
                  poster: imosThumbnailMediaUrl || thumbnailMediaUrl,
                  cardWidth: item.reply.cardWidth,
                  cardHeight: item.reply.cardHeight
                }
              ])
            })
          }
        })
      }

      return cards
    }
  }
}
</script>
<style lang='less'>
.previewDialog .ant-modal-content {
  background-color: transparent;
  box-shadow: none;
}

.msgPreview {
  width:280px;
  height:560px;
  // width:320px;
  // height:640px;
  padding:40px 15px 50px;
  background:url('./phone-bg.png') 0 0 no-repeat;
  background-size: cover;
  font-size: 12px;
  color:#606266;
  position: relative;
  display: flex;
  flex-direction:column;
  .media-bg, audio::-webkit-media-controls-panel{
    background: #f1f3f4;
  }
  .el-dialog__body{
    max-height: 800px;
  }
  .media-bg{
    text-align: center;
    img{
      width: 60%;
    }
  }
  .fileWrap {
    display: flex;
    width: 100%;
    border: 1px solid #dbdbdb;
    .fileIcon {
      width: 50px;
      height: 50px;
    }
    .fileText {
      width: 20px;
      flex: 1;
      padding: 0 6px;
      text-align: left;
      /*display: flex;*/
      /*flex-direction: column;*/
      /*justify-content: center;*/
      
      .preview_fileName {
        display: inline-block;
        // overflow:hidden; 
        // text-overflow:ellipsis; 
        // white-space:nowrap;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .title{
    padding: 0 10px 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .scroll-wrap{
    width:100%;
    height:100%;
    padding:10px;
    overflow-x: hidden;
    overflow-y: scroll;
    img{
      vertical-align: bottom;
    }
    video,img{
      width:100%;
      max-width: 100%;
      height: 100%;
    }
    audio {
      width:100%;
      max-width: 100%;
    }
    &::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 0 2px #dedede;
      border-radius: 20px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
  }
  
  .carousel{
    width:100%;
    height:calc(100% - 20px);
    flex:1;
    overflow-x: hidden;
    .slick-slider {
      height: 100%;
    
      .slick-list {
        height: 100%;

        .slick-track {
          height: 100%;

          .slick-slide>div {
            height: 100%;
          }
          .slick-slide>div>div {
            height: 100%;
          }
        }
      }
    }
  }

  .card{
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .1);
    &.SMALL_WIDTH{
      width:50%;
    }
    &.MEDIUM_WIDTH{
      width: 70%;
    }
    .desc{
      padding:.5em 1em;
      word-break: break-all;
    }
    h3{
      font-weight: normal;
    }

    .TALL_HEIGHT,.SHORT_HEIGHT{
      div{
        height: 132px;
      }
    }

    .MEDIUM_HEIGHT{
      div{
        height: 90px;
      }
    }

    .SHORT_HEIGHT{
      div{
        height: 70px;
      }
    }

    &.horizontal{
      .main{
        display: flex;
        flex-direction: row-reverse;
      }
      .desc{
        flex:1;
      }
      .resources{
        width: 80px;
      }
    }
  }

  .btns{
    position: absolute;
    bottom: 45px;
    right: 15px;
    padding-right: 10px;
    padding-bottom: 5px;
    overflow: auto;
    white-space: nowrap;
    width: 250px;
    z-index: 5;
    text-align: right;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 0 2px #dedede;
      border-radius: 20px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
    span{
      display: inline-block;
      padding: 0 8px;
      background: #f1f1f1;
      border-radius: 4px;
      line-height: 30px;
      font-size: 12px;
      color: #4a90e2;
      margin-right: 10px;
    }
  }
  .inner-btns{
    font-size: 15px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    margin-bottom: 8px;
    span{
      display: block;
      padding: 5px 10px;
      cursor: pointer;
      color: #4a90e2;
    }
  }
}
</style>
<style scoped>
.ant-carousel >>> .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: rgba(31, 45, 61, 0.11);
  opacity: 0.7;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.99;
}
  
</style>