<template>
	<ul :class="[prefixCls + '-list']" v-bind:style="{'max-width': maxWidth || 'auto'}">
		<li v-for="(file, index) in files" :key="index" :class="fileCls(file)" @click="handleClick(file)">
			<span @click="handlePreview(file)">
            	<span class="file-name"><Icon :type="format(file)"></Icon> {{ file.name }}</span>
			</span>
			<!--新增按钮-->
			<div class="ivu-upload-button">
				<!--重新上传,失败时显示按钮-->
				<a-icon v-if="file.status === 'fail'" class="icon" type="reload" size="16" @click.native="handleRefresh(file)"></a-icon>
				<!--上传按钮，首次添加的时候显示按钮-->
				<a-icon v-if="file.status === 'noupload'" class="icon" type="cloud-upload" size="16" @click.native="handleUpload(file)"></a-icon>
				<a-icon type="close-circle" class="icon" size="16" @click.native="handleRemove(file)"></a-icon>
			</div>
			<!--进度条-->
			<transition name="fade">
				<a-progress v-if="file.showProgress && file.percentage" :stroke-width="2" :percent="parsePercentage(file.percentage)" :status="progressStatus(file)"></a-progress>
			</transition>
		</li>
	</ul>
</template>
<script>
	const prefixCls = 'ivu-upload';
	export default {
		name: 'UploadList',
		props: {
			files: {
				type: Array,
				default() {
					return [];
				}
			},
			maxWidth: String,
		},
		data() {
			return {
				prefixCls: prefixCls,
				background: '#F3F3F3',
			};
		},
		computed: {
			progressStatus() {
				return function(file) {
					var result = {
						'finished': 'success',
						'uploading': 'normal',
						'fail': 'wrong',
					}
					var status = 'uploading'
					if(file && file.status) {
						var status = file.status
					}
					return result[status]
				}
			}
		},
		methods: {
			fileCls(file) {
				return [
					`${prefixCls}-list-file`,
					{
						[`${prefixCls}-list-file-finish`]: file.status === 'finished'
					}
				];
			},
			handleClick(file) {
				this.$emit('on-file-click', file);
			},
			handlePreview(file) {
				this.$emit('on-file-preview', file);
			},
			handleRemove(file) {
				this.$emit('on-file-remove', file);
			},
			//重新上传按钮
			handleRefresh(file) {
				this.$emit('on-file-refresh', file);
			},
			//上传按钮
			handleUpload(file) {
				this.$emit('on-file-upload', file);
			},
			//设置前置图标
			format(file) {
				const format = file.name.split('.').pop().toLocaleLowerCase() || '';
				let type = 'ios-document-outline';

				if(['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
					type = 'images';
				}
				if(['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
					type = 'ios-film';
				}
				if(['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
					type = 'ios-musical-notes';
				}
				if(['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
					type = 'document';
				}
				if(['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
					type = 'stats-bars';
				}
				if(['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
					type = 'ios-videocam';
				}
				return type;
			},
			parsePercentage(val) {
				return parseInt(val, 10);
			}
		}
	};
</script>
<style lang='less' scoped>
	.ivu-upload-list {
		/deep/ .ivu-progress-show-info .ivu-progress-outer {
			/*padding-right: 15px;
	    	margin-right: -19px;*/
		}
	}
	
	.icon {
		cursor: pointer;
	}
	
	.ivu-upload-list-file {
		position: relative;
		
		line-height: 14px;
	}
	
	.ivu-upload-button {
		position: absolute;
		right: 6px;
		top: 4px;
	}
	
	.file-name {
		display: inline-block;
		padding-right: 15px;
		/*去除手指悬浮样式*/
		cursor: auto; 
	}
</style>