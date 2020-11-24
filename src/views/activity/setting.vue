<template>
    <div class="app-container">
        <div class="check-box">
            <div class="box">
                <el-checkbox class="checkbox">姓名</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
            <div  class="box">
                <el-checkbox  class="checkbox">年龄</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
            <div  class="box">
                <el-checkbox  class="checkbox">性别</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
            <div  class="box">
                <el-checkbox  class="checkbox">证件类型</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
            <div  class="box">
                <el-checkbox  class="checkbox">证件号</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
            <div  class="box">
                <el-checkbox  class="checkbox">所在城市</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
            <div  class="box">
                <el-checkbox  class="checkbox">联系电话</el-checkbox>
                <el-switch
                    v-model="value"
                    inactive-text="是否必填">
                </el-switch>
            </div>
        </div>
        <div class="btns">
            <el-button type="primary">保存</el-button>
            <el-button type="danger">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            value : false
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
  .check-box{
      width: 600px;
      padding: 30px 0 0 30px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .box{
          margin-bottom: 15px;
          .checkbox{
              width: 100px;
          }
      }
  }
  .btns{
      text-align: center;
      margin-top: 70px;
      button{
          width: 120px;
      }
  }
}
</style>
