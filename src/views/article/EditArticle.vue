<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form layout="horizontal" @submit="handleSubmit" :form="form" class="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="文章标题">
        <a-input
          placeholder="请输入文章标题"
          v-decorator="[
            'title',
            { rules: [{ required: true, message: '请输入文章标题' }], initialValue: article.title }
          ]"
        />
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="文章作者">
        <a-input
          placeholder="请输入文章作者"
          v-decorator="[
            'author',
            { rules: [{ required: true, message: '请输入文章作者' }], initialValue: article.author }
          ]"
        />
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="文章分类">
        <a-select
          placeholder="请选择类别"
          v-decorator="[
            'category_id',
            { rules: [{ required: true, message: '请选择类别' }], initialValue: article.category_id }
          ]"
        >
          <a-select-option v-for="c in categories" :key="c.id">{{ c.name }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="文章封面">
        <a-upload
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :action="uploadHost"
          :before-upload="beforeCoverUpload"
          :data="ossParams"
          @change="handleCoverChange"
          v-decorator="[
            'cover',
            {
              rules: [{ required: true, message: '请上传封面' }],
              initialValue: article.cover
            }
          ]"
        >
          <img width="128" height="128" v-if="article.cover" :src="article.cover" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <span class="tips">要求尺寸146*146</span>
      </a-form-item>

      <a-form-item>
        <ueditor v-model="content"></ueditor>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-button html-type="submit" type="primary">提交</a-button>
        <a-button @click="cancel" style="margin-left: 8px">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import Ueditor from '@/components/UEditor'
import { getToken } from '@/api/oss'
import { getArticle, updateArticle } from '@/api/article'
import { getCategoryList } from '@/api/category'
import { randomString } from '@/utils/util'
import router from '@/router'

export default {
  name: 'EditArticle',
  components: {
    Ueditor
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        md: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 8 }
      },
      article: {},
      loading: false,
      ossParams: {},
      uploadHost: '',
      fileList: [],
      listObj: [],
      form: this.$form.createForm(this),
      content: '',
      categories: [] // 分类列表
    }
  },
  created() {
    this.getArticle()
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      const _this = this
      getCategoryList({ kind: 1 }).then(res => {
        _this.categories = res.data
      })
    },
    getArticle() {
      const _this = this
      getArticle(_this.$route.params.id).then(res => {
        _this.article = res.data
        let index = res.data.content.indexOf('<!--title-->')
        if (index > 0) {
          _this.content = res.data.content.slice(index + 12)
        } else {
          _this.content = res.data.content
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.content = _this.content
          values.cover = this.article.cover
          delete values.upload
          updateArticle(this.$route.params.id, values).then(res => {
            if (res.code === 0) {
              this.$message.success('添加成功')
              router.push({ name: 'ArticleList' })
            }
          })
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'ArticleList' })
    },
    beforeCoverUpload(file) {
      let _this = this
      return getToken().then(res => {
        _this.uploadHost = res.data.host
        _this.ossParams.key = `images/${randomString()}.${file.name.split('.').pop()}`
        _this.ossParams.OSSAccessKeyId = res.data.accessid
        _this.ossParams.policy = res.data.policy
        _this.ossParams.signature = res.data.signature
      })
    },
    handleCoverChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        this.article.cover = `${this.uploadHost}/${this.ossParams.key}`
        this.loading = false
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('removed')
      }
    }
  },
  watch: {
    $route() {
      this.getArticle()
      this.getCategoryList()
    }
  }
}
</script>
