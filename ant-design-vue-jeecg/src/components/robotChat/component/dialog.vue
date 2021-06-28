<template>
  <div class="chat-message-dialog">
    <div class="chat-message-dialog-inner ">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-dialog"
}
</script>
<style lang="less" >
.bcat-chat-message-content {
  .received {
    display: flex;
    .chat-message-dialog {
      margin-left: 7px;
    }
  }
  .sent {
    display: flex;
    justify-content:flex-end;
    .chat-message-dialog {
      margin-right: 7px;
      border-radius: 15px 0 15px 15px;
      background-color: #D0D3E3;
    }
  }
  .chat-message-dialog {
    max-width: 80%;
    border-radius: 0 15px 15px 15px;
    background-color: rgb(255, 255, 255);
    position: relative;
    margin-bottom: 20px;
  }
}

</style>