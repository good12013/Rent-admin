<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" @click="categoryManage">分类管理</a-button>
      <a-button type="primary" @click="handleAdd">上传课程</a-button>
    </div>
    <s-table ref="table" size="middle" :row-key="record => record.cid" :columns="columns" :data="loadData">
      <template slot="price" slot-scope="text">{{ text | PriceFormat }}</template>
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>

      <span slot="action" slot-scope="text, record">
        <template>
          <!-- <a @click="handleInfo(record)">详情</a>
          <a-divider type="vertical" /> -->
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
          <a-divider type="vertical" />
          <a v-if="record.is_recommend" @click="cancelRecommend(record)">取消精选</a>
          <a v-else @click="recommend(record)">设为精选</a>
        </template>
      </span>
    </s-table>

    <a-modal title="分类管理" :width="800" v-model="visible" @ok="() => (visible = false)">
      <category :kind="3"></category>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Category } from '@/components'
import { getCourseList, updateCourse, deleteCourse } from '@/api/course'

export default {
  name: 'CourseList',
  components: {
    STable,
    Category
  },
  data() {
    return {
      mdl: {},
      visible: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'cid',
          width: '60px'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '讲师',
          dataIndex: 'teacher'
        },
        {
          title: '价格(元)',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '分类',
          dataIndex: 'category_name'
        },
        // {
        //   title: '简介',
        //   dataIndex: 'content'
        // },
        {
          title: '参与人数',
          dataIndex: 'study_count'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          scopedSlots: { customRender: 'create_time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '230px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getCourseList(Object.assign(parameter, this.queryParam)).then(res => {
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
    categoryManage() {
      this.visible = true
    },
    handleAdd() {
      this.$router.push({ name: 'AddCourse' })
    },
    handleInfo() {},
    handleEdit(row) {
      this.$router.push({ name: 'EditCourse', params: { id: row.cid } })
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
          deleteCourse(row.cid).then(res => {
            if (res.code === 0) {
              _this.$refs.table.refresh(true)
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
    recommend(row) {
      updateCourse(row.cid, { is_recommend: 1 }).then(res => {
        if (res.code === 0) {
          this.$message.success('设置成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    cancelRecommend(row) {
      updateCourse(row.cid, { is_recommend: 0 }).then(res => {
        if (res.code === 0) {
          this.$message.success('设置成功')
          this.$refs.table.refresh(true)
        }
      })
    }
  },
  watch: {
    $route() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="scss" scoped></style>
