<template>
	<div class="aw-emoji-list" ref="emojiList">
		<div
			v-for="(emoji,index) in data[current]"
			:key="index"
			class="aw-emoji-item"
			@click="onSelect(emoji)"
		>
			<span class="emoji">{{emoji.emoji}}</span>
		</div>
	</div>
</template>
<script>
export default {
  name: 'emojiList',
  props: {
  	data: Object,
  	current: {
  		type: String,
  		default: ''
  	}
  },
  watch: {
  	current() {
  		this.$refs.emojiList.scrollTop = 0
  	}
  },

  methods: {
  	onSelect(val) {
  		this.$emit("select",val.emoji)
  	}
  }
}
</script>
<style>
.aw-emoji-list {
  display: inline-flex;
  flex-flow: wrap;
  align-items: center;
  min-height: 230px;
  max-height: 230px;
  overflow-y: auto;
  
  color: #fff;
}
.aw-emoji-item {
	display: inline-flex;
	align-items: center;
	justify-content: center;
  text-align: center;
  width: 20%;
  cursor: pointer;
}
.aw-emoji-item .emoji:hover {
  background: rgba(0,0,0,.09);
  border-radius: 8px;
}
.aw-emoji-item .emoji {
  display: inline-block;
  font-size: 20px;
  padding: 9px 6px 6px 6px;;
  cursor: pointer;
  margin: 5px 0;
  
  /*0821修改颜色问题*/
 	color: #515a6e;
}
</style>