<script>
	/**
	 * status:   Boolean、 String
	 * 点的状态，已预设 success（status === true） 与 error（status === false） 状态颜色
	 * 其余颜色用的时候设置
	 */

	export default {
		name: 'status-dot',
		inheritAttrs: false,
		functional: true,
		props: {
			status: {
				type: [String, Boolean],
				default: ''
			},
			suffix: {
				type: Boolean,
				default: false
			},
			processing: Boolean
		},
		render(h, context){
			let preCls = 'status-dot', processCls = 'status-dot--processing'
			let { props: { status, suffix, processing }, data: { staticClass, staticStyle, attrs }  } = context, cls = '', suffCls = suffix ? `${preCls}--after` : ''

			if(typeof status === 'boolean'){
				cls = status ? `${preCls}--success` : `${preCls}--error`
			}else if(status !== ''){
				cls = `${preCls}--${status}`
			}else{
				cls = ''
			}

			return h('span', {
				class: [preCls, cls, suffCls, processing ? processCls : '', staticClass],
				attrs,
				style: staticStyle
			}, context.slots().default)
		}
	}
</script>

<style lang="less">
	.status-dot{

		@defaultColor: #c0c4cc;
		@successColor: #52c41a;
		@errorColor: #f5222d;
		@primaryColor: #1890ff;

		position: relative;display: inline-block;padding-left: 16px; height: 16px;line-height: 16px;
		& + &{margin-left: 8px;}
		&:before{
			content: '';
			position: absolute;
			left: 4px;top: 4px;
			width: 8px;height: 8px;
			border-radius: 50%;
			background-color: @defaultColor;
		}

		&--primary:before{background-color: @primaryColor;}
		&--success:before{background-color: @successColor;}
		&--error:before{background-color: @errorColor;}

		&--after{
			padding-left: 0;padding-right: 16px;
			&:before{
				left: initial;right: 4px;
			}
		}

		&--processing{
			&:after{
				content: '';
				position: absolute;left: 4px;top: 4px;
				width: 8px;height: 8px;
				border-radius: 50%;
				background-color: @defaultColor;
				animation: statusDotProcessing 1.2s ease-in-out infinite
			}

			&.status-dot--primary:after{background-color: @primaryColor;}
			&.status-dot--success:after{background-color: @successColor;}
			&.status-dot--error:after{background-color: @errorColor;}
		}

	}

	@keyframes statusDotProcessing{
		0% {
        transform: scale(.8);
        opacity: .8
    }

    100% {
        transform: scale(2.4);
        opacity: 0
    }
	}
</style>