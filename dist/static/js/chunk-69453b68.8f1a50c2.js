(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-69453b68"],{bc3d:function(t,e,i){"use strict";var n=i("da66"),a=i.n(n);a.a},d3fc:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container"},[i("el-table",{staticStyle:{width:"100%","margin-top":"30px"},attrs:{data:t.dataList,border:"","empty-text":"No data available"}},[i("el-table-column",{attrs:{align:"center",label:"Shop Id",prop:"shop_id"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"Turnover",prop:"turnover"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"Week Start",prop:"week_start"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"Next Week Start",prop:"next_week_start"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"Created Time",prop:"created_time"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"Action",width:"240px"},scopedSlots:t._u([{key:"default",fn:function(e){return[0==e.row.id?i("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(i){return i.stopPropagation(),t.sendEmail(e.row)}}},[t._v("Send Email")]):t._e()]}}])})],1)],1)},a=[],s={name:"LiveList",data:function(){return{dataList:[],total:0,classId:"",classValue:"",options:[],page:1,size:10,shopId:this.$route.params.id}},created:function(){this.getList()},methods:{sendEmail:function(t){var e=this;this.$confirm("Sure Send Email？","Send Email To Shop",{confirmButtonText:"Sure",cancelButtonText:"cancel",type:"warning"}).then((function(){e.suerSendEmail(t)}))},suerSendEmail:function(t){var e=this,i={shop_id:t.shop_id,week_time:t.week_time},n=this.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"});this.POST("/api/admin/send_notice",i,(function(t){e.$message({message:"Send Email Suc",type:"success"}),e.getList(),n.close()}),(function(t){e.$message.error(t.err_desc),n.close()}))},topItem:function(t){var e=this;this.POST("/api/v1.0/livevideos/sticky?id="+t,{},(function(t){e.$message({message:"置顶成功",type:"success"}),e.getList(e.page,e.size)}))},delItem:function(t){var e=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.DELETE("/api/v1.0/livevideos/single",{id:t},(function(t){e.getList(e.page,e.size)}))}))},search:function(){this.classId=this.classValue,this.page=1,this.getList()},getClassList:function(){var t=this;this.GET("/api/v1.0/categories",{section:"live"},(function(e){t.options=e.data}))},getList:function(t,e){var i=this,n=this.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"});this.GET("/api/admin/shop_turnover",{shop_id:this.shopId},(function(t){i.dataList=t.ShopTurnover,n.close()}),(function(t){i.$message.error(t.err_desc),n.close()}))},handleSizeChange:function(t){this.size=t,this.page=1,this.getList(this.page,this.size)},handleCurrentChange:function(t){this.page=t},toEnroll:function(t){this.$router.push({path:"/live/liveproduct/"+t})},toDetail:function(t){t=t||0,this.$router.push({path:"/live/detail/"+t})}}},o=s,r=(i("bc3d"),i("2877")),c=Object(r["a"])(o,n,a,!1,null,"3301e3cd",null);e["default"]=c.exports},da66:function(t,e,i){}}]);