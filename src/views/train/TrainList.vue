<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd">上传音频/视频</a-button>
    </div>
    <s-table ref="table" size="default" :row-key="record => record.tid" :columns="columns" :data="loadData">
      <template slot="kind" slot-scope="text">{{ text === 1 ? '视频' : '音频' }}</template>
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
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '填写名称' }], initialValue: mdl.title }]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="视频/音频">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="uploadHost"
            :before-upload="beforeUpload"
            :data="ossParams"
            accept="audio/*,video/*"
            @change="handleChange"
          >
            <video
              v-if="mdl.url != '' && videoFlag == false"
              :src="mdl.url"
              width="350"
              height="180"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </video>
            <a-icon v-else-if="mdl.url == '' && videoFlag == false" type="plus" />
            <a-progress v-if="videoFlag" type="circle" :percent="videoUploadPercent"></a-progress>
            <!-- <a-button>
              <a-icon type="upload" /> 上传
            </a-button> -->
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getTrainList, addTrain, updateTrain, delTrain } from '@/api/train'
import { getToken } from '@/api/oss'
import { randomString } from '@/utils/util'

export default {
  name: 'TrainList',
  components: {
    STable
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      visible: false,
      modal_title: '添加视频音频',
      form: this.$form.createForm(this),
      mdl: {},
      videoFlag: false,
      videoUploadPercent: 0,
      loading: false,
      ossParams: {
        key: '',
        policy: '',
        OSSAccessKeyId: '',
        success_action_status: '200', //让服务端返回200,不然，默认会返回204
        // callback : '', 不回调
        signature: ''
      },
      uploadHost: '',
      fileList: [],
      // 查询参数
      queryParam: {
        filter: {
          category_id: this.$route.params.id
        }
      },
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'title'
        },
        {
          title: '类型',
          dataIndex: 'kind',
          scopedSlots: { customRender: 'kind' }
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
        return getTrainList(Object.assign(parameter, this.queryParam)).then(res => {
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
        tid: undefined,
        url: '',
        kind: 1,
        category_id: this.$route.params.id
      }
      this.modal_title = '添加视频音频'
      this.visible = true
    },
    handleEdit(row) {
      this.mdl = Object.assign({}, row)
      this.modal_title = '编辑视频音频'
      this.visible = true
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        if (typeof this.mdl.url === 'undefined' || this.mdl.url === null || this.mdl.url === '') {
          this.$message.error('请上传视频或音频')
          return
        }
        delete fieldsValue['upload']
        const values = {
          ...fieldsValue,
          category_id: this.mdl.category_id,
          kind: this.mdl.kind,
          url: this.mdl.url
        }
        console.log(values)
        if (this.mdl.mid) {
          updateTrain(this.mdl.mid, values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
              this.form.resetFields()
              this.visible = false
              this.$message.success('修改成功')
            }
          })
        } else {
          addTrain(values).then(res => {
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
          delTrain(row.tid).then(res => {
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
        this.videoFlag = true
        if (info.event) {
          this.videoUploadPercent = Math.floor(info.event.percent)
        } else {
          this.videoUploadPercent = 0
        }
      } else if (info.file.status === 'done') {
        this.mdl.url = `${this.uploadHost}/${this.ossParams.key}`
        this.mdl.kind = info.file.type.startsWith('video') ? 1 : 2
        this.videoFlag = false
      } else if (info.file.status === 'error') {
        this.videoFlag = false
        this.$message.error('上传失败，请重试')
      }
    },
    beforeUpload: function(file) {
      let _this = this
      return getToken('medias').then(res => {
        _this.uploadHost = res.data.host
        _this.ossParams.key = `medias/${randomString()}.${file.name.split('.').pop()}`
        _this.ossParams.OSSAccessKeyId = res.data.accessid
        _this.ossParams.policy = res.data.policy
        _this.ossParams.signature = res.data.signature
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
