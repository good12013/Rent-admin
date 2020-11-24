<template>
  <div class="app-container">

    <div class="btn-box">
        <el-button type="success" @click.stop="toDetail()">新建活动</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="活动封面">
        <template slot-scope="scope" width="100px">
          <img class="table-img" :src="scope.row.cover_url" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动标题" prop="title"></el-table-column>
      <el-table-column align="center" label="活动介绍" prop="desc"></el-table-column>
      <el-table-column align="center" label="活动时间">
        <template slot-scope="scope">
          {{scope.row.begin_ymdhm}} - {{scope.row.end_ymdhm}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动地点" prop="location"></el-table-column>
      <el-table-column align="center" label="活动嘉宾">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.guestsArr" :key="index">
            <el-popover
              placement="top-start"
              title="介绍"
              width="200"
              trigger="click"
              :content="item.intro">
              <el-button size="mini" slot="reference">{{item.name}}</el-button>
            </el-popover>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报名人员" width="100">
        <template slot-scope="scope">
          <el-link type="primary" @click.stop="toEnroll(scope.row.id)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-if="scope.row.is_sticky != 1" @click.stop="topItem(scope.row.id)">置顶</el-button>
          <el-button size="mini" type="primary" @click.stop="toDetail(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click.stop="delItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityList',
  data() {
    return {
      dataList:[],
      total:0,
      page:1,
      size:10
    }
  },
  activated() {
    this.getList(this.page,this.size)
  },
  // created(){
  //   this.getList()
  // },
  methods: {
    topItem(id){
      this.POST(
        '/api/v1.0/activities/sticky?id=' + id,
        {},
        data => {
          this.$message({
              message: '置顶成功',
              type: 'success'
          });
          this.getList(this.page,this.size)
        }
      )
    },
    delItem(id){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DELETE(
          '/api/v1.0/activities/single',
          {id:id},
          data => {
            this.getList(this.page,this.size)
          }
        )
      })
    },
    // 获取列表数据
    getList(page,size){
      this.GET(
        '/api/v1.0/activities/list',
        {
          page_no:page?page:1,
          page_size:size?size:10
        },
        data => {
          this.total = data.data.total_count
          this.dataList = data.data.list
          this.dataList.forEach(el => {
            if(el.guests){
              el.guestsArr = JSON.parse(el.guests)
            }
          })
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
    },
    toEnroll(val){
        this.$router.push({path:'/activity/enroll/'+ val})
    },
    toDetail(val){
        val = val?val:0
        this.$router.push({path:'/activity/detail/'+ val})
    }
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
