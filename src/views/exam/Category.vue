<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAddTop">增加大类</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" :row-key="record => record.id" :pagination="false">
      <template slot="action" slot-scope="text, record">
        <template>
          <template v-if="record.parent_id === 0">
            <a @click="() => handleAdd(record)">增加小类</a>
            <a-divider type="vertical" />
          </template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </template>
      </template>
    </a-table>

    <a-modal :title="modal_title" :width="600" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="分类名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写分类名称' }], initialValue: mdl.name }]"
          />
        </a-form-item>
        <a-form-item v-if="mdl.parent_id === 0" :label-col="labelCol" :wrapper-col="wrapperCol" label="封面">
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

    <!-- <a-modal title="分类管理" :width="800" v-model="visible" @ok="() => (visible = false)">
      
    </a-modal> -->
  </a-card>
</template>

<script>
import { getCategoryList, addCategory, updateCategory, delCategory } from '@/api/category'
import { getToken } from '@/api/oss'
import { randomString } from '@/utils/util'
const LTT = require('list-to-tree')

export default {
  name: 'ExamCategory',
  data() {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 15 } },
      mdl: {},
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      modal_title: '增加大类',
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
      columns: [
        {
          title: '分类名',
          dataIndex: 'name',
          width: '50%'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      getCategoryList({ kind: 2 }).then(res => {
        this.data = res.data
        const ltt = new LTT(res.data, {
          key_id: 'id',
          key_parent: 'parent_id',
          key_child: 'children'
        })
        this.data = ltt.GetTree()
        // console.log(tree)
      })
    },
    handleAddTop() {
      this.mdl = {
        id: 0,
        name: '',
        cover: '',
        parent_id: 0
      }
      this.modal_title = '创建大类'
      this.visible = true
    },
    handleAdd(row) {
      this.mdl = {
        id: 0,
        name: '',
        parent_id: row.id
      }
      this.modal_title = '创建小类'
      this.visible = true
    },
    handleEdit(row) {
      this.mdl = row
      this.modal_title = '修改分类'
      this.visible = true
    },
    handleDel(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: '真的要删除吗?删除分类会删除该分类下所有测评',
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
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        if (
          this.mdl.parent_id === 0 &&
          (typeof this.mdl.cover === 'undefined' || this.mdl.cover === null || this.mdl.cover === '')
        ) {
          this.$message.error('请上传图片')
          return
        }

        let values = {
          name: fieldsValue.name,
          parent_id: this.mdl.parent_id,
          kind: 2
        }
        if (this.mdl.parent_id === 0) {
          values['cover'] = this.mdl.cover
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
