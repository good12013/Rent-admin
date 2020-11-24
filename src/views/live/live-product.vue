<template>
  <div class="app-container">
    <div class="btn-box">
        <!-- <el-button type="danger">批量删除</el-button> -->
        <el-button type="success" @click.stop="openModal()">添加产品</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="图片">
        <template slot-scope="scope" width="100px">
          <img class="table-img" :src="scope.row.cover_url" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column align="center" label="简介" prop="desc"></el-table-column>
      <el-table-column align="center" label="购买链接" prop="link_url"></el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
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

    <el-dialog title="添加产品" :visible.sync="dialogTableVisible" width="1000px">
        <el-table :data="modalList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="图片">
                <template slot-scope="scope" width="100px">
                <img class="table-img-modal" :src="scope.row.cover_url" alt="">
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" prop="name"></el-table-column>
            <el-table-column align="center" label="简介" prop="desc"></el-table-column>
            <el-table-column align="center" label="购买链接" prop="link_url"></el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChangeModal"
                :current-page="modalPage"
                layout="prev, pager, next"
                :total="modalTotal">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="save()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  name: 'LiveProductLine',
  data() {
    return {
        id:'',
        dialogTableVisible:false,
        dataList:[],
        total:0,
        page:1,
        size:10,
        total:0,
        proId:'',
        modalTitle:'新建产品',
        modalData:{
          cover_url:'',
          desc:'',
          link_url:'',
          name:''
        },
        modalList:[],
        modalTotal:0,
        modalPage:1,
        ids:[]
    }
  },
  created(){
    this.id = this.$route.params.id
    this.getList()
    this.getAllList()
  },
  methods: {
    handleCurrentChangeModal(e){
        this.modalPage = e;
        this.getAllList(e)
    },  
    delItem(id){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.POST(
          '/api/v1.0/livevideos/products',
          {action:'delete',live_id:parseInt(this.id),product_ids:[id]},
          data => {
            this.getList(this.page,this.size)
          }
        )
      })
    },
    handleSelectionChange(arr){
        this.ids = []
        if(arr.length){
            arr.forEach(el => {
                this.ids.push(el.id)
            })
        }
    },
    getList(page,size){
      this.GET(
        '/api/v1.0/products/list',
        {
          page_no:page?page:1,
          page_size:size?size:10,
          live_id:parseInt(this.id)
        },
        data => {
          this.dataList = data.data.list
          this.total = data.data.total_count
        }
      )
    },
    getAllList(page,size){
      this.GET(
        '/api/v1.0/products/list',
        {
          page_no:page?page:1,
          page_size:size?size:10
        },
        data => {
          this.modalList = data.data.list
          this.modalTotal = data.data.total_count
        }
      )
    },
    openModal(item){
      this.dialogTableVisible = true
    },
    save(){
        this.POST(
            '/api/v1.0/livevideos/products',
            {
                action:'add',
                live_id:parseInt(this.id),
                product_ids:this.ids
            },
            data => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.getList(this.page,this.size)
                this.dialogTableVisible = false
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
    width: 40px;
}
.table-img-modal{
    width: 30px;
}
</style>
