<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
    </div>
    <s-table ref="table" :row-key="record => record.id" :columns="columns" :data="loadData">
      <template slot="object_type" slot-scope="text">{{ text | typeFilter }}</template>
      <template slot="content" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </template>
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record)">删除</a>
      </span>
    </s-table>
    <a-modal :title="modal_title" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="消息标题">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '请填写消息标题' }], initialValue: mdl.title }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="消息链接">
          <a-select
            placeholder="请选择消息链接"
            v-decorator="[
              'object_type',
              { rules: [{ required: true, message: '请选择消息链接' }], initialValue: mdl.object_type }
            ]"
            @change="handleTypeChange"
          >
            <a-select-option v-for="type in types" :key="type.id">{{ type.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="!isHtml" :label-col="labelCol" :wrapper-col="wrapperCol" label="ID">
          <a-input
            type="Number"
            v-decorator="['object_id', { rules: [{ required: true, message: '填写ID' }], initialValue: mdl.object_id }]"
          />
        </a-form-item>
        <a-form-item v-else :label-col="labelCol" :wrapper-col="wrapperCol" label="外部链接">
          <a-input
            v-decorator="[
              'html_url',
              { rules: [{ required: true, message: '请填写外部链接' }], initialValue: mdl.html_url }
            ]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="消息简介">
          <a-textarea
            v-decorator="[
              'summary',
              { rules: [{ required: true, message: '请填写消息简介' }], initialValue: mdl.summary }
            ]"
            placeholder="简介"
            :rows="4"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="推送时间">
          <a-date-picker
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择时间"
            :disabled-date="disabledDate"
            :disabled-time="disabledDateTime"
            show-time
            v-decorator="[
              'push_time',
              {
                rules: [{ required: true, message: '请选择时间' }],
                initialValue: mdl.push_time
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="消息过期时间">
          <a-date-picker
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择时间"
            v-decorator="[
              'push_expire_time',
              {
                rules: [{ required: true, message: '请选择时间' }],
                initialValue: mdl.push_expire_time
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getPushList, addPush, updatePush, deletePush } from '@/api/push'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

export default {
  name: 'PushList',
  components: {
    STable,
    Ellipsis
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
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      modal_title: '添加推送',
      mdl: {},
      isHtml: false,
      types: [
        { id: 1, value: '文章' },
        { id: 2, value: '测评' },
        { id: 3, value: '网课' },
        { id: 4, value: '外部链接' }
      ],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '消息标题',
          dataIndex: 'title'
        },
        {
          title: '点击去向',
          dataIndex: 'object_type',
          scopedSlots: { customRender: 'object_type' }
        },
        {
          title: '简介',
          dataIndex: 'summary'
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
      loadData: params => {
        return getPushList(Object.assign(params, this.queryParam)).then(res => {
          return res.data
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
    moment,
    handleAdd() {
      this.mdl = {
        id: undefined,
        title: '',
        summary: '',
        object_type: 1, // 开始时间
        object_id: 0,
        html_url: '',
        push_time: this.moment(),
        push_expire_time: this.moment().add(30, 'minutes')
      }
      this.visible = true
    },
    handleEdit(row) {
      this.modal_title = '修改消息推送'
      this.mdl = Object.assign({}, row)
      if (this.mdl.object_type === 4) {
        this.isHtml = true
      }
      this.mdl.push_time = this.moment(this.mdl.push_time * 1000)
      this.mdl.push_expire_time = this.moment(this.mdl.push_expire_time * 1000)
      this.visible = true
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        values.object_id = +values.object_id
        values.push_time = values.push_time.unix()
        values.push_expire_time = values.push_expire_time.unix()
        if (this.mdl.id) {
          updatePush(this.mdl.id, values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
              this.form.resetFields()
              this.isHtml = false
              this.visible = false
              this.$message.success('编辑成功')
            }
          })
        } else {
          addPush(values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
              this.form.resetFields()
              this.isHtml = false
              this.visible = false
              this.$message.success('添加成功')
            }
          })
        }
      })
    },
    handleTypeChange(value) {
      if (value === 4) {
        this.isHtml = true
      } else {
        this.isHtml = false
      }
    },
    handleDelete(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: '真的要删除吗?',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deletePush(row.id).then(res => {
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
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledDate(current) {
      return current && current < moment().startOf('day')
    },
    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
