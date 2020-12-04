<template>
  <div class="app-container">

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border  empty-text="No data available">
      <el-table-column align="center" label="Shop Id" prop="shop_id"></el-table-column>
      <el-table-column align="center" label="Turnover" prop="turnover"></el-table-column>
      <el-table-column align="center" label="Week Start" prop="week_start"></el-table-column>
      <el-table-column align="center" label="Next Week Start" prop="next_week_start"></el-table-column>
      <el-table-column align="center" label="Created Time" prop="created_time"></el-table-column>
      <el-table-column align="center" label="Action" width="240px">
        <template slot-scope="scope">

          <el-button v-if="scope.row.id==0" size="mini" type="primary" @click.stop="sendEmail(scope.row)">Send Email</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
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
          week_time:info.week_start
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.POST(
          '/api/admin/send_notice',
          params,
          data => {
            this.$message({
              message: 'Send Email Suc',
              type: 'success'
            });
            this.getList()
            loading.close()
          },
          err =>{
            this.$message.error(err.err_desc)
            loading.close()
          }
        )
      },
      getList(page,size){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.GET(
          '/api/admin/shop_turnover',
          {
            shop_id:this.shopId
          },
          data => {
            this.dataList = data.ShopTurnover
            loading.close()
          },
          err =>{
            this.$message.error(err.err_desc)
            loading.close()
          }
        )
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
