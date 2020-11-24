<template>
  <a-form layout="horizontal" @submit="handleSubmit" :form="form" class="form">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-row class="form-row" :gutter="16">
        <a-col :md="12" :sm="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="课程标题">
            <a-input
              placeholder="请输入课程标题"
              v-decorator="[
                'title',
                { rules: [{ required: true, message: '请输入课程标题' }], initialValue: course.title }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="课程讲师">
            <a-input
              placeholder="请输入课程讲师"
              v-decorator="[
                'teacher',
                { rules: [{ required: true, message: '请输入课程讲师' }], initialValue: course.teacher }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="课程价格">
            <a-input
              placeholder="请输入课程价格"
              v-decorator="[
                'price',
                { rules: [{ required: true, message: '请输入课程价格' }], initialValue: course.price }
              ]"
              style="width: 150px"
            />
            <span style="margin-left: 10px; color: red;">单位：分</span>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类别">
            <a-select
              placeholder="请选择类别"
              v-decorator="[
                'category_id',
                { rules: [{ required: true, message: '请选择类别' }], initialValue: course.category_id }
              ]"
            >
              <a-select-option v-for="d in categories" :key="d.id">{{ d.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="课程封面">
            <a-upload
              name="file"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :action="uploadHost"
              :before-upload="beforeCoverUpload"
              :data="ossParams"
              @change="handleCoverChange"
            >
              <img width="128" height="128" v-if="course.cover" :src="course.cover" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <span class="tips">要求尺寸336*224</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="card" title="课程简介" :bordered="false">
      <a-row>
        <a-col :md="24">
          <a-form-item>
            <ueditor v-model="content"></ueditor>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="card" title="课程目录" :bordered="false">
      <a-row>
        <a-col :md="24">
          <a-form-item label="">
            <a-table
              :columns="columns"
              :row-key="(record, index) => index"
              :data-source="course.lessons"
              :pagination="false"
            >
              <template slot="is_free" slot-scope="text, record">
                <a-checkbox :checked="text ? true : false" @change="changeFree(record)">免费</a-checkbox>
              </template>
              <template slot="name" slot-scope="text, record">
                <a-input placeholder="请输入课程标题" v-model="record.title" />
              </template>

              <span slot="action" slot-scope="text, record, index">
                <template>
                  <a @click="up(record, index)">升序</a>
                  <a-divider type="vertical" />
                  <a @click="down(record, index)">降序</a>
                  <a-divider type="vertical" />
                  <a-popconfirm @confirm="() => handleDel(record, index)" ok-text="是" cancel-text="否">
                    <template slot="title">
                      <p>你确定要删除该视频/音频吗?</p>
                    </template>
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </span>
            </a-table>
            <a-upload
              :before-upload="beforeUpload"
              :action="uploadHost"
              :multiple="true"
              :data="ossParams"
              accept="audio/*,video/*"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" /> 上传 </a-button>
            </a-upload>
            <video style="display:none;" controls="controls" id="videoPlayer"></video>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card class="card" :bordered="false">
      <a-row>
        <a-col :span="4" :offset="10">
          <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-form-item> -->
          <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
            <a-button html-type="submit" type="primary">提交</a-button>
            <a-button @click="cancel" style="margin-left: 8px">返回</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </a-form>
</template>

<script>
import Ueditor from '@/components/UEditor'
import { getCourse, updateCourse } from '@/api/course'
import { getCategoryList } from '@/api/category'
import { getToken } from '@/api/oss'
import { randomString } from '@/utils/util'

export default {
  name: 'EditCourse',
  components: {
    Ueditor
  },
  data() {
    return {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      columns: [
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '名称',
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '是否试听',
          dataIndex: 'is_free',
          scopedSlots: { customRender: 'is_free' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      course: {},
      loading: false,
      ossParams: {},
      uploadHost: '',
      fileList: [],
      listObj: [],
      form: this.$form.createForm(this),
      pic_url: '',
      content: '',
      lessons: [], // 课程目录
      categories: [] // 分类列表
    }
  },
  created() {
    this.getCategoryList()
    this.getCourse()
  },
  methods: {
    getCategoryList() {
      const _this = this
      getCategoryList({ kind: 3 }).then(res => {
        _this.categories = res.data
      })
    },
    getCourse() {
      const _this = this
      getCourse(_this.$route.params.id)
        .then(res => {
          if (res.code === 0) {
            _this.course = res.data
            _this.course.del_lessons = []
          }
        })
        .catch(() => {
          _this.$router.push({ name: 'CourseList' })
        })
    },
    up(row, idx) {
      if (idx === 0) {
        return
      }
      ;[this.course.lessons[idx].sort, this.course.lessons[idx - 1].sort] = [
        this.course.lessons[idx - 1].sort,
        this.course.lessons[idx].sort
      ]
      this.course.lessons[idx] = this.course.lessons.splice(idx - 1, 1, this.course.lessons[idx])[0]
    },
    down(row, idx) {
      if (idx === this.course.lessons.length()) {
        return
      }
      ;[this.course.lessons[idx].sort, this.course.lessons[idx + 1].sort] = [
        this.course.lessons[idx + 1].sort,
        this.course.lessons[idx].sort
      ]
      this.course.lessons[idx] = this.course.lessons.splice(idx + 1, 1, this.course.lessons[idx])[0]
    },
    handleDel(row, idx) {
      this.course.lessons.splice(idx, 1)
      if (row.id) {
        this.course.del_lessons.push(row.id)
      }
      for (let i = 0, len = this.course.lessons.length; i < len; i++) {
        this.course.lessons[i].sort = i + 1
      }
    },
    cancel() {
      this.$router.push({ name: 'CourseList' })
    },
    handleSubmit(e) {
      e.preventDefault()
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.lessons = _this.course.lessons
          values.del_lessons = _this.course.del_lessons
          values.content = _this.course.content
          values.cover = _this.course.cover
          updateCourse(_this.course.cid, values).then(res => {
            if (res.code === 0) {
              _this.$message.success('更新成功')
              _this.$router.push({ name: 'CourseList' })
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
    beforeUpload(file) {
      const _this = this
      return getToken('medias').then(res => {
        _this.uploadHost = res.data.host
        _this.ossParams.key = `medias/${randomString()}.${file.name.split('.').pop()}`
        _this.ossParams.OSSAccessKeyId = res.data.accessid
        _this.ossParams.policy = res.data.policy
        _this.ossParams.signature = res.data.signature
      })
    },
    handleChange(info) {
      this.fileList = info.fileList
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        const index = info.file.name.lastIndexOf('.')
        let lesson = {
          title: info.file.name.substring(0, index),
          url: `${this.uploadHost}/${this.ossParams.key}`,
          type: info.file.type.startsWith('video') ? 1 : 2,
          is_free: 0,
          sort: this.course.lessons.length + 1
        }
        this.course.lessons.push(lesson)
        let du = document.getElementById('videoPlayer')
        du.src = lesson.url
        du.oncanplaythrough = function() {
          lesson.duration = Math.floor(du.duration)
        }
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      } else if (info.file.status === 'removed') {
        console.log('removed')
      }
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
    },
    changeFree(row) {
      row.is_free = row.is_free ? 0 : 1
    }
  },
  watch: {
    $route() {
      this.getCourse()
      this.getCategoryList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
