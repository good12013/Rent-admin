<template>
  <div class="app-container">
    <div class="btn-box">
        <!-- <el-button type="danger">批量删除</el-button> -->
        <el-button type="success" @click.stop="openModal()">新建产品</el-button>
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
          <el-button size="mini" @click.stop="openModal(scope.row)" type="primary">编辑</el-button>
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

    <el-dialog :title="modalTitle" :visible.sync="dialogFormVisible">
        <el-form label-width="80px" style="padding:30px;">
            <el-form-item label="产品名称" required >
                <el-input  v-model="modalData.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="产品简介" required >
                <el-input v-model="modalData.desc"   autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item   label="购买链接" required >
                <el-input v-model="modalData.link_url"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="产品图片">
                <el-upload
                    class="avatar-uploader"
                    :action="upLoadImgUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="modalData.cover_url" :src="modalData.cover_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>
                    请上传格式为PNG,JPG且低于2M的图片
                </span>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save()">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  name: 'LiveProduct',
  data() {
    return {
        upLoadImgUrl:'',
        imageUrl:'',
        dialogFormVisible:false,
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
        }
    }
  },
  created(){
    this.upLoadImgUrl = process.env.VUE_APP_BASE_API + '/api/v1.0/files/image'
    this.getList()
  },
  methods: {
    delItem(id){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DELETE(
          '/api/v1.0/products/single',
          {id:id},
          data => {
            this.getList(this.page,this.size)
          }
        )
      })
    },
    getList(page,size){
      this.GET(
        '/api/v1.0/products/list',
        {
          page_no:page?page:1,
          page_size:size?size:10
        },
        data => {
          this.dataList = data.data.list
          this.total = data.data.total_count
        }
      )
    },
    beforeAvatarUpload(e){
        //console.log(e)
    },
    handleAvatarSuccess(e){
        this.modalData.cover_url = e.data
    },
    openModal(item){
      if(item){
        this.proId = item.id
        this.modalTitle = '编辑产品'
        this.modalData = deepClone(item)
        this.dialogFormVisible = true
      }else{
        this.modalData = {
          cover_url:'',
          desc:'',
          link_url:'',
          name:''
        }
        this.modalTitle = '新建产品'
        this.dialogFormVisible = true
      }
    },
    save(){
      this.ObjRequired(this.modalData,'cover_url',() => {
            this.$message({ message: '请完成*类项目填写或选择',type: 'warning'});
            return
        },() =>{
      if(this.modalTitle == '新建产品'){
        this.POST(
          '/api/v1.0/products',
          this.modalData,
          data => {
            this.$message({
                message: '新建成功',
                type: 'success'
            });
            this.getList(this.page,this.size)
            this.dialogFormVisible = false
          }
        )
      }else{
        this.PUT(
          '/api/v1.0/products/info?id=' + this.proId,
          this.modalData,
          data => {
            this.$message({
                message: '编辑成功',
                type: 'success'
            });
            this.getList(this.page,this.size)
            this.dialogFormVisible = false
          }
        )
      }
      })
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
</style>
