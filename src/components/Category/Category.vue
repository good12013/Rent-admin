<template>
  <a-card :bordered="false">
    <a-table :columns="columns" :data-source="data" :row-key="record => record.id" :pagination="false">
      <template slot="name" slot-scope="text, record">
        <div key="name">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.id)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record)">保存</a>
            <a-popconfirm title="确定取消?" @confirm="() => cancel(record, index)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => handleEdit(record)">编辑</a>
            <a-popconfirm @confirm="() => handleDel(record.id)" @cancel="cancel" ok-text="是" cancel-text="否">
              <template slot="title">
                <p>你确定要删除该分类吗?</p>
                <p>删除后该分类下所有内容会全部删除</p>
              </template>
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <div class="operate">
      <a-button type="dashed" style="width: 100%" icon="plus" @click="handleAdd">添加</a-button>
    </div>
  </a-card>
</template>

<script>
import { getCategoryList, addCategory, updateCategory, delCategory } from '@/api/category'
export default {
  name: 'Category',
  props: {
    /**
     * 分类类型: 1:文章, 2:测评, 3:网课, 4:正念训练
     * 默认值: 1
     */
    kind: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      columns: [
        {
          title: '分类名',
          dataIndex: 'name',
          width: '50%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      old_data: [],
      data: []
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      getCategoryList({ kind: this.kind }).then(res => {
        this.data = res.data
        this.old_data = res.data
      })
    },
    handleChange(value, id) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target['name'] = value
        this.data = newData
      }
    },
    handleAdd() {
      const category = {
        id: 0,
        name: '',
        editable: true
      }
      this.data.push(category)
    },
    handleEdit(row) {
      const newData = [...this.data]
      const target = newData.filter(item => row.id === item.id)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    handleDel(id) {
      delCategory(id).then(res => {
        if (res.code === 0) {
          this.getCategoryList()
        }
      })
    },
    save(row) {
      if (row.id === 0) {
        const params = {
          name: row.name,
          kind: this.kind
        }
        addCategory(params).then(res => {
          if (res.code === 0) {
            this.getCategoryList()
          }
        })
      } else {
        updateCategory(row.id, row).then(res => {
          if (res.code === 0) {
            this.getCategoryList()
          }
        })
      }
    },
    cancel(row, index) {
      if (row.id === 0) {
        this.data.splice(index, 1)
      } else {
        const newData = [...this.data]
        const target = newData.filter(item => row.id === item.id)[0]
        if (target) {
          Object.assign(target, this.old_data.filter(item => row.id === item.id)[0])
          delete target.editable
          this.data = newData
        }
      }
    }
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
