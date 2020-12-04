<template>
  <div class="app-container">
    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border empty-text="No data available">
      <el-table-column align="center" label="Shop Name" prop="shop_name"></el-table-column>
      <el-table-column align="center" label="Shop Union ID" prop="shop_union_id"></el-table-column>
      <el-table-column align="center" label="Admin Email" prop="admin_email"></el-table-column>
      <el-table-column align="center" label="Admin Name" prop="admin_name"></el-table-column>
      <el-table-column align="center" label="Last Send Email Time" prop="last_send_email_time"></el-table-column>
      <el-table-column align="center" label="Rent Per Year" prop="rent_per_year"></el-table-column>
      <el-table-column align="center" label="Station Name" prop="station_name"></el-table-column>
      <el-table-column align="center" label="Created Time" prop="created_at"></el-table-column>
      <el-table-column align="center" label="Action" width="240px">
        <template slot-scope="scope">

          <el-button size="mini" type="primary" @click.stop="toDetail(scope.row.shop_id)">Check Detail</el-button>
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
      size:10
    }
  },
  created(){
    this.getList()
  },
  methods: {
    getList(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.GET(
        '/api/admin/shop_list',
        {

        },
        data => {
          this.dataList = data.Shops
          loading.close()
        },
        err =>{
          this.$message.error(err.err_desc)
          loading.close()
        }
      )
    },
    toDetail(val){
        console.log(val)
        val = val?val:0
        this.$router.push({path:'/shop/detail/'+ val})
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
