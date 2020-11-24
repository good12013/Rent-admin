<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd">新建</a-button>
    </div>
    <s-table ref="table" size="default" :row-key="record => record.mid" :columns="columns" :data="loadData">
      <template slot="cover" slot-scope="text"
        ><img :src="text" width="150" alt=""
      /></template>
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </template>
      </span>
    </s-table>

    <a-modal :title="modal_title" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="机构名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '填写机构名称' }], initialValue: mdl.name }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="机构地址">
          <a-input
            v-decorator="[
              'address',
              { rules: [{ required: true, message: '填写机构地址' }], initialValue: mdl.address }
            ]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系电话">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '填写联系电话' }], initialValue: mdl.phone }]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="机构封面">
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
          <span class="tips">要求尺寸160*160</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { STable } from '@/components'
import { getMerchantList, addMerchant, updateMerchant, deleteMerchant } from '@/api/merchant'
import { getToken } from '@/api/oss'
import { randomString } from '@/utils/util'

export default {
  name: 'MerchantList',
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
      modal_title: '添加机构',
      mdl: {},
      loading: false,
      // 查询参数
      queryParam: {
        sort: {
          field: 'mid',
          reverse: true
        }
      },
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
          title: '机构名称',
          dataIndex: 'name'
        },
        {
          title: '机构地址',
          dataIndex: 'address'
        },
        {
          title: '联系电话',
          dataIndex: 'phone'
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
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getMerchantList(Object.assign(parameter, this.queryParam)).then(res => {
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
  methods: {
    handleAdd() {
      this.mdl = {
        mid: undefined,
        name: '',
        address: '',
        phone: '',
        cover: ''
      }
      // this.modal_title = ''
      this.visible = true
    },
    handleEdit(row) {
      this.mdl = Object.assign({}, row)
      this.modal_title = '编辑机构'
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
        delete fieldsValue['upload']
        const values = {
          ...fieldsValue,
          cover: this.mdl.cover
        }
        if (this.mdl.mid) {
          updateMerchant(this.mdl.mid, values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
              this.form.resetFields()
              this.visible = false
              this.$message.success('修改成功')
            }
          })
        } else {
          addMerchant(values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
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
        content: '真的要删除吗?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteMerchant(row.mid).then(res => {
            if (res.code === 0) {
              _this.$refs.table.refresh()
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
