<template>
  <div class="app-container">
    <!--<el-form :inline="true" >-->
    <!--<el-form-item label="直播分类">-->
    <!--<el-select :clearable="true" v-model="classValue" placeholder="请选择">-->
    <!--<el-option-->
    <!--v-for="item in options"-->
    <!--:key="item.id"-->
    <!--:label="item.name"-->
    <!--:value="item.id">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!---->
    <!--<el-form-item>-->
    <!--<el-button type="primary" @click.stop="search()">查询</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->

    <!--<div class="btn-box">-->
    <!--&lt;!&ndash; <el-button type="danger">批量删除</el-button> &ndash;&gt;-->
    <!--<el-button type="success" @click.stop="toDetail()">新建直播</el-button>-->
    <!--</div>-->

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="Shop Id" prop="shop_id"></el-table-column>
      <el-table-column align="center" label="turnover" prop="turnover"></el-table-column>
      <el-table-column align="center" label="week_time" prop="week_time"></el-table-column>
      <el-table-column align="center" label="created_time" prop="created_time"></el-table-column>
      <el-table-column align="center" label="Action" width="240px">
        <template slot-scope="scope">

          <el-button size="mini" type="primary" @click.stop="sendEmail(scope.row)">Send Email</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div class="pagination-box">-->
    <!--<el-pagination-->
    <!--@size-change="handleSizeChange"-->
    <!--@current-change="handleCurrentChange"-->
    <!--:current-page="page"-->
    <!--:page-sizes="PageSizes"-->
    <!--:page-size="PageSize"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="total">-->
    <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'LiveList',
    data() {
      return {
        dataList:[],
        total:0,
        classId:'',
        classValue:'',
        options:[],
        page:1,
        size:10,
        shopId:this.$route.params.id,
      }
    },
    created(){
      this.getList()
      // this.getClassList()
    },
    methods: {
      sendEmail(info){
        let that = this
        this.$confirm('Sure Send Email？', 'Send Email To Shop', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          that.suerSendEmail(info)
        });
      },
      suerSendEmail(info){
        const params = {
          shop_id:info.shop_id,
          week_time:info.week_time
        }
        this.POST(
          '/api/admin/send_notice',
          params,
          data => {
            this.$message({
              message: 'Send Email Suc',
              type: 'success'
            });
            this.getList()
          }
        )
      },
      topItem(id){
        this.POST(
          '/api/v1.0/livevideos/sticky?id=' + id,
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
            '/api/v1.0/livevideos/single',
            {id:id},
            data => {
              this.getList(this.page,this.size)
            }
          )
        })
      },
      search(){
        this.classId = this.classValue
        this.page = 1
        this.getList()
      },
      // 获取分类
      getClassList() {
        this.GET(
          '/api/v1.0/categories',
          {
            section : "live"
          },
          res => {
            this.options = res.data
          }
        )
      },
      //
      getList(page,size){
        this.GET(
          '/api/admin/shop_turnover',
          {
            shop_id:this.shopId
          },
          data => {
            this.dataList = data.ShopTurnover
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
        this.$router.push({path:'/live/liveproduct/' + val})
      },
      toDetail(val){
        val = val?val:0
        this.$router.push({path:'/live/detail/'+ val})
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
