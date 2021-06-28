<template>
  <div>
    <messageCard v-if="['singleCard','manyCards'].indexOf(messageData.replyType) > -1" :data="messageData" />
    <chatDialog v-else>
      <render :data="messageData.reply" :type="messageData.replyType"></render>
    </chatDialog>
  </div>
</template>

<script>
import chatDialog from './dialog'
import messageCard from './card'
import render from './render'
export default {
  name: "chat-message",
  components: {
    render,
    chatDialog,
    messageCard
  },
  props: {
    data: Object
  },
  data() {
    let newData = JSON.parse(this.data.content)
    return {
      messageData: newData.replyCollection[0]
    }
  }
}
</script>
<style lang="less">
.bcat-chat-message-content {
  .message-type-text {
    padding:10px;
    word-break: break-all;
  }
  .received {
    .message-type-image {
      max-height: 180px;
      overflow: hidden;
    }
    .message-type-image img,
    .message-type-video video{
      width: 100%;
      border-radius: 0 15px 15px 15px;
      min-height: 130px;
      max-height: 260px;
      z-index: 10;
    }
    .card-wrapper {
      display: flex;
      flex-direction:  column;
      img,video,audio {
        border-radius: 0 15px 0 0;
      }
    }

    .message-type-audio {
      font-size: 0;
      width: 80%;
      audio {
        height: 32px;
      }
    }
    .message-type-file {
      margin:10px;
      display: flex;
      svg {
        margin-right: 10px;
      }
    }
  }
  .sent {
    .message-type-image img,
    .message-type-video video{
        width: 100%;
        border-radius: 15px 0 15px 15px;
    }
  }

  .message-type-cards {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .chat-message-dialog {
      min-width: 80%;
      flex:none;
      margin-right: 10px;
      // margin-bottom: 10px !important;
    }
  }


  .card-wrapper {
    .card-content {
      margin:0 10px;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      margin: 5px 0
    }
    .desc {
      font-size: 12px;
      color: rgba(0,0,0,0.6);
      word-break:break-all;
    }
    .btn-list {
      padding: 15px 0;
      li{
        cursor: pointer;
        text-align: center;
        padding:5px 0;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }

}

</style>