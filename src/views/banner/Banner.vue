<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新建</a-button>
    </div>
    <s-table ref="table" size="default" :row-key="record => record.bid" :columns="columns" :data="loadData">
      <template slot="cover" slot-scope="text">
        <span>
          <img :src="text" style="width: 125px; height: 60px;" />
        </span>
      </template>
      <template slot="object_type" slot-scope="text">{{ text | typeFilter }}</template>
      <template slot="pos" slot-scope="text">{{ text | BannerPositionFilter }}</template>
      <span slot="effective_time" slot-scope="text, record"
        >{{ (record.start_time * 1000) | DateFormat('YYYY-MM-DD HH:mm') }} -
        {{ (record.end_time * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</span
      >
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a class="delete" @click="() => handleDel(record)">删除</a>
      </span>
    </s-table>

    <a-modal :title="modal_title" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="链接类型">
          <a-select
            placeholder="请选择链接类型"
            v-decorator="[
              'object_type',
              { rules: [{ required: true, message: '请选择链接类型' }], initialValue: mdl.object_type }
            ]"
            @change="handleTypeChange"
          >
            <a-select-option v-for="type in types" :key="type.id">{{ type.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="!isHtml" :label-col="labelCol" :wrapper-col="wrapperCol" label="链接目标">
          <!-- <a-input
            type="Number"
            v-decorator="['object_id', { rules: [{ required: true, message: '填写ID' }], initialValue: mdl.object_id }]"
          /> -->
          <a-select
            show-search
            placeholder="请选择"
            option-filter-prop="children"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChangeTarget"
            :filter-option="filterOption"
            v-decorator="[
              'object_id',
              { rules: [{ required: true, message: '请选择ID' }], initialValue: mdl.object_id }
            ]"
          >
            <a-select-option v-for="object in objectList" :key="object.id">{{ object.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else :label-col="labelCol" :wrapper-col="wrapperCol" label="外部链接">
          <a-input
            v-decorator="[
              'html_url',
              { rules: [{ required: true, message: '请填写外部链接' }], initialValue: mdl.html_url }
            ]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="图片">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="uploadHost"
            :before-upload="beforeUpload"
            :data="ossParams"
            @change="handleChange"
          >
            <img v-if="mdl.cover" :src="mdl.cover" style="width: 125px; height: 60px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <span class="tips">要求尺寸750*340</span>
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="生效时间">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            v-decorator="[
              'effective_time',
              {
                rules: [{ type: 'array', required: true, message: 'Please select time!' }],
                initialValue: mdl.effective_time
              }
            ]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="适用位置">
          <a-radio-group
            name="radioGroup"
            v-decorator="['pos', { rules: [{ required: true, message: '请设置Banner位置' }], initialValue: mdl.pos }]"
          >
            <a-radio :value="1">首页</a-radio>
            <a-radio :value="2">调适页</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { STable } from '@/components'
import { getBannerList, addBanner, updateBanner, deleteBanner } from '@/api/banner'
import { getArticleList } from '@/api/article'
import { getExamList } from '@/api/exam'
import { getCourseList } from '@/api/course'
import { getToken } from '@/api/oss'
import { randomString } from '@/utils/util'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

export default {
  name: 'Banner',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this),
      modal_title: '添加轮播图',
      mdl: {},
      isHtml: false, // 是否是三方地址（即object_type是否为4）
      loading: false,
      // 查询参数
      queryParam: {
        sort: {
          field: 'bid',
          reverse: true
        }
      },
      types: [
        { id: 1, value: '文章' },
        { id: 2, value: '测评' },
        { id: 3, value: '网课' },
        { id: 4, value: '外部链接' }
      ],
      objectList: [],
      ossParams: {
        key: '',
        policy: '',
        OSSAccessKeyId: '',
        success_action_status: '200', //让服务端返回200,不然，默认会返回204
        // callback : '', 不回调
        signature: ''
      },
      uploadHost: '',
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'bid',
          width: '60px'
        },
        {
          title: '图片',
          dataIndex: 'cover',
          scopedSlots: { customRender: 'cover' }
        },
        {
          title: '位置',
          dataIndex: 'pos',
          scopedSlots: { customRender: 'pos' }
        },
        {
          title: '点击去向',
          dataIndex: 'object_type',
          scopedSlots: { customRender: 'object_type' }
        },
        {
          title: '生效时间',
          key: 'effective_time',
          scopedSlots: { customRender: 'effective_time' }
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          scopedSlots: { customRender: 'create_time' }
        },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getBannerList(Object.assign(params, this.queryParam)).then(res => {
          if (res.code === 0) {
            return res.data
          } else {
            return {
              data: [],
              pageSize: 10,
              pageNo: 1,
              totalPag: 0,
              totalCount: 0
            }
          }
        })
      }
    }
  },
  filters: {
    typeFilter: function(value) {
      const types = ['文章', '测评', '网课', '外部链接']
      return types[value - 1]
    }
  },
  methods: {
    initBanner() {
      this.mdl = {
        bid: undefined,
        cover: '', // banner图片地址
        object_type: 1, // 链接类型 1 文章
        object_id: 0, // 目标id
        html_url: '', // 外部链接
        pos: 1, // 位置： 1 首页 2 干预页
        start_time: 0, // 开始时间
        end_time: 0
      }
      this.getObjectList(1)
      this.isHtml = false
    },
    handleTypeChange(value) {
      if (value === 4) {
        this.isHtml = true
      } else {
        this.isHtml = false
        this.getObjectList(value)
      }
    },
    handleAdd() {
      this.initBanner()
      this.visible = true
    },
    handleOk(e) {
      e.preventDefault()
      let vm = this
      vm.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        if (typeof vm.mdl.cover === 'undefined' || vm.mdl.cover === null || vm.mdl.cover === '') {
          vm.$message.error('请上传图片')
          return
        }
        const effective_time = fieldsValue['effective_time']
        delete fieldsValue['effective_time']

        fieldsValue.object_id = +fieldsValue.object_id

        const values = {
          ...fieldsValue,
          cover: vm.mdl.cover,
          start_time: effective_time[0].unix(),
          end_time: effective_time[1].unix()
        }
        if (vm.mdl.bid) {
          updateBanner(vm.mdl.bid, values).then(res => {
            if (res.code === 0) {
              vm.$refs.table.refresh()
              vm.form.resetFields()
              vm.isHtml = false
              vm.visible = false
              vm.$message.success('修改成功')
            }
          })
        } else {
          addBanner(values).then(res => {
            if (res.code === 0) {
              vm.$refs.table.refresh()
              vm.form.resetFields()
              vm.isHtml = false
              vm.visible = false
              vm.$message.success('添加成功')
            }
          })
        }
      })
    },
    handleEdit(record) {
      this.getObjectList(record.object_type)
      this.modal_title = '修改轮播图'
      if (record.object_type === 4) {
        this.isHtml = true
      }
      this.mdl = Object.assign({}, record)
      this.mdl.effective_time = [moment.unix(this.mdl.start_time), moment.unix(this.mdl.end_time)]
      this.visible = true
    },
    handleDel(row) {
      const vm = this
      this.$confirm({
        title: '警告',
        content: '真的要删除吗?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteBanner(row.bid).then(res => {
            if (res.code === 0) {
              vm.$refs.table.refresh()
              vm.$message.success('删除成功')
            } else {
              vm.$message.error('删除失败')
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
      } else if (info.file.status === 'done') {
        this.mdl.cover = `${this.uploadHost}/${this.ossParams.key}`
        this.loading = false
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error('上传图片失败，请重试')
      }
    },
    beforeUpload: function(file) {
      let vm = this
      return getToken().then(res => {
        vm.uploadHost = res.data.host
        vm.ossParams.key = `images/${randomString()}.${file.name.split('.').pop()}`
        vm.ossParams.OSSAccessKeyId = res.data.accessid
        vm.ossParams.policy = res.data.policy
        vm.ossParams.signature = res.data.signature
      })
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    getObjectList(type) {
      const vm = this
      if (type === 1) {
        getArticleList({ pagination: { per_page: 100 } }).then(res => {
          vm.objectList = res.data.data.map(item => {
            let new_item = {
              id: item.aid,
              name: item.title
            }
            return new_item
          })
        })
      } else if (type === 2) {
        getExamList({ pagination: { per_page: 100 } }).then(res => {
          vm.objectList = res.data.data.map(item => {
            let new_item = {
              id: item.eid,
              name: item.title
            }
            return new_item
          })
        })
      } else if (type === 3) {
        getCourseList({ pagination: { per_page: 100 } }).then(res => {
          vm.objectList = res.data.data.map(item => {
            let new_item = {
              id: item.cid,
              name: item.title
            }
            return new_item
          })
        })
      }
    },
    handleChangeTarget(value) {
      // console.log(`selected ${value}`)
    },
    handleBlur() {
      // console.log('blur')
    },
    handleFocus() {
      // console.log('focus')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
