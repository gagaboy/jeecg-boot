<template>
	<ul class="aw-emoji-category">
		<li
			v-for="(category,index) in data"
			:key="category.name"
			:class="[{ 'selected': category.name === current }]"
			@click="onSelect(category)"
		>
			{{category.zh}}
		</li>
	</ul>
</template>
<script>
export default {
  name: 'categories',
  props: {
  	data: Array,
  	current: {
  		type: String,
  		default: ''
  	}
  },
  methods: {
  	onSelect(val) {
  		this.$emit("select",val.name)
  	}
  },

}
</script>
<style>
.aw-emoji-category {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding:10px 10px 15px 10px;
	border-bottom: 1px dashed #f1f1f1;
}
.aw-emoji-category li {
	position: relative;
	cursor: pointer;
}
.aw-emoji-category li.selected {
	color: #2d8cf0
}

.aw-emoji-category li.selected:after {
	content:"";
	width: 100%;
	border-bottom: 2px solid #2d8cf0;
	position: absolute;
	bottom: -5px;
	left: 0
}
</style>