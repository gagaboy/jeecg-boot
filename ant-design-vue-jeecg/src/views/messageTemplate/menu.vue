<template>
  <!-- <ul class="float-menu-data-list" v-if="isAdd">
    <li v-for="menu in menuDataList" :key="menu.text" @click="addMenu(menu)"><a-icon class="icon" :type="menu.icon" /> {{menu.text}}</li>
  </ul> -->
  <div >
    <!-- <div class="find-card-title">{{findCardTitle(menuData.type)}}</div> -->
    <a-form-model class="float-menu-form" ref="form" :model="menuData">
      <a-row>
        <a-form-model-item prop="type" label="按钮类型" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-select v-model="menuData.type">
            <a-select-option  v-for="item in menuTypeList" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="description" label="显示文字" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.description" placeholder="请输入显示文字" />
        </a-form-model-item>
      </a-row>

      <!-- 打开URL -->
      <a-row v-if="menuData.type === 'url'">
        <a-form-model-item prop="application" label="打开方式" default-value="webview" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-select v-model="menuData.application" placeholder="请选择打开方式">
            <a-select-option value="webview">webview打开</a-select-option>
            <a-select-option value="browser">浏览器打开</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="链接地址" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.content" placeholder="请输入链接地址" />
        </a-form-model-item>
      </a-row>

      <!-- APP调起 -->
      <a-row v-if="menuData.type == 'openApp'">
        <a-col>
          <a-form-model-item label="调起地址" :label-col="{span:5}" :wrapper-col="{span:16}">
            <a-input v-model="menuData.openAppAndroid" placeholder="请输入调起地址" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 拨打电话 -->
      <a-row v-if="menuData.type == 'call'">
        <a-col>
          <a-form-model-item label="电话号码"  :label-col="{span:5}" :wrapper-col="{span:16}">
            <a-input v-model="menuData.callPhone" placeholder="请输入电话号码" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 地理位置 -->
      <a-row v-if="menuData.type == 'sendAddress'">
        <a-form-model-item label="位置名称" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.sendAddressPlaceName" placeholder="请输入位置名称" />
        </a-form-model-item>
        <a-form-model-item label="经度" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.sendAddressLongitude" placeholder="请输入经度" />
        </a-form-model-item>
        <a-form-model-item label="纬度" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.sendAddressLatitude" placeholder="请输入纬度" />
        </a-form-model-item>
      </a-row>

      <!-- 拍摄按钮 -->
      <a-row v-if="menuData.type == 'screen'">
        <a-col>
          <a-form-model-item label="联系方式"  :label-col="{span:5}" :wrapper-col="{span:16}">
            <a-input v-model="menuData.targetContact" placeholder="请输入联系方式" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <!-- 调起指定联系人 -->
      <a-row v-if="menuData.type == 'bringUp'">
        <a-form-model-item label="联系方式" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.targetContact" placeholder="请输入联系方式" />
        </a-form-model-item>
        <a-form-model-item label="预发送内容" :label-col="{span:5}" :wrapper-col="{span:16}">
          <a-input v-model="menuData.presendContent" placeholder="请输入预发送内容" />
        </a-form-model-item>
      </a-row>

    </a-form-model>
  </div>

</template>

<script>
export default {
  name: 'floatMenu',
  props: {
    menuData: {
      type: Object,
      default() {
        return {
          type:'reply'
        }
      }
    },
  },
  data() {
    return {
      menuDataList: [
        {
          text: '回复信息',
          icon: "mail",
          field: {
            type: "reply",
            description: "回复信息",
          }
        },
        {
          text: '访问链接',
          icon: "link",
          field: {
            type: "url",
            description: "访问链接",
            content:""
          }
        },
        {

          text: '访问APP',
          icon: "mobile",
          field: {
            type: "openApp",
            description: "访问APP",
            openAppAndroid: "",//app地址
          }
        },      
        {
          text: '拨打电话',
          icon: "phone",
          field: {
            type: "call",
            description: "拨打电话",
            callPhone:""
          }
        }, 
        {
          text: '发送指定坐标',
          icon: "bank",
          field: {
            type: "sendAddress",
            description: "发送指定坐标",
          }
        },
        {
          text: '发送手机定位',
          icon: "environment",
          field: {
            type: "addressLocation",
            description: "发送手机定位",
            sendAddressPlaceName: "", // 位置名称
            sendAddressLongitude: "", // 位置纬度
            sendAddressLatitude: "", // 位置经度
          }
        },
        {
          text: '拍摄',
          icon: "camera",
          field: {
            type: "screen",
            description: "拍摄",
            targetContact:"", //联系人
          }
        },
        {
          text: '指定联系人发送',
          icon: "team",
          field: {
            type: "bringUp",
            description: "指定联系人发送",
            targetContact:"", //联系人
            presendContent:"",//预发送内容 
          }
        },
      ],


      menuTypeList: [
        {
          value: 'reply',
          label: '回复信息',
        },
        {
          value: 'url',
          label: '访问链接',
        },
        {
          value: 'openApp',
          label: '访问app',
        },
        {
          value: 'call',
          label: '拨打电话',
        },
        {
          value: 'sendAddress',
          label: '发送指定坐标',
        },
        {
          value: 'addressLocation',
          label: '发送手机定位',
        },
        {
          value: 'screen',
          label: '拍摄',
        },
        {
          value: 'bringUp',
          label: '指定联系人发送',
        },
      ],
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.descriptionInput.focus()
    // })
  },
  methods: {

  },

}
</script>

<style lang="less">
.find-card-title {
  color: fade(black, 85%);
  text-align: center;
  margin-bottom: 8px;
}
.float-menu-form {
  //width: 700px;
  .ant-form-item {
    margin-bottom: 8px;
  }
}
.float-menu-data-list {
  li {
    line-height: 36px;
    text-align: left;
    border-bottom: 1px solid #e3e3e3;
    margin-bottom: 3px;
    cursor: pointer;
    &:hover {
      color:#6157CC
    }
    .icon {
      margin-right: 5px;
    }
  }
}
</style>