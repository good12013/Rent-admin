<template>
  <div class="app-container">
    <el-form :inline="true" >
        <el-form-item label="短视频分类">
            <el-select :clearable="true" v-model="videoClass" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item>
            <el-button type="primary" @click.stop="search()">查询</el-button>
        </el-form-item>
    </el-form>

    <div class="btn-box">
        <!-- <el-button type="danger">批量删除</el-button> -->
        <el-button type="success" @click.stop="toDetail()">新建短视频</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border >
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column align="center" label="短视频编号" prop="id"></el-table-column>
      <el-table-column align="center" label="封面">
        <template slot-scope="scope" width="100px">
          <img class="table-img" :src="scope.row.cover_url" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="短视频标题" prop="title"></el-table-column>
      <el-table-column align="center" label="短视频介绍" prop="desc"></el-table-column>
      <el-table-column align="center" label="上传时间" prop="duration"  width="135"></el-table-column>
      <el-table-column align="center" label="播放链接" prop="video_url"></el-table-column>
      <el-table-column align="center" label="观看数" prop="view_count"></el-table-column>
      <el-table-column align="center" label="点赞数" prop="like_count"></el-table-column>
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
  name : 'VideoList',
  data() {
    return {
        videoName: '',
        videoClass : '',
        videoId : '',
        page:1,
        size:10,
        total:0,
        dataList:[
            {id:1,name:'zhangsabn',time:'2020/05/12 10:00',title:'测试文本'}
        ],
        options:[]
    }
  },
  created(){
    this.getvideoClassList()
    this.getList()
    console.log(1)
  },
  activated() {
    console.log(2)
    this.getList()
  },
  methods: {
    getvideoClassList() {
      this.GET(
        '/api/v1.0/categories',
        {
          section : "short"
        },
        res => {
          this.options = res.data
      })
    },
    getList(page,size){
      this.GET(
        '/api/v1.0/shortvideos/list',
        {
          page_no:page?page:1,
          page_size:size?size:10,
          cat_id:this.videoId
        },
        data => {
          console.log(data)
          this.dataList = data.data.list
          this.total = data.data.total_count
        }
      )
    },
    search() {
      this.videoId = this.videoClass
      this.page = 1
      this.getList()
    },
    topItem(id) {
      console.log(id)
      this.POST(
        '/api/v1.0/shortvideos/sticky?id=' + id,
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
    delItem(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.DELETE(
          '/api/v1.0/shortvideos/single',
          {id : id},
          data =>{
            console.log(1)
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList(this.page,this.size)
          }
        )
      })
      
    },
    // handleSelectionChange(val) {
    //     console.log(val)
    // },
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList(this.page,this.size)
    },
    handleCurrentChange(val) {
      this.page = val
    },
    toDetail(val){
        val = val?val:0
        this.$router.push({path:'/video/detail/'+ val})
    },
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
