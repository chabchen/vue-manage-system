 <!--
  @date:2018/08/06
  @author:ccf
  @modifyAuthor:
  @modifyDate:
  @describe:
 -->
 <template>
    <div class="uploadFile">
        <div class="container">
            <div class="employee_topone">
                <p class="common_title">附件上传</p>
                <el-upload class="upload-demo" action="/api/file/uploadFile/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                    <el-button size="small" type="primary" @click="upload">点击上传</el-button>
                </el-upload>
            </div>
        </div>
    </div>
</template>
<script>
export default {   
    data() {
        return {
            fileList: [],
            fileJson:{
                businessId:0,
                businessType:0,
                fileType:'',
                remark:'',
                flag:0
            },
      };
    },
    computed: {
    },
    created() {
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      upload(){

      }
    }
}


</script>
<style lang="scss">
.uploadFile{
    width: 100%
}


</style>

