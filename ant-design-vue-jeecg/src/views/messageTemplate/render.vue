<template>
  <div>
    <a-form-model-item label="文本信息" prop="content" v-if="type == 'text'" :rules="[{required: true,message:'文本信息不能为空'}]">
      <a-textarea v-model="data.content" :autoSize="{ minRows: 5, maxRows: 16 }" placeholder="请输入文本信息"  />
    </a-form-model-item>

    <a-form-model-item label="选择素材" prop="material"  v-if="type == 'image'" class="template-message-type" :rules="[{validator: customValidate,message:'请选择图片素材'}]">
      <div class="message-media-list">
        <div class="select-media-btn" @click="selectMaterial">
          <img v-if="data.cspMediaUrl" :src="data.cspMediaUrl" style="width:100%;height:100%" />
          <div v-else>
            <a-icon type="plus" /><span>添加图片</span>
          </div>
        </div>
      </div>
    </a-form-model-item>

    <a-form-model-item label="选择素材" prop="material"  v-if="type == 'video'" class="template-message-type" :rules="[{validator: customValidate,message:'请选择视频素材'}]">
      <div class="message-media-list">
        <div class="select-media-btn" @click="selectMaterial">
          <img v-if="data.cspThumbnailMediaUrl" :src="data.cspThumbnailMediaUrl" style="width:100%;height:100%" />
          <div v-else>
            <a-icon type="plus" /><span>添加视频</span>
          </div>
        </div>
      </div>
    </a-form-model-item>

    <a-form-model-item label="选择素材" prop="material"  v-if="type == 'audio'" class="template-message-type" :rules="[{validator: customValidate,message:'请选择音频素材'}]">
      <div class="message-media-list">
        <div class="select-media-btn" @click="selectMaterial">
          <img v-if="data.cspMediaUrl" src="@assets/img/audio.png"/>
          <div v-else>
            <a-icon type="plus" /><span>添加音频</span>
          </div>
        </div>
      </div>
    </a-form-model-item>

    <a-form-model-item label="选择素材" prop="material"  v-if="type == 'file'" class="template-message-type" :rules="[{validator: customValidate,message:'请选择文件素材'}]">
      <div class="message-media-list">
        <div class="select-media-btn" @click="selectMaterial">
          <img v-if="data.cspMediaUrl" src="@assets/img/file.png"/>
          <div v-else>
            <a-icon type="plus" /><span>添加文件</span>
          </div>
        </div>
      </div>
    </a-form-model-item>

    <template v-if="type == 'location' ">
      <a-form-model-item label="位置信息" prop="title">
        <locationMap @end="selectLocation" :location="geo" map-key="2b1f8d9a757a45754b0b1a85dd0d5553" />
      </a-form-model-item>
      <!-- <a-form-model-item label="位置名称" prop="title">
        <a-input  placeholder="位置名称" :max-length="24" readonly v-model="geo.title" :auto-focus="true" />
      </a-form-model-item>
      <a-form-model-item label="经度" prop="longitude"  :rules="[{validator: geoValidate,pattern:/^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/,message:'经度不正确',type:'longitude'}]">
        <a-input  placeholder="例如:116.403963" readonly v-model="geo.longitude" />
      </a-form-model-item>
      <a-form-model-item label="纬度" prop="latitude"  :rules="[{validator: geoValidate,pattern:/^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/,message:'纬度不正确',type:'latitude'}]">
        <a-input  placeholder="例如:39.915119" readonly v-model="geo.latitude" />
      </a-form-model-item> -->

    </template>

  </div>

</template>

<script>
import locationMap from "@comp/locationMap"
export default {
  name:'template-render',
  components: {
    locationMap
  },
  props: {
    data: Object,
    type: String
  },
  inject:['selectMaterialModal'],
  data() {
    return {
      geo: {
        title:"",
        longitude:"",//经度
        latitude:""//纬度
      },
    }
  },
  watch: {
    geo() {
      this.data.content = `geo:${this.geo.latitude},${this.geo.longitude};crs=gcj02;u=0;rcs-1=${encodeURIComponent(this.geo.title)}`
    }
  },
  methods: {
    selectLocation(data) {
      this.geo.title = data.name
      this.geo.longitude = data.lng
      this.geo.latitude = data.lat
    },
    geoValidate(rule,value,callback) {
      let {pattern,type,message} = rule
      if(pattern.test(this.geo[type])) {
        callback()
      } else {
        callback(new Error())
      }
    },
    customValidate(rule, value, callback) {
      if(!this.data.cspMediaUrl) {
        callback(new Error())
      } else {
        callback()
      }
    },
    selectMaterial() {
      this.selectMaterialModal(this.type)
    }
  }
}
</script>
