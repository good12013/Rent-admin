<template>
  <div class="app-container">
      <div class="goback-box">
          <el-button @click.stop="goback()">返回</el-button>
      </div>
      <div style="text-align:center;margin-bottom:30px;">
        <el-radio-group v-model="itemClass" @change="tabClickMain">
            <el-radio-button v-for="item in tabInfo" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>
      </div>
      <div>
         <div class="btn-box" v-if="itemClass == 0">
              <el-button type="success" @click.stop="enroll(2)">批量审核拒绝</el-button>
              <el-button type="danger" @click.stop="enroll(1)">批量审核通过</el-button>
          </div>
          <el-table :data="dataList" style="width: 100%;" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column align="center" label="姓名" prop="name"></el-table-column>
              <el-table-column align="center" label="性别" prop="gender"></el-table-column>
              <el-table-column align="center" label="年龄" prop="age_range"></el-table-column>
              <el-table-column align="center" label="职务" prop="title"></el-table-column>
              <el-table-column align="center" label="企业" prop="company"></el-table-column>
              <el-table-column align="center" label="联系电话" prop="mobile"></el-table-column>
              <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
              <el-table-column align="center" v-if="itemClass == 0" label="操作">
                  <template slot-scope="scope">
                  <el-button size="mini" type="success" @click.stop="enroll(1,scope.row.id)">通过</el-button>
                  <el-button size="mini" type="danger" @click.stop="enroll(2,scope.row.id)">拒绝</el-button>
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
  </div>
</template>

<script>

export default {
  name:'ActivityEnroll',
  data() {
    return {
      id:'',
      itemClass:0,
      tabInfo:[
        {name:'待审核',id:0},
        {name:'已审核',id:1},
        {name:'未审核',id:2}
      ],
      dataList:[],
      total:0,
      page:1,
      size:10,
      selectItems:[]
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getList()
  },
  methods: {
    goback(){
      window.history.go(-1)
    },
    enroll(val,id){
      var ids = []
      if(id){
        ids = [id]
      }else{
        if(this.selectItems.length){
          this.selectItems.forEach(el => {
            ids.push(el.id)
          })
        }else{
          this.$message.error('请选择要审核的名单');
          return
        }
        
      }
      this.PUT(
        '/api/v1.0/activities/sheet/review?state=' + val,
        {
          ids:ids
        },
        data => {
          this.$message({
              message: '操作成功',
              type: 'success'
          });
          this.getList(this.page,this.size)
          this.selectItems = []
        }
      )
    },
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList(this.page,this.size)
    },
    // 当前页面改变
    handleCurrentChange(val) {
        this.page = val
        this.getList(this.page,this.size)
    },
    // 获取列表数据
    getList(page,size){
      this.GET(
        '/api/v1.0/activities/sheet/list',
        {
          page_no:page?page:1,
          page_size:size?size:10,
          cat_id:this.id,
          state:this.itemClass
        },
        data => {
          this.total = data.data.total_count
          this.dataList = data.data.list
        }
      )
    },
    tabClickMain(e){
      this.itemClass = e
      this.page = 1
      this.getList(this.page,this.size)
    },
    handleSelectionChange(val) {
      this.selectItems = []
      this.selectItems = val
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
  .goback-box{
      text-align: right;
      margin-bottom: 15px;
  }
}
</style>
