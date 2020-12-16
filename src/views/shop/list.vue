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
    <el-dialog title="Check Detail" :visible.sync="detailForm.show" width="600px" @close="cancelDialog()" :close-on-click-modal="false" :modal="true">
      <el-form  ref="detailForm" :model="detailForm">
        <el-form-item label="Station Name" label-width="120px" prop="name">
          <el-input v-model="detailForm.name"  class="width-percent-80" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Month Time" label-width="120px" prop="chooseWeekTime">
          <el-date-picker
            class="value-info"
            style="width: 280px;height: 40px;"
            v-model="detailForm.chooseWeekTime"
            type="month"
            placeholder="select a month"

            value-format="yyyy-MM"
            :picker-options="pickerOption"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">Cancel</el-button>
        <el-button type="primary" @click="saveForm()">Sure</el-button>
      </span>
    </el-dialog>
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
      detailForm:{
        show:false,
        name:'',
        chooseWeekTime:'',
        id:''
      },
      pickerOption:{
        firstDayOfWeek: 1
      },
    }
  },
  created(){
    this.getList()
  },
  methods: {
    cancelDialog(){
      this.detailForm.name = ''
      this.detailForm.id = ''
      this.detailForm.chooseWeekTime = ''
      this.detailForm.show = false
    },
    saveForm(){
      if (this.detailForm.chooseWeekTime.length == 0){
        this.$message.error('Please choose a month')
        return
      }
      const str = this.detailForm.chooseWeekTime
      const year = str.match(/(\S*)-/)[1]
      const month = str.match(/-(\S*)/)[1];
      this.toDetail(this.detailForm.id,year,month)
    },
    checkDetail(info){
      this.detailForm.name = info.shop_name
      this.detailForm.id = info.shop_id
      this.detailForm.chooseWeekTime = ''
      this.detailForm.show = true
    },
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
    toDetail(id){
        // console.log(val)
        // val = val?val:0
        const pathUrl = `?id=${id}`
        this.$router.push('/shop/detail'+ pathUrl)
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
