<template>
  <div :class="[prefixCls]">
    <div
      :class="classes"
      @click="handleClick"
      @drop.prevent="onDrop"
      @paste="handlePaste"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
    >
      <input
        ref="input"
        type="file"
        :class="[prefixCls + '-input']"
        @change="handleChange"
        :multiple="multiple"
        :accept="accept"
      />
      <slot></slot>

      <!--0628新增上传封面图-->
      <div
        v-if="showValidateMsg"
        class="draw-flex-center"
        style="width: 100%; height: 166px; flex-direction: column; background: #FAFAFA;"
      >
        <template v-if="uploadSuccessFile[0]">
          <div class="upload-choose">
            <img class="upload-choose" :src="uploadSuccessFile[0]" />
          </div>
        </template>
        <!--上传前-->
        <template v-else>
          <a-icon type="plus" style="color: #260000; font-size: 30px;"></a-icon>
          <p class="draw-upload-title">请上传封面图</p>
        </template>
      </div>
    </div>
    <slot name="tip"></slot>
    <upload-list
      v-if="showUploadList"
      :files="fileList"
      @on-file-remove="handleRemove"
      @on-file-preview="handlePreview"
      @on-file-refresh="handleRefresh"
      @on-file-upload="handleUpload"
      :max-width="maxWidth"
    ></upload-list>

    <!--新增一键上传按钮-->
    <!--<Button v-if="!autoUpload  && fileList && fileList.length" :disabled="isdisabled"  size="small" @click.native="startUpload">一键上传按钮</Button>-->
    <a-button
      v-if="!autoUpload && fileList && fileList.length"
      :disabled="isdisabled"
      size="small"
      @click.native="startUpload"
      >一键上传按钮</a-button
    >

    <!--<input :form="form" :name="sendKey" type="hidden" v-model="uploadSuccessFile"/>-->
    <!--0623新增绑定公共组件里的提交-->
    <template v-if="showValidateMsg">
      <input
        :form="form"
        type="hidden"
        :name="sendKey"
        size="100"
        v-model="uploadSuccessFile[0]"
        v-validate="validate"
        :data-vv-as="fieldTitle"
        :data-vv-name="sendKey"
      />
      <span v-if="errors.has(sendKey)" class="m-form-error-tip">
        {{ validateMsg ? validateMsg : errors.first(sendKey) }}
      </span>
    </template>
    <input
      v-else
      :form="form"
      :name="sendKey"
      type="hidden"
      v-model="uploadSuccessFile"
    />

    <!--新增错误提示信息-->
    <span v-if="validateMsg" class="m-form-error-tip">
      {{ validateMsg }}
    </span>
  </div>
</template>
<script>
var index = 0;
//新增提供方法，去手动上传文件
//	this.$refs.upload.startUpload()
//	autoUpload: 是否自动上传

import UploadList from "./upload-list.vue";
import ajax from "./ajax";
import { oneOf } from "./utils/assist";
import Emitter from "./utils/emitter";

const prefixCls = "ro-upload";

