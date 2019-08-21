 <!--
  @date:2018/07/04
  @author:ccf
  @modifyAuthor:
  @modifyDate:
  @describe:
 -->
 <template>
    <div class="roleMenu container need_scroll">
        <el-container class="main_container" v-loading="loading">
            <el-container class="um-container" style="display:flex;height:680px;">
                <el-aside width="70%" style="background-color: #fff;margin-right:5px;padding:10px;">
                    <el-card shadow="never" class="role_container">
                        <div class="um-input">
                            角色代码：
                            <el-input size="mini" placeholder="请输入角色代码" prefix-icon="el-icon-search" v-model="role_id" class="marginbigright"></el-input>
                            角色名称
                            <el-input size="mini" placeholder="请输入角色名称" prefix-icon="el-icon-search" v-model="role_name" class="marginbigright"></el-input>
                            <el-button type="primary" @click="reset" class="resetbtn"><i class="icon iconfont icon-zhongzhi marginright"></i>重置</el-button>
                            <el-button type="primary" @click="searchBtn"><i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
                        </div>
                    </el-card>
                    <el-table stripe :data="data" border height="552" highlight-current-row @row-click="currentRowClick">
                        <el-table-column prop="roleName" label="角色代码" width="180"></el-table-column>
                        <el-table-column prop="chineseRoleName" label="角色名称"></el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]" :page-size="10" background layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                        </el-pagination>
                    </div>
                </el-aside>
                <el-main style="border: 1px solid #eee;background: #fff;margin-left: 10px;overflow: hidden;">
                    <div>
                        <el-card shadow="never" style="text-align: right;">
                            <el-button type="primary" @click="updateTree"><i class="icon iconfont icon-baocun marginright"></i>保存</el-button>
                        </el-card>
                    </div>
                    <el-tree ref="tree" style="height:91%;overflow-y: auto;" :data="treeData" check-strictly show-checkbox default-expand-all node-key="id"  highlight-current 
                    :props="defaultProps" :default-checked-keys="roleTreeData">
                    </el-tree>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
        loading:true,
        pagesize:"10",
        currentPage: 1,
        tableData:[],
        roleTreeData:[],
        role_id:'',
        role_name:'',
        treeData: [],
        currentRowRole:'',
        defaultProps: {
            children: 'children',
            label: 'name'
        }
        }
    },
    computed: {
        data() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pagesize,
                this.currentPage * this.pagesize
            );
        }
    },
    created() {
        this.getData();
        this.getTreeData();
        this.keyupSubmit();
    },
    methods: {
        //重置
        reset(){
            this.role_id = "";
            this.role_name = "";
            this.getData();
        },
        // 键盘enter事件
        keyupSubmit(){
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                  this.searchBtn();
                }
            }
        },
        //改变页面的条数
        handleSizeChange(size){
            this.pagesize = size;
        },
        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        searchBtn () {
            var params = {
                roleName: this.role_id,
                chineseRoleName: this.role_name
            };
            this.handleCurrentChange(1);
            this.$fetch("/management/roles/roleList", params).then(res => {
                this.tableData = res.datas.content;
            });
        },
        user_reset () {
            this.role_id = '';
            this.role_name = '';
        },
        //获取数据
        getData() {
            this.loading = true;
            this.$fetch('/management/roles/roleList').then((res) => {
                this.tableData = res.datas.content;
                this.loading = false;
            })
        },
        getTreeData(){
            this.loading = true;
            this.$fetch('/management/menus/menuForTree').then((res) => {
                this.treeData = res.page.content;
                this.loading = false;
            }) 
        },
        currentRowClick(row, event, column){
            this.currentRowRole = row.id;
            this.$fetch('/management/roleMenu/menuInfo/'+row.id).then((res) => {
                this.roleTreeData = res.datas;
                this.getTreeData();
                this.loading = false;
            }) 
        },
        updateTree(){
            if(!this.currentRowRole){
                this.$message.warning("请选择需要更新的角色!!");
                return;
            }
            let roleMenus = this.$refs.tree.getCheckedKeys(); 
            let params = [];
            for(var roleId of roleMenus){
                params.push(roleId);
                this.getParentNode(roleId,params);
            }
            //ES6的set数组去重
            params =  Array.from(new Set(params));
            var param = "";
            for(let releId of params){
                param += releId + ",";
            }
            param = param.substring(0,param.length-1);
            let url = "/management/roleMenu/update/"+this.currentRowRole;
            this.$postSimple(url, {roleMenus:param}).then((res) => {
                this.$message.success("操作成功!!");
            })
        },getParentNode(nodeId,params){//递归获取父节点
            let parentNode = this.$refs.tree.getNode(nodeId).parent.data;
            if(!parentNode.id){return  params;}
            params.push(parentNode.id);
            this.getParentNode(parentNode.id,params);
           
        }
    }
}
</script>
    <style lang="scss">
    .roleMenu.container{
        background-color: transparent;    
    }
    .roleMenu{
        .um-container .el-main {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            -ms-flex-preferred-size: auto;
            flex-basis: auto;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 0 0 0 5px;
        } 
        .header_container .el-main {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            -ms-flex-preferred-size: auto;
            flex-basis: auto;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 0 0 5px 3px;
        } 
        .um-input .el-input__inner{
            width:150px;
        }
        
        .main_container .el-header {
            /* background-color: #B3C0D1; */
            color: #333;
            padding:0!important;
        } 
        
        .el-input--mini {
            width: auto;
        }
        .el-card__body{
            padding:10px;
        }
        .el-card {
            background-color: transparent;
        }
    }
    
    </style>
    
    
    