<template>
  <div class="app-container">
    <div class="btn-box">
        <el-button type="success" @click.stop="handleAddClass">新建标签</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" type="index" width="100px"></el-table-column>
      <el-table-column align="center" label="关键字名称" prop="name"></el-table-column>
      <el-table-column align="center" label="关键字描述" prop="desc"></el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="handleEdit(scope)">编辑</el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-box">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
        </el-pagination>
    </div> -->

    <el-dialog :title="dialogType==='edit'?'编辑标签':'新建标签'" :visible.sync="dialogVisible">
      <el-form :model="data" label-width="100px" label-position="left">
        <el-form-item label="标签名称" required >
          <el-input v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="标签描述">
          <el-input v-model="data.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClass">取 消</el-button>
        <el-button type="primary" @click="confirmClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'LiveClass',
  data() {
    return {
      dataList:[],
      dialogVisible : false,
      dialogType : 'new',
      data: {
        name : '',
        desc : ''
      }
    }
  },
  created() {
    this.getDataList()
  },
  activated() {
    console.log(123)
  },
  methods: {
    getDataList() {
      this.GET(
      '/api/v1.0/tags',
      {},
      res => {
        if(res.code === 0){
          this.dataList = res.data
        }
      }
    )
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleAddClass() {
      this.data = {
        name : '',
        desc : ''
      }
      this.dialogVisible = true
      this.dialogType = 'new'
    },
    cancelClass() {
      this.dialogVisible = false
    },
    async confirmClass() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        
      } else {
        await this.ObjRequired(this.data,'desc',() => {
            this.$message({ message: '请完成*类项目填写或选择',type: 'warning'});
            return
        },() =>{
        const params = { desc : this.data.desc , name : this.data.name }
        this.POST(
          "/api/v1.0/tags",
          params,
          data=>{
            this.dialogVisible = false
            this.getDataList()
            this.$message({
                message: '新建成功',
                type: 'success'
            }); 
          }
        )
      })
      }
    },
    handleEdit(scope) {
      console.log(scope)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.data = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      var _this = this
      this.$confirm('确定删除这条标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          _this.DELETE(
            '/api/v1.0/tags/single',
            {id:row.id},
            data => {
              _this.$message({
                type: 'success',
                message: '删除成功!'
              })
              _this.getDataList()
            }
          )
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