export default {
  name: "ro-upload",
  mixins: [Emitter],
  components: { UploadList },
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    name: {
      type: String,
      default: "file"
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      validator(value) {
        return oneOf(value, ["select", "drag"]);
      },
      default: "select"
    },
    format: {
      type: Array,
      default() {
        return [];
      }
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number
    },
    beforeUpload: Function,
    onProgress: {
      type: Function,
      default() {
        return {};
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return {};
      }
    },
    onError: {
      type: Function,
      default() {
        return {};
      }
    },
    onRemove: {
      type: Function,
      default() {
        return {};
      }
    },
    onPreview: {
      type: Function,
      default() {
        return {};
      }
    },
    onExceededSize: {
      type: Function,
      default() {
        return {};
      }
    },
    onFormatError: {
      type: Function,
      default() {
        return {};
      }
    },
    defaultFileList: {
      type: Array,
      default() {
        return [];
      }
    },
    paste: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },

    //新增上传的文件名
    sendKey: {
      type: String
    },
    validate: [String, Object], //传入即可
    fieldTitle: {
      type: String,
      default: ""
    },
    id: String,
    form: String,
    //新增是否自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    //是否自动删除失败的文件
    deleteFailFile: {
      type: Boolean,
      default: true
    },
    //返回接口的取值
    field: {
      type: String,
      default: "fileUrl"
    },
    maxWidth: {
      type: String,
      default: "auto"
    }, //设置输入框的大小，因为需要做限制,如果不设置，默认为auto
    //是否显示loading动画
    showLoading: {
      type: Boolean,
      default: false
    },
    takeParameters: {
      type: Object,
      default() {
        return {};
      }
    }, //新增是否在返回里带上参数,用于在列表中上传的时候找到对应的数据
    //0623新增是否需要显示错误信息
    showValidateMsg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      dragOver: false,
      fileList: [],
      tempIndex: 1,
      //新增上传成功的列表数据
      validateMsg: "",
      uploadSuccessFile: null,
      isdisabled: false //按钮是否可点击
    };
  },
  //新增校验的方法
  mounted: function() {
    let root = this.$root;

    if (this.validate) {
      //监听form的验证消息
      if (this.form) {
        root.eventBus.$on("form_validate" + this.form, () => {
          this.judgeAllUpload();
        });
      } else {
        let idInfoArray = this.id.split("_");
        let formId = null;
        if (idInfoArray.length > 2) {
          formId = idInfoArray[0] + "_" + idInfoArray[1];
        } else {
          formId = idInfoArray[0];
        }
        root.eventBus.$on("form_validate" + formId, () => {
          this.judgeAllUpload();
        });
      }
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-select`]: this.type === "select",
          [`${prefixCls}-drag`]: this.type === "drag",
          [`${prefixCls}-dragOver`]: this.type === "drag" && this.dragOver
        }
      ];
    }
  },
  methods: {
    //新增判断是否都上传成功
    judgeAllUpload() {
      var result = true;
      var fileList = this.fileList;
      if (fileList.length == 0) {
        this.validateMsg = this.fieldTitle + "文件不能为空！";
        result = false;
      } else {
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i];
          if (file.status == "noupload") {
            result = false;
            this.validateMsg = "文件未上传";
            break;
          } else if (file.status == "uploading") {
            result = false;
            this.validateMsg = "文件上传中";
            break;
          } else if (file.status == "fail") {
            result = false;
            this.validateMsg = "有文件上传失败，请检查后重新提交";
            break;
          }
        }
      }
      setTimeout(() => {
        this.validateMsg = "";
      }, 1001);
      return result;
    },
    handleClick() {
      if (this.disabled) return;
      this.$refs.input.click();
    },
    handleChange(e) {
      const files = e.target.files;

      if (!files) {
        return;
      }
      this.uploadFiles(files);
      this.$refs.input.value = null;
    },
    onDrop(e) {
      this.dragOver = false;
      if (this.disabled) return;
      this.uploadFiles(e.dataTransfer.files);
    },
    handlePaste(e) {
      if (this.disabled) return;
      if (this.paste) {
        this.uploadFiles(e.clipboardData.files);
      }
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      //是否支持多文件上传
      if (!this.multiple) {
        this.clearFiles(); //不支持多文件上传，先清空原来的数据
        postFiles = postFiles.slice(0, 1);
      }

      if (postFiles.length === 0) return;

      postFiles.forEach(file => {
        this.upload(file);
      });

      if (this.autoUpload) {
        this.startUpload();
      }
    },
    upload(file) {
      //是否自动上传
      if (!this.autoUpload) {
        return this.addList(file);
      }

      if (!this.beforeUpload) {
        return this.addList(file);
      }

      //新增把参数带回去
      var takeParameters = this.takeParameters || {};
      const before = this.beforeUpload(file, takeParameters);
      if (before && before.then) {
        before.then(
          processedFile => {
            if (
              Object.prototype.toString.call(processedFile) === "[object File]"
            ) {
              this.addList(processedFile);
            } else {
              this.addList(file);
            }
          },
          () => {
            this.addList(file);
          }
        );
      } else if (before !== false) {
        this.addList(file);
      } else {
        this.addList(file);
      }
    },
    //、、、、、、、、、、、、、、、、、、、、、、、、、、、
    //12.21新增_添加到list列表中去,但是不去上传
    addList(file) {
      // check format
      if (this.format.length) {
        const _file_format = file.name
          .split(".")
          .pop()
          .toLocaleLowerCase();
        const checked = this.format.some(
          item => item.toLocaleLowerCase() === _file_format
        );
        if (!checked) {
          //新增提示格式不符合
          this.$message.error("文件" + file.name + "格式不符合");
          this.onFormatError(file, this.fileList);
          return false;
        }
      }

      // check maxSize
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          //新增提示超出大小
          this.$message.error("文件" + file.name + "超出大小限制");
          this.onExceededSize(file, this.fileList);
          return false;
        }
      }
      //开始上传，添加uid等信息
      this.handleStart(file);
    },
    //开始一键上传
    startUpload() {
      //开始上传,这里需要取file.fileData去上传
      this.fileList.forEach(file => {
        if (file.status == "finished") {
          return;
        }
        this.handleUpload(file);
      });
    },
    //新增只上传一个文件
    handleUpload(_file) {
      //如果已经上传成功就不去重新上传了
      if (_file.status == "finished") {
        return;
      }

      var file = _file.fileData;
      let formData = new FormData();
      formData.append(this.name, file);

      //新增自动上传前的状态
      _file.status = "uploading";
      this.isdisabled = true;
      //设置是否显示按钮
      index += 1;

      //是否显示loading动画
      if (this.showLoading) {
        this.$Spin.show();
      }

      //上传文件前判断是否可以开始上传
      ajax({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.handleProgress(e, file);
        },
        onSuccess: res => {
          if (this.showLoading) {
            this.$Spin.hide();
            document.body.style.overflow = "auto";
          }

          index -= 1;
          if (index == 0) {
            this.isdisabled = false;
          }

          this.handleSuccess(res, file);
        },
        onError: (err, response) => {
          if (this.showLoading) {
            this.$Spin.hide();
            document.body.style.overflow = "auto";
          }

          index -= 1;
          if (index == 0) {
            this.isdisabled = false;
          }
          this.handleError(err, response, file);
        }
      });
    },
    handleStart(file) {
      file.uid = Date.now() + this.tempIndex++;
      const _file = {
        status: "uploading",
        name: file.name,
        size: file.size,
        percentage: 0,
        uid: file.uid,
        showProgress: true,

        fileData: file //新增参数，循环时取这个值
      };
      //新增未自动上传前的状态
      if (!this.autoUpload) {
        _file.status = "noupload";
      }
      this.fileList.push(_file);
    },
    getFile(file) {
      const fileList = this.fileList;
      let target;
      fileList.every(item => {
        target = file.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    handleProgress(e, file) {
      const _file = this.getFile(file);
      this.onProgress(e, _file, this.fileList);
      _file.percentage = e.percent || 0;

      _file.percentage = e.percent - 1 || 0;
    },
    handleSuccess(res, file) {
      const _file = this.getFile(file);
      if (_file) {
        _file.status = "finished";
        _file.response = res;

        //新增把参数带回去
        var takeParameters = this.takeParameters || {};
        this.onSuccess(res, _file, this.fileList, takeParameters);
        //									 this.onSuccess(res, _file, this.fileList);
        this.dispatch("FormItem", "on-form-change", _file);
        //新增设置进度显示100,假的进度条
        _file.percentage = 100;
        //					//上传成功后，还是显示进度条
        //                  setTimeout(() => {
        //                      _file.showProgress = false;
        //                  }, 1000);
      }
    },
    handleError(err, response, file) {
      const _file = this.getFile(file);
      const fileList = this.fileList;

      _file.status = "fail";

      //新增，是否删除失败文件的配置
      if (this.deleteFailFile) {
        fileList.splice(fileList.indexOf(_file), 1);
      }
      //				//根据需求失败后不删除文件，可配置
      //              fileList.splice(fileList.indexOf(_file), 1);

      this.onError(err, response, file);
    },
    handleRemove(file) {
      const fileList = this.fileList;
      fileList.splice(fileList.indexOf(file), 1);
      this.onRemove(file, fileList);
    },
    handleRefresh(file) {
      this.handleUpload(file, this.takeParameters);
    },
    handlePreview(file) {
      if (file.status === "finished") {
        this.onPreview(file);
      }
    },
    clearFiles() {
      this.fileList = [];
    }
  },
  watch: {
    //默认已经上传的列表数据
    defaultFileList: {
      immediate: true,
      handler(fileList) {
        this.fileList = fileList.map(item => {
          item.status = "finished";
          item.percentage = 100;
          item.uid = Date.now() + this.tempIndex++;
          return item;
        });
      }
    },
    //新增获取成功的列表数据
    fileList: {
      immediate: true,
      deep: true,
      handler(fileList) {
        var result = [];
        fileList.forEach(file => {
          if (
            file.status === "finished" &&
            file.response &&
            file.response.result
          ) {
            result.push(file.response.result[this.field]);
          }
        });
        this.uploadSuccessFile = result; //设置成功的数据

        //0628新增上传过程中清空提示信息
        if (this.showValidateMsg) {
          this.$validator && this.$validator.reset();
        }
      }
    }
  },
  //新增销毁
  beforeDestroy: function() {
    if (this.validate) {
      if (this.form) {
        this.$root.eventBus.$off("form_validate" + this.form);
      } else {
        this.$root.eventBus.$off("form_validate" + this.id.split("_")[0]);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.ro-upload {
  width: 100%;
}
.ro-upload-input {
  display: none!important;
}
.ro-upload-drag{
	background: #fff;
	border: 1px dashed #dcdee2;
	border-radius: 4px;
	text-align: center;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	-webkit-transition: border-color .2s ease;
	transition: border-color .2s ease;
}


.upload-choose {
  width: 278px;
  height: 166px;
  object-fit: contain;
}
</style>
