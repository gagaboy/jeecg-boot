<template>
	<div>
		<!--触发器-->
		<div v-if="node.nodeType==='trigger'" class="card">
			<div @click="nodeRightMenu"  class="draw-flex-center card-top draw-cursor-pointer">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round">
  						<a-icon type="thunderbolt" :style="{ fontSize: '10px', color: '#4791FB' }"  />
  					</span>
					<span class="card-txt">触发器</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" style="color: #fff"></a-icon>
							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType" ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<ul v-if="(node.inputContents && node.inputContents.length) || node.ruleExpr" class="card-bottom-ul">
					<li v-for="(item, index) in node.inputContents" :key="index" class="card-bottom-li">
						<div class="card-point"></div>
						<div class="card-bottom-li-txt">{{item}}</div>
					</li>
					<li v-if="node.ruleExpr" class="card-bottom-li">
						<div class="card-point"></div>
						<div class="card-bottom-li-txt">{{node.ruleExpr}}</div>
					</li>
				</ul>

				<!--空的时候-->
				<div v-else class="draw-flex-center card-bottom-empty">
					<a-icon type="ios-compose-outline" size="36" color="#c5dafd"></a-icon>
				</div>
			</div>
		</div>

		<!--提问动作-->
		<div v-if="node.nodeType==='ask'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
						<!--<a-icon type="help" size="10" color="#ffffff"></a-icon>-->
  						<a-icon type="question" :style="{ fontSize: '10px', color: '#ffffff' }" />
  					</span>
					<span class="card-txt" style="color: #000000;">提问动作</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType" ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1">{{node.nodeName}}</div>
					<div class="card-bottom-txt2">{{node.onceReplyModeLabel}}</div>
				</div>

				<ul class="card-bottom-ul card-bottom-space">
					<li v-for="(item, index) in node.inputContents" :key="index" class="card-bottom-li">
						<div class="card-point"></div>
						<div v-if="item.replyType == 'text'" class="card-bottom-li-txt">{{item.originalMessage}}</div>
						<textOverflowSuffix v-else-if="item.replyType == 'image' || item.replyType == 'voice' || item.replyType == 'video' || item.replyType == 'file'"  :textOverflow="showTitle(item)"></textOverflowSuffix>
						<div v-else class="card-bottom-li-txt cat-show-title" style="-webkit-line-clamp:1;word-break:break-all;word-wrap: break-word;">{{showTitle(item)}}</div>
					</li>
				</ul>

				<div class="draw-flex-center card-bottom-space">
					<div class="card-bottom-txt2" style="min-width: 85px;">验证回答内容</div>
					<div class="card-bottom-txt3">{{node.askmodel}}</div>
				</div>
				<div v-if="node.askmodel == '正则表达式'" class="draw-flex-center card-bottom-space">
					<div class="card-bottom-txt2" style="min-width: 85px;">正则表达式</div>
					<div class="card-bottom-txt3">{{node.answerRuleExpr}}</div>
				</div>

				<div v-if="node.askmodel != '不验证'" class="draw-flex-center card-bottom-space">
					<div class="card-bottom-txt2" style="min-width: 85px;">验证失败后回复</div>
					<div v-for="(item, index) in node.askFailContent" class="card-bottom-txt3">{{item.originalMessage}}</div>
				</div>
			</div>
		</div>

		<!--发送消息动作-->
		<div v-if="node.nodeType==='send'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10px" height="10px" viewBox="0 0 24 24" version="1.1">
								<g stroke="#fff" stroke-width="1" fill="none" fill-rule="evenodd">
										<path d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z" fill="#FFFFFF"/>
								</g>
						</svg>

  					</span>
					<span class="card-txt" style="color: #000000;">发送消息动作</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType" ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1">{{node.nodeName}}</div>
					<div class="card-bottom-txt2">{{node.onceReplyModeLabel}}</div>
				</div>

				<ul class="card-bottom-ul card-bottom-space">
					<li v-for="(item, index) in node.inputContents" :key="index" class="card-bottom-li">
						<div class="card-point"></div>
						<!--<div  class="card-bottom-li-txt">{{item.originalMessage}}</div>-->
						<div v-if="item.replyType == 'text'" class="card-bottom-li-txt">{{item.originalMessage}}</div>
						<textOverflowSuffix v-else-if="item.replyType == 'image' || item.replyType == 'voice' || item.replyType == 'video' || item.replyType == 'file'"  :textOverflow="showTitle(item)"></textOverflowSuffix>
						<div v-else class="card-bottom-li-txt cat-show-title" style="-webkit-line-clamp:1;word-break:break-all;word-wrap: break-word;">{{showTitle(item)}}</div>
					</li>
				</ul>
			</div>
		</div>

		<!--任务切换动作-->
		<div v-if="node.nodeType==='exchange'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
					  <svg t="1597216726074" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1883" width="10" height="10"><path d="M566.933333 353.525333A254.965333 254.965333 0 0 0 512 512c0 60-15.477333 116.373333-42.666667 165.376a342.026667 342.026667 0 0 1-54.890666 73.546667C352.501333 814.112 266.154667 853.333333 170.666667 853.333333H85.333333a42.666667 42.666667 0 0 1 0-85.333333h85.333334c81.546667 0 154.186667-38.122667 201.066666-97.525333A254.965333 254.965333 0 0 0 426.666667 512c0-60 15.477333-116.373333 42.666666-165.376a342.293333 342.293333 0 0 1 54.890667-73.546667C586.165333 209.888 672.512 170.666667 768 170.666667h67.658667l-97.824-97.834667a42.666667 42.666667 0 0 1 59.274666-61.376c0.362667 0.341333 0.704 0.693333 1.056 1.045333l170.666667 170.666667a42.666667 42.666667 0 0 1 0 60.330667l-170.666667 170.666666C789.834667 422.496 778.912 426.666667 768 426.666667s-21.834667-4.170667-30.165333-12.501334a42.666667 42.666667 0 0 1 0-60.330666L835.658667 256H768c-81.546667 0-154.186667 38.122667-201.066667 97.525333zM85.333333 256h85.333334c81.546667 0 154.186667 38.122667 201.066666 97.525333a425.728 425.728 0 0 1 42.72-80.437333C352.501333 209.888 266.154667 170.666667 170.666667 170.666667H85.333333a42.666667 42.666667 0 0 0 0 85.333333z m712.832 353.834667a42.666667 42.666667 0 0 0-61.376 59.274666c0.330667 0.362667 0.682667 0.704 1.045334 1.056L835.658667 768H768c-81.546667 0-154.186667-38.122667-201.066667-97.525333a425.493333 425.493333 0 0 1-42.730666 80.437333C586.165333 814.112 672.512 853.333333 768 853.333333h67.658667l-97.824 97.834667a42.666667 42.666667 0 0 0 59.274666 61.376c0.362667-0.330667 0.704-0.682667 1.056-1.045333l170.666667-170.666667a42.666667 42.666667 0 0 0 0-60.330667l-170.666667-170.666666z" p-id="1884" fill="#ffffff"></path></svg>
  					</span>
					<span class="card-txt" style="color: #000000;">任务切换动作</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType" ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1">{{node.nodeName}}</div>
				</div>

				<div class="draw-flex-center card-bottom-space">
					<div class="card-bottom-txt2">执行</div>
					<div class="card-bottom-txt3">{{node.exchangeName}}</div>
				</div>
			</div>
		</div>

		<!--0721新增加入用户组节点展示和移除出用户组-->
		<div v-if="node.nodeType==='joinUserGroup' || node.nodeType==='removeUserGroup'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
            <!--<a-icon type="android-add-circle" size="10" color="#ffffff"></a-icon>-->
            	<svg v-if="node.nodeType==='joinUserGroup'" t="1597217679136" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4411" width="10" height="10"><path d="M512 51.2C258.048 51.2 51.2 258.048 51.2 512s206.848 460.8 460.8 460.8 460.8-206.848 460.8-460.8S765.952 51.2 512 51.2z m235.52 481.28H532.48v215.04c0 11.264-9.216 20.48-20.48 20.48s-20.48-9.216-20.48-20.48V532.48H276.48c-11.264 0-20.48-9.216-20.48-20.48s9.216-20.48 20.48-20.48h215.04V276.48c0-11.264 9.216-20.48 20.48-20.48s20.48 9.216 20.48 20.48v215.04h215.04c11.264 0 20.48 9.216 20.48 20.48s-9.216 20.48-20.48 20.48z" p-id="4412" fill="#ffffff"></path></svg>
  						<svg v-if="node.nodeType==='removeUserGroup'" t="1597217713399" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5252" width="10" height="10"><path d="M504.364889 16.445242c-277.865486 0-503.111837 225.245343-503.111837 503.111837S226.499403 1022.665894 504.364889 1022.665894c277.865486 0 503.109823-225.24333 503.109823-503.108816S782.230375 16.445242 504.364889 16.445242zM755.674123 535.769733c0 18.816426-15.281298 34.097724-34.122895 34.097724L286.660011 569.867457c-18.841598 0-34.097724-15.281298-34.097724-34.097724l0-7.27163c0-18.81844 15.256126-34.097724 34.097724-34.097724l434.891217 0c18.841598 0 34.122895 15.279284 34.122895 34.097724L755.674123 535.769733z" p-id="5253" fill="#ffffff"></path></svg>
					</span>
					<span class="card-txt" style="color: #000000;">{{node.nodeType==='joinUserGroup' ? '加入用户组动作' : '组中移除用户动作'}}</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType"  ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1">{{node.nodeName}}</div>
				</div>

				<div class="draw-flex-center card-bottom-space">
					<div class="card-bottom-txt2">{{node.nodeType==='joinUserGroup' ? '将当前用户添加到' : '将当前用户从下方组中移除'}}</div>
					<div class="card-bottom-txt3">{{node.groupName}}</div>
				</div>
			</div>
		</div>

		<!--判断-->
		<div v-if="node.nodeType==='judge'" class="card" >
			<div @click="nodeRightMenu"  class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
            <!--<a-icon type="android-compass" size="10" color="#ffffff"></a-icon>-->
            <a-icon type="compass" :style="{ fontSize: '10px', color: '#ffffff' }" />
  					</span>
					<span class="card-txt" style="color: #000000;">判断</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type == 'editNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else-if="item.type == 'deleteNode'" confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType"  ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<!--0511修改判断节点-->
			<div v-for="(item, citylistindex) in node.judgeModuleList" @click="nodeRightMenu"  :key="item.jsplumbNodeId" :id="item.jsplumbNodeId" class="judgment-branch">
				<div v-show="item.showJudgeModule" >
				<div class="draw-flex-center judgment-branch-top">
					<div>{{item.judgeName}}</div>
					<div v-for="(item1, index) in list" :key="index">
						<template v-if="item.todoMenus[item1.type]">
						<a-icon @click.stop="clickAll" data-type="addNode" data-nodetype="judge" :data-citylistindex="citylistindex" class="card-topr-icon draw-cursor-pointer" type="plus" ></a-icon>
						</template>
					</div>
				</div>
				<!--非默认分支-->
				<div v-if="!item.isDefaultBranch"   class="draw-flex-center card-bottom draw-cursor-pointer" >
					<div class="draw-flex-center card-answer" style="flex-direction: column; align-items: flex-start; ">
						<div class="card-bottom-txt2" style="margin-top: 8px;">执行当前分支，需要符合下述 <span class="card-bottom-txt4">{{item.satisfy}}</span> 判断项</div>
					</div>
					<ul  class="card-bottom-ul card-bottom-space">
						<li v-for="(project, ind) in item.judgeProject" :key="ind" class="card-bottom-li">
							<div class="card-point"></div>
							<div>
								<div v-for="(item, index) in project.inputOne" :key="index" class="cat-line-break">{{item.originalMessage}}</div>
								<div class="original-message">
									<div class="card-bottom-txt2" style="min-width: 25px; margin-right: 5px; ">{{project.equal}}</div>
									<template v-if="!hiddenLastInput(project.equal)">
										<div v-for="(item, index) in project.inputTwo" :key="index" class="cat-line-break">{{item.originalMessage}}</div>
									</template>
								</div>
							</div>
						</li>
					</ul>
				</div>

				<!--默认分支-->
				<div v-if="item.isDefaultBranch"   class="draw-flex-center card-bottom draw-cursor-pointer" style="min-height: auto;">
					<div class="draw-flex-center card-answer" style="flex-direction: column; align-items: flex-start;">
						<div class="card-bottom-txt2" >其他分支判断都不成立时，则执行默认分支</div>
					</div>
				</div>

				</div>
			</div>
		</div>

		<!--新增http请求-->
		<div v-if="node.nodeType==='sendhttp'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
  						<!--<a-icon type="earth" size="10" color="#ffffff"></a-icon>-->
  						<svg t="1597217343815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2710" width="10" height="10"><path d="M763.733333 741.973333c-11.093333-34.133333-43.093333-59.306667-81.066666-59.306666h-42.666667v-128a42.666667 42.666667 0 0 0-42.666667-42.666667H341.333333v-85.333333h85.333334a42.666667 42.666667 0 0 0 42.666666-42.666667V298.666667h85.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-17.493333a340.650667 340.650667 0 0 1 123.733333 546.133333M469.333333 850.346667c-168.533333-20.906667-298.666667-164.266667-298.666666-338.346667 0-26.453333 3.413333-52.053333 8.96-76.373333L384 640v42.666667a85.333333 85.333333 0 0 0 85.333333 85.333333m42.666667-682.666667A426.666667 426.666667 0 0 0 85.333333 512a426.666667 426.666667 0 0 0 426.666667 426.666667 426.666667 426.666667 0 0 0 426.666667-426.666667A426.666667 426.666667 0 0 0 512 85.333333z" fill="#ffffff" p-id="2711"></path></svg>
  					</span>
					<span class="card-txt" style="color: #000000;">发送http请求</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType"  ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1">{{node.nodeName}}</div>
				</div>

				<div class="draw-flex-center card-bottom-space">
					<div class="card-bottom-txt2" >请求地址</div>
					<div class="card-bottom-txt3 draw-text-two" style="-webkit-line-clamp: 3;">{{node.httpRequestUrl}}</div>
				</div>
			</div>
		</div>

		<!--新增默认回复卡片-->
		<div v-if="node.nodeType==='defaultReply'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<span class="draw-flex-center card-round" style="background: #4791FB;">
            <!--<a-icon type="clipboard" size="10" color="#ffffff"></a-icon>-->
            <svg t="1597217430898" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3560" width="10" height="10"><path d="M322 321l384 0c-3.376-40-19.458-70.9-55.842-80.712-0.892-0.238-2.24-0.848-3.134-1.082-24.008-6.848-42.024-15.306-42.024-41.562L605 156.454C605 105.382 563.952 64 512.98 64c-50.932 0-91.98 41.382-91.98 92.454l0 41.19c0 26.256-17.184 34.338-41.194 41.186-0.894 0.234-1.6 1.22-2.532 1.458C340.892 250.1 325.854 281 322 321zM513.98 128.79c15.23 0 27.582 12.39 27.582 27.664 0 15.308-12.352 27.7-27.582 27.7-15.228 0-27.544-12.39-27.544-27.7C486.436 141.18 498.752 128.79 513.98 128.79z" p-id="3561" fill="#ffffff"></path><path d="M811.222 127 663 127l0 27.976c0 21.166 18.386 38.024 39.014 38.024l74.424 0c13.334 0 24.198 10.87 24.88 24.39l0.17 654.2c-0.644 12.864-10.606 23.092-23.028 24.034l-528.836 0.062c-12.422-0.942-22.298-11.39-22.944-24.252l-0.17-654.028c0.644-13.522 11.716-24.406 25.012-24.406l74.462 0c20.626 0 37.014-16.858 37.014-38.024L362.998 127l-146.262 0C186.5 127 161 152.116 161 183.15l0 720.76c0 31.004 25.5 57.09 55.738 57.09L513.98 961l297.242 0c30.276 0 53.778-26.086 53.778-57.09L865 183.15C865 152.116 841.498 127 811.222 127z" p-id="3562" fill="#ffffff"></path><path d="M289 385l224 0 0 64-224 0 0-64Z" p-id="3563" fill="#ffffff"></path><path d="M289 769l320 0 0 64-320 0 0-64Z" p-id="3564" fill="#ffffff"></path><path d="M289 641l258 0 0 64-258 0 0-64Z" p-id="3565" fill="#ffffff"></path><path d="M289 513l416 0 0 64-416 0 0-64Z" p-id="3566" fill="#ffffff"></path></svg>
  					</span>
					<span class="card-txt" style="color: #000000;">默认回复</span>
				</div>
				<div class="card-topr">

						<a-popconfirm confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" type="delete"  ></a-icon>
							</a-popconfirm>

				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1" >{{node.nodeName}}</div>
				</div>

				<div v-for="(item, index) in node.replyCollection" :key="index" class="draw-flex-center card-bottom-space" style="align-items: flex-start;">
					<template>
						<div class="card-bottom-txt2" style="flex-shrink: 0;">{{item.replyNameMy}}</div>
						<!--<div class="draw-text-two card-bottom-txt3">{{showTitle(item, 'defaultReply')}}</div>-->
						<textOverflowSuffix v-if="item.replyType == 'image' || item.replyType == 'voice' || item.replyType == 'video' || item.replyType == 'file'"  :textOverflow="showTitle(item, 'defaultReply')"></textOverflowSuffix>
						<div v-else class="draw-text-two card-bottom-txt3">{{showTitle(item, 'defaultReply')}}</div>
					</template>
				</div>
			</div>
		</div>
		
		<!--10.10新增变量管理节点-->
		<div v-if="node.nodeType==='manageVariables'" class="card">
			<div @click="nodeRightMenu" class="draw-flex-center card-top draw-cursor-pointer" style="background: #ffffff;">
				<div class="draw-flex-center card-topl">
					<!--<span class="draw-flex-center card-round" style="background: #4791FB;">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10px" height="10px" viewBox="0 0 24 24" version="1.1">
								<g stroke="#fff" stroke-width="1" fill="none" fill-rule="evenodd">
										<path d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z" fill="#FFFFFF"/>
								</g>
						</svg>

  					</span>-->
  					<span class="draw-flex-center card-round" style="background: #4791FB;">
			            <!--<a-icon type="android-compass" size="10" color="#ffffff"></a-icon>-->
			            <a-icon type="search" :style="{ fontSize: '10px', color: '#ffffff' }" />
  					</span>
					<span class="card-txt" style="color: #000000;">变量管理</span>
				</div>
				<div class="card-topr">
					<div v-for="(item, index) in list" :key="index">
						<template v-if="node.todoMenus[item.type]">
							<a-icon v-if="item.type != 'deleteNode'" @click.stop="clickAll" :data-type="item.type" class="card-topr-icon draw-cursor-pointer" :type="item.iconType" ></a-icon>

							<a-popconfirm v-else confirm :transfer="true" popper-class="cat-drae-card-poptip"  title="确定删除此节点吗？" ok-text="确定" cancel-text="取消"  @visibleChange="visibleChange" @confirm="ok" @cancel="cancel" :width="213">
								<div slot="title"  >
									<div style='padding-left: 20px;'>确定删除此节点吗？</div>
								</div>
								<a-icon @click.stop="clickAll"  class="card-topr-icon draw-cursor-pointer" :class="[ clickStyle ? 'clickColor' : 'clickCloseColor' ]" :type="item.iconType" ></a-icon>
							</a-popconfirm>
						</template>
					</div>
				</div>
			</div>

			<div @click="nodeRightMenu" class="draw-flex-center card-bottom draw-cursor-pointer">
				<div class="draw-flex-center card-answer">
					<div class="card-bottom-txt1">{{node.nodeName}}</div>
				</div>

				<ul class="card-bottom-ul card-bottom-space">
					<li v-for="(item, index) in node.variableConfig" :key="index" class="card-bottom-li">
						<div class="card-point"></div>
						<div class="card-bottom-li-txt">{{item.varSlotName}}={{item.originalVarSlotValue}}</div>
					</li>
				</ul>
			</div>
		</div>


	</div>
