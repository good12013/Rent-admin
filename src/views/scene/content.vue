<template>
  <div class="app-container">
    <div class="btn-box">
        <!-- <el-button type="danger">批量删除</el-button>
        <el-button type="success" @click.stop="openModal()">新建内容</el-button> -->
        <el-button type="primary" @click.stop="importFile()">要素导入</el-button>
        <input name="file" type="file" ref="importDom" @change="update" v-show="false" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </div>

    <div style="text-align:center;margin-top:30px;">
        <el-radio-group v-model="itemClass" @change="tabClickMain">
            <el-radio-button v-for="item in ClassInfo" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border v-loading="loading">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="名称" prop="name" v-if="itemClass == 1|| itemClass == 2||itemClass == 5"></el-table-column>
      <el-table-column align="center" label="投资机构/人" prop="investor" v-if="itemClass == 4"></el-table-column>
      <el-table-column align="center" label="投资阶段" prop="invest_stage" v-if="itemClass == 4"></el-table-column>
      <el-table-column align="center" label="投资过企业" prop="invested_company" v-if="itemClass == 4"></el-table-column>
      <el-table-column align="center" label="服务详情" prop="service_detail" v-if="itemClass == 3"></el-table-column>
      <el-table-column align="center" label="服务类型" prop="service_type" v-if="itemClass == 3"></el-table-column>
      <el-table-column align="center" label="介绍" prop="desc" v-if="itemClass == 6 || itemClass == 1 || itemClass == 2"></el-table-column>
      <el-table-column align="center" label="联系单位" prop="contact_unit" v-if="itemClass == 1||itemClass == 3||itemClass == 5||itemClass == 6"></el-table-column>
      <el-table-column align="center" label="联系人" prop="contact_man" v-if="itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6"></el-table-column>
      <el-table-column align="center" label="联系方式" prop="contact_info" v-if="itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6"></el-table-column>
      <el-table-column align="center" label="信息有效期" prop="expiration" v-if="itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 4||itemClass == 5"></el-table-column>
      <el-table-column align="center" label="应用领域" prop="apply_area" v-if="itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 5||itemClass == 6"></el-table-column>
      <el-table-column align="center" label="标签" prop="tag_names"></el-table-column>
      <el-table-column align="center" label="投资领域" prop="invest_field" v-if="itemClass == 4"></el-table-column>
      <el-table-column align="center" label="供给类型" prop="cat_name" v-if="itemClass == 1"></el-table-column>
      
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="edit(scope.row.id)">编辑</el-button>
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

    <el-dialog title="编辑要素" :visible.sync="dialogFormVisible">
        <el-form label-width="100px" >
            <el-form-item required label="要素名称" v-if="itemClass == 1|| itemClass == 2||itemClass == 5">
                <el-input v-model="dataInfo.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item required label="投资机构/人" v-if="itemClass == 4">
                <el-input v-model="dataInfo.investor" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item required label="投资阶段" v-if="itemClass == 4">
                <el-select v-model="dataInfo.invest_stage" placeholder="请选择">
                    <el-option label="种子轮" value="种子轮"></el-option>
                    <el-option label="天使轮" value="天使轮"></el-option>
                    <el-option label="A轮" value="A轮"></el-option>
                    <el-option label="B轮" value="B轮"></el-option>
                    <el-option label="C轮" value="C轮"></el-option>
                    <el-option label="D轮" value="D轮"></el-option>
                    <el-option label="Pre-IPO" value="Pre-IPO"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="投资过企业" v-if="itemClass == 4">
                <el-input v-model="dataInfo.invested_company" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item required label="服务详情" v-if="itemClass == 3">
                <el-input v-model="dataInfo.service_detail" type="textarea"></el-input>
            </el-form-item>
            <el-form-item required label="服务类型" v-if="itemClass == 3">
                <el-select v-model="dataInfo.service_type"  placeholder="请选择">
                    <el-option label="培训" value="培训"></el-option>
                    <el-option label="人事代理" value="人事代理"></el-option>
                    <el-option label="招聘" value="招聘"></el-option>
                    <el-option label="项目辅导" value="项目辅导"></el-option>
                    <el-option label="管理咨询" value="管理咨询"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="简介" v-if="itemClass == 6 || itemClass == 1 || itemClass == 2">
                <el-input type="textarea" v-model="dataInfo.desc"></el-input>
            </el-form-item>
            <el-form-item required label="联系单位" v-if="itemClass == 1||itemClass == 3||itemClass == 5||itemClass == 6">
                <el-input  autocomplete="off" v-model="dataInfo.contact_man"></el-input>
            </el-form-item>
            <el-form-item required label="联系人" v-if="itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6">
                <el-input  autocomplete="off" v-model="dataInfo.contact_unit"></el-input>
            </el-form-item>
            <el-form-item required label="联系方式" v-if="itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6">
                <el-input  autocomplete="off" v-model="dataInfo.contact_info"></el-input>
            </el-form-item>
            <el-form-item required label="有效期" v-if="itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 4||itemClass == 5">
                <el-input  autocomplete="off" v-model="dataInfo.expiration"></el-input>
            </el-form-item>
            <el-form-item required label="标签">
                <el-select style="width:100%"  v-model="selectTags" multiple placeholder="请选择">
                    <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="应用领域" v-if="itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 5||itemClass == 6">
                <el-select  v-model="dataInfo.apply_area" placeholder="请选择">
                    <el-option
                    v-for="item in yyly"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="投资领域" v-if="itemClass == 4">
                <el-select v-model="dataInfo.invest_field" placeholder="请选择">
                    <el-option
                    v-for="item in tzly"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="供给类型" v-if="itemClass == 1">
                <el-select v-model="dataInfo.cat_name" placeholder="请选择">
                   <el-option label="产品" value="产品"></el-option>
                  <el-option label="解决方案" value="解决方案"></el-option>
                </el-select>
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
export default {
  name: 'SceneContent',
  data() {
    return {
        imageUrl:'',
        dialogFormVisible:false,
        dataList:[],
        itemClass:1,
        page:1,
        size:10,
        total:0,
        ysId:'',
        tags:[],
        selectTags:[],
        dataInfo:{},
        yyly:['快递物流','电商平台','零售','家电','医疗','电子','汽车','食品','机构','新经济','文创文旅','5G'],
        tzly:['生产制造','医疗健康','金融','光电','企业服务','地产建筑','能源矿产','汽车交通','消费生活','材料',
        '人工智能','电商','化工','文娱传媒','硬件','农业','机器人','环保','房产家居','物流','公用事业','教育',
        '旅游','VR、AR','体育','社交','工具','无人机'],
        loading : false
    }
  },
  created(){
    this.getList()
    this.getTags()
  },
  methods: {
    getTags(){
        this.GET(
            '/api/v1.0/tags',
            {},
            data => {
                this.tags = data.data
                this.tags.forEach(el => {
                    el.id = JSON.stringify(el.id) 
                })
            }
        )
    },
    tabClickMain(e){
      this.itemClass = e
      this.page = 1
      this.getList(this.page,this.size)
    },
    getdetail(id,over){
      this.GET(
        '/api/v1.0/factors/info',
        {id:id},
        data => {
          this.dataInfo = data.data
          this.selectTags = this.dataInfo.tag_ids.split(',')
          over()
        }
      )
    },
     // 删除
    delItem(id){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DELETE(
          '/api/v1.0/factors/single',
          {id:id},
          data => {
            this.getList(this.page,this.size)
          }
        )
      })
    },
    save(){
      var itemClass = this.itemClass
      if(itemClass == 1|| itemClass == 2||itemClass == 5){
        if(!this.dataInfo.name){
          this.$message({ message: '要素名称不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 4){
        if(!this.dataInfo.investor){
          this.$message({ message: '投资机构/人不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 4){
        if(!this.dataInfo.invest_stage){
          this.$message({ message: '请选择投资阶段',type: 'warning'});
          return
        }
      }
      if(itemClass == 4){
        if(!this.dataInfo.invested_company){
          this.$message({ message: '投资过企业不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 3){
        if(!this.dataInfo.service_detail){
          this.$message({ message: '服务详情不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 3){
        if(!this.dataInfo.service_type){
          this.$message({ message: '请选择服务类型',type: 'warning'});
          return
        }
      }
      if(itemClass == 6 ||itemClass == 1 || itemClass == 2){
        if(!this.dataInfo.desc){
          this.$message({ message: '简介不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 1||itemClass == 3||itemClass == 5||itemClass == 6){
        if(!this.dataInfo.contact_man){
          this.$message({ message: '联系单位不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6){
        if(!this.dataInfo.contact_unit){
          this.$message({ message: '联系人不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 1||itemClass == 3||itemClass == 4||itemClass == 5||itemClass == 6){
        if(!this.dataInfo.contact_info){
          this.$message({ message: '联系方式不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 4||itemClass == 5){
        if(!this.dataInfo.expiration){
          this.$message({ message: '有效期不能为空',type: 'warning'});
          return
        }
      }
      if(itemClass == 1||itemClass == 2||itemClass == 3||itemClass == 5||itemClass == 6){
        if(!this.dataInfo.apply_area){
          this.$message({ message: '请选择应用领域',type: 'warning'});
          return
        }
      }
      if(itemClass == 4){
        if(!this.dataInfo.invest_field){
          this.$message({ message: '请选择投资领域',type: 'warning'});
          return
        }
      }
      if(itemClass == 1){
        if(!this.dataInfo.cat_name){
          this.$message({ message: '请选择供给类型',type: 'warning'});
          return
        }
      }
      var tagStrs = ''
      this.selectTags.forEach(el => {
          tagStrs += el + ','
      })
      if(tagStrs){
        tagStrs = tagStrs.substr(0, tagStrs.length - 1)
      }
      this.dataInfo.tag_ids = tagStrs
      this.PUT(
        '/api/v1.0/factors/info?id=' + this.ysId,
        this.dataInfo,
        data => {
          this.$message({
              message: '编辑成功',
              type: 'success'
          });
          this.dialogFormVisible = false
          this.getList(this.page,this.size)
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
        this.getList(this.page,this.size)
    },
    // 导入
    importFile(){
      this.$refs.importDom.click()
    },
    // 获取列表数据
    getList(page,size){
      this.GET(
        '/api/v1.0/factors/list',
        {
          page_no:page?page:1,
          page_size:size?size:10,
          block:this.itemClass
        },
        data => {
          this.total = data.data.total_count
          this.dataList = data.data.list
        }
      )
    },
    // 文件改变时上传
    update(e){
      this.loading = true
      this.ImportFile(
        e,
        '/api/v1.0/factors/import',
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
    edit(id){
      this.ysId = id
      this.getdetail(id,() => {
        this.dialogFormVisible = true
      })
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
