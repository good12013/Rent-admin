<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd">创建分类</a-button>
    </div>
    <a-table :columns="columns" :row-key="record => record.id" :data-source="data" :pagination="false">
      <template slot="cover" slot-scope="text"
        ><img :src="text" width="80" height="80" alt=""
      /></template>
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleInfo(record)">管理</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </template>
      </span>
    </a-table>

    <a-modal :title="modal_title" :width="600" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写名称' }], initialValue: mdl.name }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="封面">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="uploadHost"
            :before-upload="beforeUpload"
            :data="ossParams"
            accept="image/*"
            @change="handleChange"
            v-decorator="['upload', { rules: [{ required: true, message: '请上传封面图' }] }]"
          >
            <img v-if="mdl.cover" :src="mdl.cover" style="width: 125px; height: 60px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <span class="tips">要求尺寸100*100</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { addCategory, updateCategory, delCategory } from '@/api/category'
import { getCategoryList } from '@/api/train'
import { getToken } from '@/api/oss'
import { randomString } from '@/utils/util'
import router from '@/router'

export default {
  name: 'TrainList',
  data() {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 15 } },
      mdl: {},
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      modal_title: '添加分类',
      uploadHost: '',
      ossParams: {
        key: '',
        policy: '',
        OSSAccessKeyId: '',
        success_action_status: '200', //让服务端返回200,不然，默认会返回204
        // callback : '', 不回调
        signature: ''
      },
      data: [],
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '封面',
          dataIndex: 'cover',
          scopedSlots: { customRender: 'cover' }
        },
        {
          title: '音频数量',
          dataIndex: 'audi_count'
        },
        {
          title: '视频数量',
          dataIndex: 'video_count'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          scopedSlots: { customRender: 'create_time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      getCategoryList().then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    handleAdd() {
      this.mdl = {
        id: undefined,
        name: '',
        kind: 4,
        cover: '' // 封面图片地址
      }
      this.modal_title = '添加分类'
      this.visible = true
    },
    handleInfo(row) {
      router.push({ name: 'TrainList', params: { id: row.id } })
    },
    handleEdit(row) {
      this.mdl = {
        id: row.id,
        name: row.name,
        kind: row.kind,
        cover: row.cover
      }
      this.modal_title = '编辑分类'
      this.visible = true
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        if (typeof this.mdl.cover === 'undefined' || this.mdl.cover === null || this.mdl.cover === '') {
          this.$message.error('请上传图片')
          return
        }

        const values = {
          name: fieldsValue.name,
          cover: this.mdl.cover,
          kind: this.mdl.kind
        }
        if (this.mdl.id) {
          updateCategory(this.mdl.id, values).then(res => {
            if (res.code === 0) {
              this.form.resetFields()
              this.getCategoryList()
              this.visible = false
              this.$message.success('修改成功')
            }
          })
        } else {
          addCategory(values).then(res => {
            if (res.code === 0) {
              this.getCategoryList()
              this.form.resetFields()
              this.visible = false
              this.$message.success('添加成功')
            }
          })
        }
      })
    },
    handleDel(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: '真的要删除吗?删除分类会删除该分类下所有音频视频',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          delCategory(row.id).then(res => {
            if (res.code === 0) {
              this.getCategoryList()
              _this.$message.success('删除成功')
            } else {
              _this.$message.error('删除失败')
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
      let _this = this
      return getToken().then(res => {
        _this.uploadHost = res.data.host
        _this.ossParams.key = `images/${randomString()}.${file.name.split('.').pop()}`
        _this.ossParams.OSSAccessKeyId = res.data.accessid
        _this.ossParams.policy = res.data.policy
        _this.ossParams.signature = res.data.signature
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
