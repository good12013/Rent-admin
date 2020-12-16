<template>
  <div class="app-container">

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange" v-loading="loading" empty-text="No data available">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="Station Name" prop="name"></el-table-column>
      <el-table-column align="center" label="Created Time" prop="created_at"></el-table-column>
      <!--<el-table-column align="center" label="Action" prop="desc"></el-table-column>-->
      <el-table-column align="center" label="Action" width="240px">
        <template slot-scope="scope">

          <el-button size="mini" type="primary" @click.stop="setProportion(scope.row)">Set Proportion</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Set Proportion" :visible.sync="proptionForm.show" width="600px" @close="cancelDialog()" :close-on-click-modal="false" :modal="true">
      <el-form  ref="proptionForm" :model="proptionForm">
        <el-form-item label="Station Name" label-width="120px" prop="name">
          <el-input v-model="proptionForm.name"  class="width-percent-80" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Proportion" label-width="120px" prop="proportion">
          <el-input v-model="proptionForm.proportion" placeholder="input number" class="num-input"></el-input>
        </el-form-item>
        <el-form-item label="Month Time" label-width="120px" prop="chooseWeekTime">
          <el-date-picker
            class="value-info"
            style="width: 280px;height: 40px;"
            v-model="proptionForm.chooseWeekTime"
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
  name: 'SceneList',
  data() {
    return {
      dataList:[],
      page:1,
      size:10,
      total:0,
      loading : false,
      proptionForm:{
        show:false,
        name:'',
        proportion:'',
        chooseWeekTime:''
      },
      pickerOption:{
        firstDayOfWeek: 1
      },
      startTime:''
    }
  },
  methods: {
    // check(str) {
    //   var re = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$
    //   var Sure;
    //   if (!re.test(str)){
    //     Sure =0;
    //   }else{
    //     Sure =1;
    //   }
    //   return Sure;
    // },
    changeTime(val){
      this.startTime = this.getNextDate(val,-1)
      this.proptionForm.chooseWeekTime = this.getNextDate(val,-1) + 'T00:00:00+08:00'
    },
    getNextDate(date, day) {
      var dd = new Date(date);
      dd.setDate(dd.getDate() + day);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      return y + "-" + m + "-" + d;
    },
    cancelDialog(){
      this.proptionForm.name = '';
      this.proptionForm.proportion = '';
      this.proptionForm.chooseWeekTime = '';
      this.proptionForm.show = false;
    },
    checkNum(str){
      var reg = /^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$/;
      return reg.test(str)
    },
    saveForm(){
      if (this.proptionForm.proportion.length==0){
        this.$message.error('Please input Proportion')
        return
      }
      if (!this.checkNum(this.proptionForm.proportion)){
        this.$message.error('Please input correct proportion')
        return
      }
      if (parseFloat(this.proptionForm.proportion) > 1){
        this.$message.error('Please input correct proportion')
        return
      }

      if (this.proptionForm.chooseWeekTime.length==0){
        this.$message.error('Please Choose Week Time')
        return
      }
      // if (!this.check(this.proptionForm.proportion)){
      //   return
      // }
      console.log(this.proptionForm.chooseWeekTime)
      const str = this.proptionForm.chooseWeekTime
      const year = str.match(/(\S*)-/)[1]
      const month = str.match(/-(\S*)/)[1];
      console.log(year)
      console.log(month)
      const params = {
        station_name:this.proptionForm.name,
        proportion:parseFloat(this.proptionForm.proportion),
        year:parseInt(year),
        month:parseInt(month)
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.POST(
        '/api/admin/set_station_flow_proportion',
        params,
        data => {
          this.$message.success('Set Proportion Suc')
          this.cancelDialog()
          this.getList()
          loading.close()
        },
        err => {
          console.log("gooood",err)
          this.$message.error(err.err_desc)
          loading.close()
        }
      )
    },
    setProportion(info){
      this.proptionForm.name = info.name;
      this.proptionForm.proportion = '';
      this.proptionForm.chooseWeekTime = '';
      this.proptionForm.show = true;
    },
    // 获取列表数据
    getList(page,size){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.GET(
        '/api/admin/station_list',
        {

        },
        data => {
          console.log("gooooood1234")
          this.dataList = data.Stations
          loading.close()
        },
        err =>{
          this.$message.error(err.err_desc)
          loading.close()
        }
      )
    },
    // 导入
    importFile(){
      this.$refs.importDom.click()
    },

    // 文件改变时上传
    update(e){
      this.loading = true
      this.ImportFile(
        e,
        '/api/v1.0/scenes/import',
        data => {
          this.loading = false
          this.page = 1
          this.getList(this.page,this.size)
        },
        err => {
          this.loading = false
        }
      )
    },

    // 删除
    delItem(item){
      this.$confirm('是否删除' + item.row.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DELETE(
          '/api/v1.0/scenes/single',
          {id:item.row.id},
          data => {
            this.getList(this.page,this.size)
          }
        )
      })
    },


    // 表格选中数据
    handleSelectionChange(val) {
        console.log(val,1111111)
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
    },
    // 到详情页面 val携带参数
    toDetail(val){
        val = val?val:0
        this.$router.push({path:'/station/detail/'+ val})
    },
    toContent(val){
        val = val?val:0
        this.$router.push({path:'/station/item/'+ val})
    }
  },
  created(){
    this.getList()
  },
  activated(){
    this.getList(this.page,this.size)
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  .class /deep/  .a input::-webkit-outer-spin-button,
  .class /deep/  .a input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .class /deep/  .a input[type="number"]{
    -moz-appearance: textfield;
  }
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
