<template>
  <div class="app-container">

    <div class="btn-box">
        <el-button type="success" @click.stop="openModal()">新增要素</el-button>
    </div>

    <div style="text-align:center;margin-top:30px;">
        <el-radio-group v-model="itemClass" @change="tabClickMain">
            <el-radio-button v-for="item in ClassInfo" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
     <el-table-column align="center" label="名称" prop="name" v-if="itemClass == 1|| itemClass == 2||itemClass == 5"></el-table-column>
            <el-table-column align="center" label="投资机构/人" prop="investor" v-if="itemClass == 4"></el-table-column>
            <el-table-column align="center" label="投资阶段" prop="invest_stage" v-if="itemClass == 4"></el-table-column>
            <el-table-column align="center" label="投资过企业" prop="invested_company" v-if="itemClass == 4"></el-table-column>
            <el-table-column align="center" label="服务详情" prop="service_detail" v-if="itemClass == 3"></el-table-column>
            <el-table-column align="center" label="服务类型" prop="service_type" v-if="itemClass == 3"></el-table-column>
            <el-table-column align="center" label="简介" prop="desc" v-if="itemClass == 6 || itemClass == 1 || itemClass == 2"></el-table-column>
            <el-table-column align="center" label="联系单位" prop="contact_man" v-if="itemClass == 1||itemClass == 3||itemClass == 5||itemClass == 6"></el-table-column>
            <el-table-column align="center" label="联系人" prop="contact_unit" v-if="itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6"></el-table-column>
            <el-table-column align="center" label="联系方式" prop="contact_info" v-if="itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6"></el-table-column>
            <el-table-column align="center" label="有效期" prop="expiration" v-if="itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 4||itemClass == 5"></el-table-column>
            <el-table-column align="center" label="应用领域" prop="apply_area" v-if="itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 5||itemClass == 6"></el-table-column>
            <el-table-column align="center" label="投资领域" prop="invest_field" v-if="itemClass == 4"></el-table-column>
            <el-table-column align="center" label="供给类型" prop="cat_name" v-if="itemClass == 1"></el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click.stop="delList(scope.row.id)">删除</el-button>
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



    <el-dialog title="新增要素" :visible.sync="dialogTableVisible" width="1000px">
        <div style="text-align:center;margin-bottom:30px;">
            <el-radio-group v-model="modalType" @change="modalTypeClick">
                <el-radio-button v-for="item in ClassInfo" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="modalDataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="名称" prop="name" v-if="modalType == 1|| modalType == 2||modalType == 5"></el-table-column>
            <el-table-column align="center" label="投资机构/人" prop="investor" v-if="modalType == 4"></el-table-column>
            <el-table-column align="center" label="投资阶段" prop="invest_stage" v-if="modalType == 4"></el-table-column>
            <el-table-column align="center" label="投资过企业" prop="invested_company" v-if="modalType == 4"></el-table-column>
            <el-table-column align="center" label="服务详情" prop="service_detail" v-if="modalType == 3"></el-table-column>
            <el-table-column align="center" label="服务类型" prop="service_type" v-if="modalType == 3"></el-table-column>
            <el-table-column align="center" label="简介" prop="desc" v-if="modalType == 6 || modalType == 1 || modalType == 2"></el-table-column>
            <el-table-column align="center" label="联系单位" prop="contact_man" v-if="modalType == 1||modalType == 3||modalType == 5||modalType == 6"></el-table-column>
            <el-table-column align="center" label="联系人" prop="contact_unit" v-if="modalType == 1||modalType == 3||modalType == 4||modalType == 5||modalType == 6"></el-table-column>
            <el-table-column align="center" label="联系方式" prop="contact_info" v-if="modalType == 1||modalType == 3||modalType == 4||modalType == 5||modalType == 6"></el-table-column>
            <el-table-column align="center" label="有效期" prop="expiration" v-if="modalType == 1||modalType == 2||modalType == 3||modalType == 4||modalType == 5"></el-table-column>
            <el-table-column align="center" label="应用领域" prop="apply_area" v-if="modalType == 1||modalType == 2||modalType == 3||modalType == 5||modalType == 6"></el-table-column>
            <el-table-column align="center" label="投资领域" prop="invest_field" v-if="modalType == 4"></el-table-column>
            <el-table-column align="center" label="供给类型" prop="cat_name" v-if="modalType == 1"></el-table-column>
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
export default {
  name: 'SceneItem',
  data() {
    return {
        dialogTableVisible:false,
        dataList:[],
        modalDataList:[],
        itemClass:1,
        page:1,
        size:10,
        total:0,
        modalType:1,
        modalPage:1,
        ids:[],
        id:0,
        modalTotal:0
    }
  },
  created(){
    this.id = parseInt(this.$route.params.id)
    this.getModalList()
    this.getList()
  },
  methods: {
    delList(id){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.POST(
          '/api/v1.0/scenes/factors',
          {action:'delete',scene_id:this.id,factor_ids:[id],block:parseInt(this.itemClass)},
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
    // 获取列表数据
    getList(page,size){
      this.GET(
        '/api/v1.0/factors/list',
        {
          page_no:page?page:1,
          page_size:size?size:10,
          block:parseInt(this.itemClass),
          scene_id:this.id
        },
        data => {
          this.total = data.data.total_count
          this.dataList = data.data.list
        }
      )
    },
    save(){
        this.POST(
            '/api/v1.0/scenes/factors',
            {
                action:'add',
                block:parseInt(this.modalType),
                factor_ids:this.ids,
                scene_id:this.id
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
    tabClickMain(e){
      this.itemClass = e
      this.page = 1
      this.getList()
    },
    modalTypeClick(e){
      this.modalType = e
      this.modalPage = 1
      this.getModalList(this.modalPage)
    },
    handleCurrentChangeModal(e){
      this.modalPage = e
      this.getModalList(this.modalPage)
    },
     // 获取列表数据
    getModalList(page,size){
      this.GET(
        '/api/v1.0/factors/list',
        {
          page_no:page?page:1,
          page_size:size?size:10,
          block:parseInt(this.modalType)
        },
        data => {
          this.modalTotal = data.data.total_count
          this.modalDataList = data.data.list
        }
      )
    },
    openModal(){
        this.dialogTableVisible = true
    },
    handleSizeChange(val) {
        this.page = 1
        this.size = val
        this.getList(this.page,this.size)
    },
    handleCurrentChange(val) {
        this.page = val
        this.getList(this.page,this.size)
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