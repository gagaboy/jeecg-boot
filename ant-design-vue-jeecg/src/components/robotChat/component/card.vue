<template>
  <div class="message-type-cards drop-handle" :class="cardClassName"  @mousedown="Drop" @mouseup="noDrop">
    <chatDialog v-for="(card,index) in cardData" :key="index">
      <div class="card-wrapper">
        <render :data="card.media" :type="card.media.mediaType"></render>
        <div class="card-content">
          <h3 class="title">{{card.title}}</h3>
          <div class="desc">
            <div>{{isMore ? card.description : card.description.substr(0,200)}}</div>
            <div class="showmore" @click="showMore(card.description)" v-if=" card.description.length > 200"><a-icon :type="isMore ? 'up' : 'down'" /></div>
          </div>
          <ul class="btn-list">
            <li v-for="(btn,btnIndex) in card.suggestions" :key="btnIndex" @click="send(btn)">{{btn.displayText}}</li>
          </ul>
        </div>
      </div>
    </chatDialog>
  </div>
</template>

<script>
import { dropMixin } from '../mixin'
import chatDialog from './dialog'
import render from './render'
export default {
  name: "message-card",
  mixins: [dropMixin],
  components: {
    chatDialog,
    render
  },
  props: {
    data: Object
  },
  inject:['sendCardMessage'],
  data() {
    return {
      reply: this.data.contentText,
      cardType: this.data.contentType,
      cardOrientation:{
        HORIZONTAL:'card-flex-row',
        VERTICAL:'card-flex-column'
      },
      cardWidth:{
        MEDIUM_WIDTH:'card-width-medium',
        SMALL_WIDTH:'card-width-small'
      },
      cardHeight:{
        TALL_HEIGHT:'card-height-tall',
        MEDIUM_HEIGHT:'card-height-medium',
        SHORT_HEIGHT:'card-height-short',
      },
      imageAlignment:{
        LEFT:'card-image-left',
        RIGHT:'card-image-right'
      },
      isMouseDown: false, // 鼠标是否按下，显示手型
      isMore:false
    }
  },
  computed: {
    cardClassName() {
      return this.cardOrientation[this.reply.layout.cardOrientation] + ' ' + this.cardWidth[this.reply.layout.cardWidth] + ' ' + this.cardHeight[this.reply.layout.cardHeight] + ' ' + this.imageAlignment[this.reply.layout.imageAlignment]
    },
    cardData() {
      return this.data.contentType == 'singleCard' ? [this.reply.content] : this.reply.content
    },
  },
  methods: {
    showMore() {
      this.isMore = !this.isMore
    },
    send(data) {
      this.sendCardMessage(data)
    }
  }
}
</script>
<style lang="less" >
.card-width-small .chat-message-dialog{
  min-width: 50% !important;
  max-width: 50% !important;
}
.card-flex-row .card-wrapper{
  flex-direction: row !important;
  img,video {
    width: 50%;
    border-radius: 0 0 0 0!important;
  }
}
.card-flex-row.card-image-right .card-wrapper{
  flex-direction: row-reverse !important;
}
.showmore {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

</style>
