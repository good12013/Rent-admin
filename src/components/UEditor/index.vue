<template>
  <div class="u_editor">
    <div class="editor_wrap">
      <script id="editor" type="text/plain" name="content" style="width:100%;height:90%"></script>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/api/oss'

export default {
  name: 'UEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ue: null,
      content: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.content = val
        if (this.ue && this.ue.isReady) {
          this.ue.setContent(this.value)
        }
      },
      immediate: true
    },
    content(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.ue = window.UE.getEditor('editor', {
      autoHeightEnabled: false,
      imageActionName: true, // 允许单张图片上传
      catchRemoteImageEnable: true, // 设置是否抓取远程图片
      catcherFieldName: 'catcherField',
      catcherUrlPrefix: '',
      imageUrlPrefix: '', // 图片域名，统一采用七牛存储
      imageAllowFiles: ['.png', '.jpg', '.gif'], // 上传图片类型
      videoUrlPrefix: '', // 视频域名
      videoAllowFiles: ['.mp4'], // 视频类型
      // 初始容器高度
      initialFrameHeight: 700,
      // 初始容器宽度
      // initialFrameWidth: '100%',
      /**
       * @method getToken 获取oss token
       * @param {key,cb} key：文件名，cb：回调函数【token获取成功后传回】
       * @for Qiniu.upload
       */
      getToken: (key, cb) => {
        getToken().then(res => {
          if (cb && typeof cb === 'function') {
            console.log(res)
            cb(res.data)
          }
        })
      }
    })
    this.ue.addListener('ready', () => {
      this.ue.setContent(this.value)
    })
    this.ue.addListener('contentChange', () => {
      setTimeout(() => {
        this.content = this.ue.getContent()
      })
    })
  },
  destroyed() {
    this.ue.destroy()
  }
}
</script>
<style scoped>
.u_editor {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding-bottom: 30px;
}
.editor_wrap {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  /* max-width: 800px; */
  width: 0;
  /* height: 700px; */
}
</style>
