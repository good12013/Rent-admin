<template>
  <div class="app-container">
    <el-form  ref="detailForm" :model="detailForm">
      <el-form-item label="Month Time" label-width="120px" prop="chooseWeekTime">
        <el-date-picker
          class="value-info"
          style="width: 280px;height: 40px;"
          v-model="detailForm.chooseWeekTime"
          type="month"
          placeholder="select a month"
          value-format="yyyy-MM"
          :picker-options="pickerOption"
          @change="changeMonth"></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="week-date">
      <div v-for="item in weekDayList" style="width: 14.2%;height: 60px;text-align: center;line-height: 60px;">{{item}}</div>
    </div>
    <div class="data-date">
      <div v-for="(item,index) in monthDateList" style="width: 14.2%;
    height: 100px;border-top:1px solid #f0f0f0;border-left: 1px solid #f0f0f0;">
        <div>
          <div style="margin:0 auto;margin-bottom: 10px;text-align: center;margin-top: 5px;">
            {{item.time}}
          </div>
          <div style="margin:0 auto;margin-bottom: 10px;text-align: center">{{item.turnover}}</div>
          <el-button v-if="item.turnover==='no turnover'" size="mini" type="primary" @click.stop="sendEmail(item.time)" style="margin:0 auto;display: block;">Send Email</el-button>
        </div>
      </div>
    </div>
    <!--<el-calendar :range="['2019-03-05', '2019-03-24']"  >-->
      <!--<template-->
        <!--slot="dateCell"-->
        <!--slot-scope="{date, data}">-->
        <!--<div v-if="data.day.split('-').slice(1)[0]==12">-->
          <!--<div :class="data.isSelected ? 'is-selected' : ''" style="margin:0 auto;margin-bottom: 5px;text-align: center">-->
            <!--{{data.day.split('-').slice(1).join('-')}}-->
          <!--</div>-->
          <!--<div style="margin:0 auto;margin-bottom: 5px;text-align: center">{{getTurnover(data.day)}}</div>-->
          <!--<el-button v-if="getTurnover(data.day) === 'no turnover'" size="mini" type="primary" @click.stop="sendEmail(data.day)" style="margin:0 auto;display: block;">Send Email</el-button>-->
        <!--</div>-->

      <!--</template>-->
    <!--</el-calendar>-->
    <!--<el-table :data="dataList" style="width: 100%;margin-top:30px;" border  empty-text="No data available">-->
      <!--<el-table-column align="center" label="Shop Id" prop="shop_id"></el-table-column>-->
      <!--<el-table-column align="center" label="Turnover" prop="turnover"></el-table-column>-->
      <!--<el-table-column align="center" label="Calendar Date" prop="calendar_date"></el-table-column>-->
      <!--<el-table-column align="center" label="Created Time" prop="created_time"></el-table-column>-->
      <!--<el-table-column align="center" label="Action" width="240px">-->
        <!--<template slot-scope="scope">-->

          <!--<el-button v-if="scope.row.id==0" size="mini" type="primary" @click.stop="sendEmail(scope.row)">Send Email</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showLoading:false,
        dateRange:[],
        currentDate:new Date(),
        dataList:[],
        total:0,
        classId:'',
        classValue:'',
        options:[],
        page:1,
        size:10,
        shopId:this.$route.query.id,
        year:new Date().getFullYear(),
        month:new Date().getMonth() + 1,
        detailForm:{
          chooseWeekTime:''
        },
        pickerOption:{
          firstDayOfWeek: 1
        },
        monthDateList:[],
        weekDayList:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
      }
    },
    created(){
      this.getList()
    },
    mounted(){
      const myDate = new Date();
      let tYear = myDate.getFullYear();
      let tMonth = myDate.getMonth();
      let  m = tMonth + 1;
      if (m.toString().length == 1) {
        m = "0" + m;
      }
      this.detailForm.chooseWeekTime = tYear + '-' + m
    },
    methods: {
      getTurnover(dateTime){
        let dateNotice = 'no turnover'
        for (var i=0;i<this.dataList.length;i++)
        {
          if (this.dataList[i].calendar_date.indexOf(dateTime)!==-1){
            dateNotice = this.dataList[i].turnover
            break
          }
        }
        return dateNotice
      },
      getLastDay(year,month) {
        var new_year = year;    //取当前的年份
        var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
        if(month>12) {
          new_month -=12;        //月份减
          new_year++;            //年份增
        }
        var new_date = new Date(new_year,new_month,1);
        const day = new Date('2020-12-01').getDay()
        // console.log("gooo123",day)
        //取当年当月中的第一天
        return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
      },
      changeMonth(){
        const str = this.detailForm.chooseWeekTime
        this.year = str.match(/(\S*)-/)[1]
        this.month = str.match(/-(\S*)/)[1];
        this.getList()
      },
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
          shop_id:parseInt(this.shopId),
          month_date:info+ 'T00:00:00+08:00'
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
        this.showLoading = false
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.GET(
          '/api/admin/shop_turnover',
          {
            shop_id:this.shopId,
            year:parseInt(this.year),
            month:parseInt(this.month)
          },
          data => {
            this.dataList = data.ShopTurnover
            let monthDateList = []
            for (let i=1;i < 36;i++){
              let info = {
                time:'',
                turnover:''
              }
              const day = new Date(this.detailForm.chooseWeekTime + '-01').getDay()
              if(i < day){

              }else if (i-day+1 < parseInt(this.getLastDay(parseInt(this.year),parseInt(this.month))) + 1){
                let str = this.detailForm.chooseWeekTime
                if (i-day +1 < 10){
                  str = str + '-0' + (i-day+1)
                }else{
                  str = str + '-' + (i-day+1)
                }
                info.time = str
                info.turnover = this.getTurnover(str)

              }else{

              }
              monthDateList.push(info)

            }
            this.monthDateList = monthDateList
            this.showLoading = true
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
  .el-calendar-day{
    height: 100px;
  }
  .data-date{
    border-bottom: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-wrap: wrap;
  }
  .week-date{
    display: flex;
    flex-wrap: wrap;
  }
</style>
