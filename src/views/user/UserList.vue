<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :form="searchForm">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名称">
              <a-input placeholder="用户名称" v-decorator="['nickname', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input placeholder="手机号" v-decorator="['phone', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" :row-key="record => record.uid" :columns="columns" :data="loadData">
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>

      <span slot="action" slot-scope="text, record">
        <a @click="handleInfo(record)">详情</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getUserList } from '@/api/user'

export default {
  name: 'UserList',
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
      // 查询参数
      searchForm: this.$form.createForm(this),
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户名称',
          dataIndex: 'nickname'
        },
        {
          title: '联系方式',
          dataIndex: 'phone'
        },
        {
          title: '加入时间',
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
        return getUserList(Object.assign(params, this.queryParam)).then(res => {
          return res.data
        })
      }
    }
  },
  methods: {
    handleInfo(row) {
      this.$router.push({ name: 'UserInfo', params: { id: row.uid } })
    },
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          phone: this.searchForm.getFieldValue('phone'),
          nickname: this.searchForm.getFieldValue('nickname')
        }
      }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
