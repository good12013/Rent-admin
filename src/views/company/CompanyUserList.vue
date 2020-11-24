<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="handleReturn">返回</a-button>
    </div>
    <s-table ref="table" size="default" :row-key="record => record.uid" :columns="columns" :data="loadData">
      <template slot="last_login_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>

      <span slot="action" slot-scope="text, record">
        <!-- <a @click="handleEdit(record)">编辑</a> -->
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
      queryParam: {
        filter: { company_id: this.$route.params.id }
      },
      // 表头
      columns: [
        {
          title: '账号',
          dataIndex: 'phone'
        },
        {
          title: '使用者名称',
          dataIndex: 'nickname'
        },
        {
          title: '最近登录时间',
          dataIndex: 'last_login_time',
          scopedSlots: { customRender: 'last_login_time' }
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
    handleEdit(row) {
      console.log(row)
    },
    handleReturn() {
      this.$router.push({ name: 'CompanyList' })
    }
  }
}
</script>

<style lang="less" scoped></style>
