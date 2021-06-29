<template>
  <a-form :form="form">
    <a-form-item>
      <a-upload
        class="upMet"
        :multiple="true"
        :beforeUpload="beforeUpload"
        :accept="test"
        @change="handleChange"
        :fileList="fileList"
        v-decorator="[
          'qualifiFiles',
          {
            rules: [{ required: true, message: '请上传文件' }],
          },
        ]"
      >
        <!--v-decorator默认：      valuePropName: 'fileList', getValueFromEvent: normFile,-->
        <a-button class="uploadBTN" @click="setInit" :disabled="fileCount >= 5">
          <a-icon type="plus" style="font-size: 20px" /><br />
          {{ getData.title }}</a-button
        >
      </a-upload>

      <div v-show="getData.title == '上传图片'" class="imgList" v-for="(item, i) in images" :key="i">
        <div class="imgListIn">
          <img :src="item.src" :style="{ width: item.width, height: item.height }" />
        </div>
        <a-icon
          type="delete"
          @click="deleteD(i)"
          style="position: absolute; top: 2px; right: 2px; color: red; cursor: pointer"
        />
      </div>

      <div v-if="getData.title == '上传视频'" class="imgList" v-for="(item, i) in images" :key="i">
        <video :src="item.src">您的浏览器不支持 video 标签。</video>
        <a-icon
          type="delete"
          @click="deleteD(i)"
          style="position: absolute; top: 2px; right: 2px; color: red; cursor: pointer"
        />
      </div>

      <div v-if="getData.title == '上传音频'" class="imgList" v-for="(item, i) in images" :key="i">
        <img src="../../../assets/music.jpg" class="img" />
        <span>{{ item }}</span>
        <a-icon
          type="delete"
          @click="deleteD(i)"
          style="position: absolute; top: 2px; right: 2px; color: red; cursor: pointer"
        />
      </div>

      <div v-if="getData.title == '上传文件'" class="imgList" v-for="(item, i) in images" :key="i">
        <img src="../../../assets/file.jpg" />
        <span>{{ item }}</span>
        <a-icon
          type="delete"
          @click="deleteD(i)"
          style="position: absolute; top: 2px; right: 2px; color: red; cursor: pointer"
        />
      </div>
    </a-form-item>

    <div v-if="getData.title == '上传图片'" class="hintTxt">
      支持png/jpg/jpeg/gif/bmp，素材大小不超过5M；文件名不可包含特殊字符：%&=,;.与空格；一次最多支持上传5张图片
    </div>
    <div v-if="getData.title == '上传视频'" class="hintTxt">
      支持mp4/3gp/avi/f4v/m4v/mpg/ogv/vob/wmv，素材大小不超过10M；文件名不可包含特殊字符：%&=,;.与空格；一次最多支持上传5个视频
    </div>
    <div v-if="getData.title == '上传音频'" class="hintTxt">
      支持aac/mp3/amr，素材大小不超过10M；文件名不可包含特殊字符：%&=,;.与空格；一次最多支持上传5个音频
    </div>
    <div v-if="getData.title == '上传文件'" class="hintTxt">
      支持非媒体类文件的上传，素材大小不超过10M；文件名不可包含特殊字符：%&=,;.与空格；一次最多支持上传5个文件
    </div>
  </a-form>
</template>

<script>
import { matUpload } from '@/api/api'
import { getObjectURL } from '../index'

