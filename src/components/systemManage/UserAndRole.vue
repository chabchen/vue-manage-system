<template>
    <div class="user_role container need_scroll">
        <div class="row_btn">
            <el-button type="primary" @click="getnew"><i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
            <el-button type="primary" @click="newFrom"><i class="el-icon-plus marginright"></i>新增</el-button>
            <el-button type="primary" @click="editFrom"><i class="el-icon-edit marginright"></i>编辑</el-button>
            <el-button type="primary" @click="delAll"><i class="el-icon-close marginright"></i>删除</el-button>
            <el-button type="primary" @click="enableBtn" :disabled="enBtnFlag"><i class="icon iconfont icon-zanting marginright"></i>启用</el-button>
            <el-button type="primary" @click="disableBtn" :disabled="disBtnFlag"><i class="icon iconfont icon-tingyong marginright"></i>停用</el-button>
        </div>
        <template>
            <div class="demo-input-suffix" style="margin-bottom:10px;display: inline-block;">
                角色代码：
                <el-input size="mini" placeholder="请输入角色代码" prefix-icon="el-icon-search" v-model="user_role_Id" class="marginbigright"></el-input>
                角色名称：
                <el-input size="mini" placeholder="请输入角色名称" prefix-icon="el-icon-search" v-model="user_role_name" class="marginbigright"></el-input>
            </div>
            <div style="display: inline-block;margin-left:20px;">
                <el-button type="primary" @click="reset" class="resetbtn"><i class="icon iconfont icon-zhongzhi marginright"></i>重置</el-button>
                <el-button type="primary" @click="getData"><i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
            </div>
        </template>
        <div class="container" v-loading="loading">
            <el-table stripe ref="multipleTables" :row-class-name="handleSelectedBg" :data="data" border style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowclick">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="roleName" label="角色代码">
                </el-table-column>
                <el-table-column prop="chineseRoleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="enableFlag" :formatter="formatRole" label="状态">
                </el-table-column>
                <el-table-column prop="remark" label="说明">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" background layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新建" :visible.sync="newVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="form" :model="newform" label-width="70px">
                <el-form-item label="角色代码">
                    <el-input v-model="newform.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="newform.chineseRoleName"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="newform.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="newVisible = false"><i class="icon iconfont icon-quxiao marginright"></i>取消</el-button>
                <el-button type="primary" @click="newEdit"><i class="icon iconfont icon-baocun marginright"></i>确认</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="form" :model="editform" label-width="70px">
                <el-form-item label="角色代码">
                    <el-input v-model="editform.roleName"></el-input>
                </el-form-item>
                <el-form-item label="中文名称">
                    <el-input v-model="editform.chineseRoleName"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="editform.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="newVisible = false"><i class="icon iconfont icon-quxiao marginright"></i>取消</el-button>
                <el-button type="primary" @click="Editsub"><i class="icon iconfont icon-baocun marginright"></i>确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "userandrole",
    components: {},
    data() {
        return {
            editBtnFlag:true,
            deleteBtnFlag:true,
            name:'',
            enBtnFlag: true,
            disBtnFlag: true,
            loading: true,
            pagesize: "10",
            total: 0,
            currentPage: 1,
            user_role_Id: "",
            user_role_name: "",
            multipleSelection: [],
            tableData: [],
            newform: {
                remark: "",
                roleName: "",
                chineseRoleName: ""
            },
            editform: {
                remark: "",
                roleName: "",
                chineseRoleName: ""
            },
            newVisible: false,
            selectList: "",
            editVisible: false,
            //rowclick时候防止执行两次handleSelectionChange
            flag: true
        };
    },
    created() {
        this.getData();
        this.keyupSubmit();
    },
    methods: {
        //重置
        reset(){
            this.user_role_Id = "";
            this.user_role_name = "";
            this.getData();
        },
        // 键盘enter事件
        keyupSubmit(){
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                  this.getData()
                }
            }
        },

        handleSelectedBg({ row, rowIndex }) {
            if (this.multipleSelection.indexOf(row) != -1) {
                return "selected-row";
            }
            return "";
        },
        rowclick(row) {
            //rowclick时候防止执行两次handleSelectionChange
            this.flag = false;
            this.$refs.multipleTables.clearSelection();
            this.flag = true;
            this.$refs.multipleTables.toggleRowSelection(row);
        },
        //启用
        enableBtn() {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            let ids = "";

            this.multipleSelection.forEach(val => {
                if (val.enableFlag == 1) {
                    ids += val.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            this.$postSimple("management/roles/updateStatus", {
                roleIds: ids
            }).then(res => {
                this.$message({
                    type: "success",
                    message: "启用成功"
                });

                this.getData();
            });
        },
        //禁用
        disableBtn() {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            let ids = "";

            this.multipleSelection.forEach(val => {
                if (val.enableFlag == 0) {
                    ids += val.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            this.$postSimple("management/roles/updateStatus", {
                roleIds: ids
            }).then(res => {
                this.$message({
                    type: "success",
                    message: "禁用成功"
                });
                this.getData();
            });
        },

        formatRole: function(row, column) {
            return row.enableFlag == "0" ? "启用" : "停用";
        },
        newFrom() {
            this.newVisible = true;
        },
        //刷新
        getnew() {
            this.getData();
        },

        handleSelectionChange(val) {
            if (this.flag) {
                this.multipleSelection = val;
                if (val.length == 0) {
                    this.enBtnFlag = true;
                    this.disBtnFlag = true;
                } else {
                    if (val[val.length - 1].enableFlag == 0) {
                        this.enBtnFlag = true;
                        this.disBtnFlag = false;
                    } else {
                        this.enBtnFlag = false;
                        this.disBtnFlag = true;
                    }
                }
            }
        },
        //改变页面的条数
        handleSizeChange(size) {
            this.pagesize = size;
        },
        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        //获取数据
        getData() {
            var params = {
                roleName: this.user_role_Id,
                chineseRoleName: this.user_role_name
            };
            this.handleCurrentChange(1);
            this.$fetch("/management/roles/roleList", params).then(res => {
                this.tableData = res.datas.content;
                this.loading = false;
            });
        },
        //新建编辑
        newEdit() {
            var newParam = this.newform;
            let url = "management/roles/add";
            this.$post(url, newParam).then(res => {
                (this.newform.roleName = ""),
                    (this.newform.chineseRoleName = ""),
                    (this.newform.enableFlag = "0"),
                    (this.newform.remark = "");
                this.getData();
            });
            this.newVisible = false;
            this.$message.success(`新增一条数据`);
        },
        //编辑
        Editsub() {
            var editParam = this.editform;
            let url = "management/roles/update";
            this.$post(url, editParam).then(res => {
                (this.editform.id = ""),
                    (this.editform.roleName = ""),
                    (this.editform.chineseRoleName = ""),
                    (this.editform.enableFlag = "0"),
                    (this.editform.remark = "");
                this.getData();
            });
            this.editVisible = false;
            this.$message.success(`修改一条数据`);
        },
        editFrom(rows) {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            this.editform.remark = this.multipleSelection[length - 1].remark;
            this.editform.roleName = this.multipleSelection[
                length - 1
            ].roleName;
            this.editform.chineseRoleName = this.multipleSelection[
                length - 1
            ].chineseRoleName;
            this.editform.id = this.multipleSelection[length - 1].id;
            this.editVisible = true;
        },
        delAll() {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            let ids = "";
            for (let i = 0; i < length; i++) {
                ids += this.multipleSelection[i].id + ",";
            }
            ids = ids.substring(0, ids.length - 1);
            this.$postSimple("/management/roles/delete", { roleIds: ids }).then(
                res => {
                    this.getData();
                }
            );
        }
    },
    computed: {
        data() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pagesize,
                this.currentPage * this.pagesize
            );
        }
    }
};
</script>
<style lang='scss'>
.row_btn {
    margin-bottom: 20px;
}
.el-input--mini {
    width: auto;
}
.el-card__body {
    padding: 10px;
}
.el-main {
    padding: 0 0 5px 15px;
}
</style>