</template>
<script>
	import { getStrRealLength, cutStrReal, showEllipsis} from './assets/js/util.js'  //js判断字符串真实长度
	
	import textOverflowSuffix from './menuCommon/textOverflowSuffix' //11.09新增文件名超出后显示后缀

	export default {
		name: 'catDrawCard',
		components: {
			textOverflowSuffix,
		},
		props: {
			node: Object,
		},
		data: function() {
			return {
				//显示不同的弹窗
				nodeType: 'trigger', //sideBar, trigger, ask, send, exchange, judge, addNew

				list: [
					{
						iconType: 'delete',
						title: '删除',
						type: 'deleteNode',
						show: true,
					},
					{
						iconType: 'form',
						title: '编辑',
						type: 'editNode',
						show: true,
					},
					{
						iconType: 'plus',
						title: '添加节点',
						type: 'addNode',
						show: true,
					},
				],
				clickStyle: false,  //是否是点击的状态
			}
		},
		computed:{
        showTitle:function () {
		       return function (item, type) {
		       		var result = item.originalMessage || ''
		       		if(item.replyType == 'image') {
//		       			result = '图片-' + item.reply.fileName
								if(type == 'defaultReply') {
									result = this.judgeLength(item.reply)
								} else {
									result = '图片-' + this.judgeLength(item.reply)
								}
		       		} else if(item.replyType == 'voice') {
//		       			result = '音频-' + item.reply.fileName
								if(type == 'defaultReply') {
									result = this.judgeLength(item.reply)
								} else {
									result = '音频-' + this.judgeLength(item.reply)
								}
		       		} else if(item.replyType == 'video') {
//		       			result = '视频-' + item.reply.fileName

								if(type == 'defaultReply') {
									result =  this.judgeLength(item.reply)
								} else {
									result = '视频-' + this.judgeLength(item.reply)
								}
		       		} else if(item.replyType == 'singleCard') {
//		       			result = '单卡-' + item.reply.card.media.fileName
//								result = '单卡-' + item.reply.card.title
								if(type == 'defaultReply') {
									result = item.reply.card.originalTitle
								} else {
									result = '单卡-' + item.reply.card.originalTitle
								}
		       	} else if(item.replyType == 'manyCards') {
		       			var cards = item.reply.cards
		       			var res = []
		       			cards.forEach((item1) => {
//									res.push(item1.title)
									res.push(item1.originalTitle)
		       			})
		       			if(type == 'defaultReply') {
									result = res.join('/')
								} else {
									result = '多卡-' + res.join('/')
								}
		       		} else if(item.replyType == 'conversionTemplate') {
		       			result = item.reply && item.reply.conversionTemplateName || '' //10.10新增选择的转换模板名
		       		} else if(item.replyType == 'file') {
						if(type == 'defaultReply') {
							result = this.judgeLength(item.reply)
						} else {
							result = '文件-' + this.judgeLength(item.reply)
						}
		       		}
		          return result
		        }
		    },
		    hiddenLastInput:function () {
		       return function (type) {
		       	var hiddenLastArr = ['存在', '不存在', '判断成立', '判断不成立']
		       	//说明是这几个，不显示下面的判断项
		       	if(hiddenLastArr.indexOf(type) > -1) {
		       		return true
		       	} else {
		       		return false
		       	}
		       }
		    },
		    //排序判断节点
		     filterJudge(){
		     			var result = []
		     			var node = this.node
              if(node.nodeType==='judge') {
              		var judgeModuleList = node.judgeModuleList
              		var isnotDefaultBranch = this.findJudgeByType(judgeModuleList, false)
              		var isDefaultBranch = this.findJudgeByType(judgeModuleList, true)
              		result = [...isnotDefaultBranch, ...isDefaultBranch]
              }
             	return result
          }
    },
		methods: {
			//找到对应的节点信息
			findJudgeByType(arr, type) {
				var res = []
				arr.forEach((item) => {
					if(item.isDefaultBranch == type) {
						res.push(item)
					}
				})
				return res
			},
//			图片/音频/视频： 显示一行打点，命名为除了后缀名外后方保留三个字段，中间打点
			judgeLength(reply = {}) {
				var that = this
				var fileName = reply.fileName
	      	var materialFileType = reply.materialFileType
	      	var name = fileName
	      	if(fileName && materialFileType) {
	      		name =  fileName + '.' + materialFileType
	      	}
	      	return name
//		      	return showEllipsis(name, 28)
			},
			ok(e) {
				this.deleteNode()
			},
			cancel() {},
			clickAll(e) {
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				if(typeof this[clickType] == 'function') {
					this[clickType](dataset)
					return
				}
			},
			addNode(dataset) {
				var jsplumbNodeId = this.node.jsplumbNodeId
				if(dataset.nodetype == 'judge') {
					var citylistindex = dataset.citylistindex
					jsplumbNodeId = this.node.judgeModuleList[dataset.citylistindex].jsplumbNodeId
				}
				this.$emit('addNode', jsplumbNodeId)
			},
			editNode() {
				this.$emit('editNode', this.node.jsplumbNodeId)
			},
			deleteNode() {
				this.$emit('deleteNode', this.node.jsplumbNodeId)
			},
			nodeRightMenu(top) {
				if(this.clickStyle) {
					return
				}
				this.$emit('nodeRightMenu', this.node.jsplumbNodeId)
			},
			//0812新增设置样式
			visibleChange(visible) {
				this.clickStyle = visible
			},
		},
		created() {
			var that = this
		},
		mounted() {

		},
	}