export default {
  name: 'uploadUsers',
  components: {},
  props: {
    data: {},
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      zero: 0,
      one: 0,
      two: 0,
      three: 0,
      test: '.png',
      getData: {},
      fileCount: 0,
      fileCount1: 0,
      uploading: false,
      fileList: [],
      images: [],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      confirmLoading: false,
      uploadAction: window._CONFIG['domianURL'] + '/oss/file/upload',
    }
  },
  beforeMount() {
    this.getData = this.data
    var temp = ''
    for (var name in this.getData.materialFileType) {
      temp = temp == '' ? '.' + this.getData.materialFileType[name] : temp + ',.' + this.getData.materialFileType[name]
    }
    this.test = temp
  },
  create() {},
  computed: {},
  methods: {
    getObjectURL: getObjectURL,
    setInit() {
      this.zero = 0
      this.one = 0
      this.two = 0
      this.three = 0
    },
    deleteD(i) {
      this.images.splice(i, 1)
      this.fileList.splice(i, 1)
      this.fileCount--
      if (this.fileCount == 0) {
        this.form.resetFields()
      }
    },
    handleChange(e) {
      if (this.data.title == '上传音频' || this.data.title == '上传文件') {
        this.images.push(e.file.name)
      } else if (this.data.title == '上传视频') {
        var video = e.file
        var url = URL.createObjectURL(video)
        this.images.push({ src: url })
      } else {
        var reader = new FileReader()
        reader.readAsDataURL(e.file)
        reader.onload = () => {
          var image = new Image()
          image.src = reader.result
          image.onload = () => {
            var w = image.width
            var h = image.height
            var getId = this.getObjectURL(e.file)

            setTimeout(() => {
              if (w <= 104 && h <= 104) {
                this.images.push({ src: getId, width: w + 'px', height: h + 'px' })
              } else if (w / h >= 1) {
                if ((h * 104) / w < 32) {
                  this.images.push({ src: getId, width: 'auto', height: '32px' })
                } else {
                  this.images.push({ src: getId, width: '104px', height: 'auto' })
                }
              } else if (w / h < 1) {
                if ((w * 104) / h < 32) {
                  this.images.push({ src: getId, width: '32px', height: 'auto' })
                } else {
                  this.images.push({ src: getId, width: 'auto', height: '104px' })
                }
              }
            })
          }
        }
      }
    },
    async delFile({ file, fileList }) {
      this.fileList = fileList
    },
    countChar(str, char) {
      //str为字bai符du串，zhichar为字符
      var count = 0
      for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) == char) {
          count++
        }
      }
      return count
    },
    beforeUpload(file) {
      var fileType = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase()

      if (this.data.title == '上传音频') {
        var types = ['aac', 'mp3', 'amr']
        if (types.indexOf(fileType) < 0) {
          if (this.zero == 0) {
            this.notify('warning', '上传提醒', '上传音频格式必须为aac/mp3/amr')
            this.zero = 1
          }
          return Promise.reject(false)
        }
      } else if (this.data.title == '上传视频') {
        var types = ['mp4', '3gp', 'avi', 'f4v', 'm4v', 'mpg', 'ogv', 'vob', 'wmv']
        if (types.indexOf(fileType) < 0) {
          if (this.zero == 0) {
            this.notify('warning', '上传提醒', '上传视频格式必须为mp4/3gp/avi/f4v/m4v/mpg/ogv/vob/wmv')
            this.zero = 1
          }
          return Promise.reject(false)
        }
      } else if (this.data.title == '上传图片') {
        var types = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
        if (types.indexOf(fileType) < 0) {
          if (this.zero == 0) {
            this.notify('warning', '上传提醒', '上传图片格式必须为png/jpg/jpeg/gif/bmp')
            this.zero = 1
          }
          return Promise.reject(false)
        }
      } else {
        var types = [
          'png',
          'jpg',
          'jpeg',
          'gif',
          'bmp',
          'aac',
          'mp3',
          'amr',
          'mp4',
          '3gp',
          'avi',
          'f4v',
          'm4v',
          'mpg',
          'ogv',
          'vob',
          'wmv',
        ]
        if (types.indexOf(fileType) >= 0) {
          if (this.zero == 0) {
            this.notify('warning', '上传提醒', '媒体文件请在相应的素材类型下上传')
            this.zero = 1
          }
          return Promise.reject(false)
        }
      }

      if (this.fileCount >= 5) {
        if (this.one == 0) {
          this.notify('warning', '上传提醒', '最多可上传5个文件')
          this.one = 1
        }
        return Promise.reject(false)
      }

      if (file.size === 0) {
        if (this.two == 0) {
          this.notify(
            'warning',
            '上传提醒',
            `${this.data.title}必须大于0B且小于等于${this.data.title === '上传图片' ? '5M' : '10M'}`
          )
          this.two = 1
        }
        return Promise.reject(false)
      }

      if (
        (this.data.title == '上传图片' && file.size > 5 * 1024 * 1024) ||
        (this.data.title != '上传图片' && file.size > 10 * 1024 * 1024)
      ) {
        if (this.two == 0) {
          this.notify(
            'warning',
            '上传提醒',
            `${this.data.title}必须小于等于${this.data.title === '上传图片' ? '5M' : '10M'}`
          )
          this.two = 1
        }
        return Promise.reject(false)
      }
      if (
        file.name.indexOf('%') >= 0 ||
        file.name.indexOf('&') >= 0 ||
        file.name.indexOf(' ') >= 0 ||
        file.name.indexOf(',') >= 0 ||
        file.name.indexOf(';') >= 0 ||
        this.countChar(file.name, '.') > 1
      ) {
        if (this.three == 0) {
          this.notify('warning', '上传提醒', `文件名不可包含特殊字符：%&=,;.与空格`)
          this.three = 1
        }
        return Promise.reject(false)
      }

      this.fileCount++

      this.fileList = [...this.fileList, file]

      return false
    },
    handleSubmit(e) {
      // e.preventDefault()
      var pass = true
      this.form.validateFields(async (err, values) => {
        if (err) {
          pass = false
          return
        }
        //this.confirmLoading = true
      })
      if (pass) {
        return true
      } else {
        return false
      }
    },
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return '123321'
      }
      return [
        {
          accId: '',
          createTime: '',
          delFlag: '',
          fileName: '111',
          fileUrl:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596708953942&di=c570c0981e8f15270aae947fbc3d3d80&imgtype=0&src=http%3A%2F%2Fwww.aihami.com%2Fuploads%2Fallimg%2F180702%2F172-1PF21312014F.png',
          id: '',
          remark: '',
        },
      ]
    },
    cancel() {
      this.$emit('cancel')
    },
    notify(type, m, d) {
      // success  error warning
      this.$notification[type]({
        message: m,
        description: d,
      })
    },
  },
}
</script>

<style lang="less">
.uploadBTN,
.imgList {
  width: 104px;
  height: 104px;
  border: 1px solid #ccc;
  font-size: 14px;
  line-height: 24px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  text-align: center;
  .imgListIn {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  span {
    display: block;
    width: 100%;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  img,
  video {
    width: 100%;
    height: 100%;
  }
  .img {
    width: auto;
    height: auto;
  }
}

.vList {
  margin-bottom: -60px;
}
.downloadTemp {
  display: inline-block !important;
  margin-left: 10px;
  color: #aaa;
}
.hintTxt {
  width: 100% !important;
  line-height: 20px !important;
}
.upMet {
  width: 112px;
  display: inline-block;
  .ant-upload-list.ant-upload-list-text {
    display: none;
  }
}
</style>
