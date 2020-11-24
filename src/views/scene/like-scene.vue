<template>
  <div class="app-container">

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border v-loading="loading">
      <el-table-column align="center" label="场景名称" prop="scene_name"></el-table-column>
      <el-table-column align="center" label="用户名" prop="user_name"></el-table-column>
      <el-table-column align="center" label="用户手机" prop="user_mobile"></el-table-column>
      <el-table-column align="center" label="查看时间" prop="create_time"></el-table-column>
    </el-table>

    <!-- <div class="pagination-box">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'SceneList',
  data() {
    return {
      dataList:[],
      page:1,
      size:10,
      total:0,
      loading : false
    }
  },
  methods: {
    // 获取列表数据
    getList(page,size){
      this.GET(
        '/api/v1.0/intent/scenes',
        {
          page_no:page?page:1,
          page_size:size?size:100
        },
        data => {
          //this.total = data.data.total_count
          this.dataList = data.data
        }
      )
    },


   
    // 每页数量改变
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList(this.page,this.size)
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.page = val
      this.getList(this.page,this.size)
    }
  },
  created(){
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.table-img{
    width: 80px;
}

</style>
