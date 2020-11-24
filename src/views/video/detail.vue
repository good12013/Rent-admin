<template>
    <div class="app-container">
        <el-form class="form-box"  ref="form" label-width="150px" >
            <el-form-item label="短视频标题" required>
                <el-input v-model="dataInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="短视频分类" required>
                <el-select v-model="dataInfo.cat_name" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="短视频介绍" required>
                <el-input type="textarea" v-model="dataInfo.desc" ></el-input>
            </el-form-item>
            <el-form-item label="短视频封面图">
                <el-upload
                    class="avatar-uploader"
                    :action="upLoadImgUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="dataInfo.cover_url" :src="dataInfo.cover_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>
                    请上传格式为PNG、JPG,大小低于2M的图片
                </span>
            </el-form-item>
            <el-form-item label="短视频链接" required>
                <el-input v-model="dataInfo.video_url"></el-input>
            </el-form-item>
            <el-form-item label="播放时长" required>
                <el-input-number v-model="dataInfo.duration" controls-position="right" :min="0"></el-input-number>&nbsp;<span>分钟</span>
            </el-form-item>
            <el-form-item label="观看人数" required>
                <el-input-number v-model="dataInfo.view_count" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="点赞人数" required>
                <el-input-number v-model="dataInfo.like_count" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="是否置顶" required>
                <el-switch v-model="dataInfo.is_sticky"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.stop="save()">立即保存</el-button>
                <el-button @click.stop="goBack()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
  data() {
    return {
        dialogVisible:false,
        options:[],
        id: 0,
        upLoadImgUrl:"",
        dataInfo: {
            title : "", //标题
            cat_name : "",//分类名称
            desc : "",//短视频介绍
            cover_url : "", //视频封面
            video_url : "", //短视频链接
            duration : 0,//时长
            like_count : 0,//点赞人数
            view_count : 0,//观看人数
            is_sticky  : 0 //是否置顶
        }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.upLoadImgUrl = process.env.VUE_APP_BASE_API + '/api/v1.0/files/image'
    this.getvideoClassList()
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
          if(this.id != 0){
              this.getDetail()
          }
      })
    },
    getDetail(){
        this.GET(
            '/api/v1.0/shortvideos/info',
            {id: this.id},
            data =>{
                this.dataInfo = data.data
                this.dataInfo.is_sticky = this.dataInfo.is_sticky?true:false
            }
        )
    },
    handleAvatarSuccess(e) {
        this.dataInfo.cover_url = e.data
    },
    beforeAvatarUpload(e) {
        console.log(e)
    },
    goBack() {
        window.history.go(-1)
    },
    save() {
        this.dataInfo.is_sticky = this.dataInfo.is_sticky?1:0
        // this.dataInfo.duration = Number(this.dataInfo.duration)
        this.ObjRequired(this.dataInfo,'cover_url',() => {
            this.$message({ message: '请完成*类项目填写或选择',type: 'warning'});
            return
        },() =>{
            if(this.id !=  0){
            this.PUT(
                '/api/v1.0/shortvideos/info?id=' + this.id,
                this.dataInfo,
                data =>{
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.push({name : 'VideoList'})
                } 
            )
        }else{
            this.POST(
                '/api/v1.0/shortvideos',
                this.dataInfo,
                data  =>{
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.push({name : 'VideoList'})
                }
            )
        }
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
  .form-box{
      width: 800px;
  }
  
}

</style>