</script>

<style lang='less' scoped>
	@import './assets/css/default.css';
	/*---触发器------*/
	.card {
		box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.1), 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
		border-radius: 4px;
		background: #ffffff;
		width: 278px;
	}

	.card-top {
		width: 278px;
		height: 40px;
		background: rgba(71, 145, 251, 1);
		border-radius: 4px 4px 0px 0px;
		justify-content: space-between;
		padding: 0 16px;
		border-bottom: 1px solid #EBEEF5;
	}

	.card-txt {
		color: #ffffff;
		font-weight: 500;
	}

	.card-round {
		width: 16px;
		height: 17px;
		border-radius: 50%;
		background: #ffffff;
		margin-right: 10px;
	}

	.card-topr {
		display: flex;
		flex-direction: row;
	}

	.card-topr-icon {
		margin-left: 10px;
		font-size: 16px;
		color: #9F9AA0;
	}

	.card-bottom {
		width: 278px;
		border-radius: 0 0 4px 4px;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px 16px;

		justify-content: flex-start;
		min-height: 100px;
	}

	.card-bottom-empty {
		width: 100%;
		height: 84px;
	}

	.card-point {
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(159, 154, 160, 1);
		margin-top: 5px;
		margin-right: 10px;

		flex-shrink: 0; /*防止左侧被挤压*/
	}

	.card-bottom-li {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.85);
		line-height: 17px;
		display: flex;
		margin-bottom: 5px;
	}

	.card-bottom-li:last-child {
		margin-bottom: 0;
	}
	/*提问动作*/

	.card-answer {
		justify-content: space-between;
		width: 100%;
	}

	.card-bottom-txt1 {
		font-size: 14px;
		font-weight: 500;
		color: #000;
	}

	.card-bottom-txt2 {
		font-size: 10px;
		color: rgba(159, 154, 160, 1);
		/*0514新增不可挤压*/
		flex-shrink: 0;
	}

	.card-bottom-txt3 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.85);
		margin-left: 12px;

    word-wrap: break-word;
    word-break: break-all;
	}

	.card-bottom-space {
		margin-top: 8px;
	}

	.card-bottom-txt4 {
		color: #4A90E2;
	}
	/*超过3行显示点点点*/
	.card-bottom-li-txt {
		word-wrap:break-word;
		width: 230px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
		-webkit-line-clamp: 2;
	}
	.clickColor {
		color: #4791FB;
	}
	.clickCloseColor {
		color: #9F9AA0;
	}
	.original-message {
		display: flex;
		align-items: flex-start;
		margin-top: 5px;
		justify-content: flex-start;
		flex-direction: row;
	}

		/*0511新增判断节点*/
	.judgment-branch-top {
		width:278px;
		height:36px;
		background:rgba(249,249,249,1);
		justify-content: space-between;
		padding: 0 16px;
	}

  /*自动换行*/
  .cat-line-break {
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
