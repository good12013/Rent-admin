<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form layout="horizontal" @submit="handleSubmit" :form="form" class="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="测评名称">
        <a-input
          placeholder="请输入测评名称"
          v-decorator="['title', { rules: [{ required: true, message: '请输入测评名称' }] }]"
        />
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="测评分类">
        <!-- <a-select
          placeholder="请选择测评分类"
          v-decorator="['category_id', { rules: [{ required: true, message: '请选择测评分类' }] }]"
        >
          <a-select-option v-for="c in categories" :key="c.id">{{ c.name }}</a-select-option>
        </a-select> -->
        <a-tree-select
          placeholder="请选择测评分类"
          style="width: 300px"
          v-decorator="['category_id', { rules: [{ required: true, message: '请选择测评分类' }] }]"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="categories"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类别">
        <a-select
          placeholder="请选择类别"
          v-decorator="['is_company', { rules: [{ required: true, message: '请选择类别' }], initialValue: 0 }]"
        >
          <a-select-option :key="0">普通版</a-select-option>
          <a-select-option :key="1">企业版</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="测评封面">
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
            'pic_url',
            {
              rules: [{ required: true, message: '请上传测评封面' }]
            }
          ]"
        >
          <img width="128" height="128" v-if="pic_url" :src="pic_url" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <span class="tips">要求尺寸100*100</span>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="测评价格">
        <a-input
          placeholder="请输入价格"
          v-decorator="['price', { rules: [{ required: true, message: '请输入价格' }] }]"
          style="width: 150px"
        />
        <span style="margin-left: 10px; color: red;">单位：分</span>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="测评简介">
        <a-textarea
          placeholder="测评简介"
          v-decorator="['content', { rules: [{ required: true, message: '请输入测评简介' }] }]"
          :autosize="{ minRows: 4, maxRows: 10 }"
          :max="200"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-button html-type="submit" type="primary">提交</a-button>
        <a-button @click="cancel" style="margin-left: 8px">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { getToken } from '@/api/oss'
import { addExam } from '@/api/exam'
import { getCategoryList } from '@/api/category'
import { randomString } from '@/utils/util'
const LTT = require('list-to-tree')

export default {
  name: 'AddExam',
  data() {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      loading: false,
      ossParams: {},
      uploadHost: '',
      fileList: [],
      listObj: [],
      form: this.$form.createForm(this),
      pic_url: '',
      content: '',
      categories: [] // 分类列表
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      getCategoryList({ kind: 2 }).then(res => {
        const data = res.data.map(item => {
          item['key'] = item.id
          item['value'] = String(item.id)
          item['title'] = item.name
          if (item['parent_id'] === 0) {
            item['selectable'] = false
          }
          return item
        })
        const ltt = new LTT(data, {
          key_id: 'id',
          key_parent: 'parent_id',
          key_child: 'children'
        })
        this.categories = ltt.GetTree()
      })
    },
    cancel() {
      this.$router.push({ name: 'ExamList' })
    },
    handleSubmit(e) {
      e.preventDefault()
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.cover = _this.pic_url
          delete values.upload
          addExam(values).then(res => {
            if (res.code === 0) {
              _this.$message.success('添加成功')
              _this.$router.push({ name: 'ExamList' })
            }
          })
        }
      })
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
        this.pic_url = `${this.uploadHost}/${this.ossParams.key}`
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
      this.getCategoryList()
    }
  }
}
</script>
