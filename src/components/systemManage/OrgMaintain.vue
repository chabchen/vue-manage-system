 <!--
  @date:2018/07/04
  @author:ccf
  @modifyAuthor:
  @modifyDate:
  @describe:
 -->
 <template>
    <div class="orgMaintain container need_scroll">
        <div v-loading="loading">
            <el-container class="main_container">
                <el-container class="um-container" style=" border: 0px solid #eee">
                    <div style="width:30%;height:auto;display:inline-block;background-color: #fff;padding:10px;">
                        <el-header style="height: auto;margin-bottom:10px;">
                            <el-button type="primary" @click="getnew"><i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
                            <el-button type="primary" @click="openForm('new')"><i class="el-icon-plus marginright"></i>新增</el-button>
                            <el-button type="primary" @click="openForm('edit')"><i class="el-icon-edit marginright"></i>编辑</el-button>
                            <el-button type="primary" @click="deleteRows"><i class="el-icon-close marginright"></i>删除</el-button>
                        </el-header>
                        <el-aside style="width:100%;">
                            <el-tree style="height: 700px;" 
                            :data="treeData" 
                            show-checkbox 
                            node-key="id" 
                            check-on-click-node 
                            check-strictly 
                            @check="handleNodeClick" 
                            ref="tree" 
                            highlight-current 
                            :expand-on-click-node="false" 
                            :props="defaultProps">
                            </el-tree>
                        </el-aside>
                    </div>

                    <el-main class="organization" style="margin-left: 1%;border-left: 1px solid #eeeeee;width:68%;background-color:#fff;padding:10px;">
                        <el-form :inline="true" :model="orgForm" ref="orgForm" label-width="100px" class="orgForm">
                            <el-form-item label="公司代码">
                                <el-input disabled v-model="orgForm.companyCode"></el-input>
                            </el-form-item>
                            <el-form-item label="组织全称">
                                <el-input disabled v-model="orgForm.orgFullName"></el-input>
                            </el-form-item>
                            <el-form-item label="中文名称">
                                <el-input disabled v-model="orgForm.cnName"></el-input>
                            </el-form-item>
                            <el-form-item label="英文名称">
                                <el-input disabled v-model="orgForm.enName"></el-input>
                            </el-form-item>
                            <el-form-item label="组织代码">
                                <el-input disabled v-model="orgForm.orgCode"></el-input>
                            </el-form-item>
                            <el-form-item label="取号编码">
                                <el-input disabled v-model="orgForm.fetchNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="开始时间">
                                <el-input disabled v-model="orgForm.startDate"></el-input>
                            </el-form-item>
                            <el-form-item label="结束时间">
                                <el-input disabled v-model="orgForm.endDate"></el-input>
                            </el-form-item>
                            <el-form-item label="行政区域">
                                <el-input disabled v-model="orgForm.workLocation"></el-input>
                                <!-- <el-select disabled v-model="orgForm.workLocation" placeholder="">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select> -->
                            </el-form-item>
                            <el-form-item label="序号">
                                <el-input disabled v-model="orgForm.no"></el-input>
                            </el-form-item>
                            <el-form-item label="组织机构代码">
                                <el-select disabled v-model="orgForm.orgType" placeholder="">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input disabled type="textarea" v-model="orgForm.remark"></el-input>
                            </el-form-item>
                            <!-- 备用字段 -->
                            <el-form-item label="EBS组织Id">
                                <el-input disabled v-model="orgForm.attribute1"></el-input>
                            </el-form-item>
                            <el-form-item label="主体院标志">
                                <el-input disabled v-model="orgForm.attribute2"></el-input>
                            </el-form-item>
                            <el-form-item label="职能部门">
                                <el-input disabled v-model="orgForm.attribute3"></el-input>
                            </el-form-item>
                            <el-form-item label="属性4">
                                <el-input disabled v-model="orgForm.attribute4"></el-input>
                            </el-form-item>
                            <el-form-item label="属性5">
                                <el-input disabled v-model="orgForm.attribute5"></el-input>
                            </el-form-item>
                            <el-form-item label="属性6">
                                <el-input disabled v-model="orgForm.attribute6"></el-input>
                            </el-form-item>
                            <el-form-item label="属性7">
                                <el-input disabled v-model="orgForm.attribute7"></el-input>
                            </el-form-item>
                            <el-form-item label="属性8">
                                <el-input disabled v-model="orgForm.attribute8"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-main>
                </el-container>
            </el-container>

            <!-- 新增弹出框 -->
            <el-dialog :title=openFormTitle :visible.sync="openFormVisible" :close-on-click-modal="false" width="60%" class="dislogs">
                <el-form :inline="true" :rules="rules" ref="orgFormNew" :model="orgFormNew" label-width="107px">
                    <el-form-item label="公司代码" prop="companyCode">
                        <el-input v-model="orgFormNew.companyCode" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="组织全称" prop="orgFullName">
                        <el-input v-model="orgFormNew.orgFullName" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名称" prop="cnName">
                        <el-input v-model="orgFormNew.cnName" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名称" prop="enName">
                        <el-input v-model="orgFormNew.enName" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="组织代码" prop="orgCode">
                        <el-input v-model="orgFormNew.orgCode" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="组织机构代码">
                        <el-select v-model="orgFormNew.orgType" placeholder="" v-bind:disabled="isDisabled">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="取号编码" prop="fetchNumber">
                        <el-input v-model="orgFormNew.fetchNumber" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startDate">
                        <el-date-picker v-model="orgFormNew.startDate" type="date" placeholder="选择日期" class="mini" v-bind:disabled="isDisabled">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endDate">
                        <el-date-picker v-model="orgFormNew.endDate" type="date" placeholder="选择日期" class="mini" v-bind:disabled="isDisabled">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="行政区域" prop="workLocation">
                        <el-input v-model="orgFormNew.workLocation" v-bind:disabled="isDisabled"></el-input>
                        <!-- <el-select v-model="orgFormNew.workLocation" placeholder="">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select> -->
                    </el-form-item>
                    <el-form-item label="序号" prop="no">
                        <el-input v-model="orgFormNew.no" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="orgFormNew.remark" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <!-- 备用字段 -->
                    <el-form-item label="EBS组织Id" prop="attribute1">
                        <el-input v-model="orgFormNew.attribute1"></el-input>
                    </el-form-item>
                    <el-form-item label="主体院标志" prop="attribute2">
                        <el-input v-model="orgFormNew.attribute2"></el-input>
                    </el-form-item>
                    <el-form-item label="职能部门" prop="attribute3">
                        <el-input v-model="orgFormNew.attribute3"></el-input>
                    </el-form-item>
                    <el-form-item label="属性4" prop="attribute4">
                        <el-input v-model="orgFormNew.attribute4"></el-input>
                    </el-form-item>
                    <el-form-item label="属性5" prop="attribute5">
                        <el-input v-model="orgFormNew.attribute5"></el-input>
                    </el-form-item>
                    <el-form-item label="属性6" prop="attribute6">
                        <el-input v-model="orgFormNew.attribute6"></el-input>
                    </el-form-item>
                    <el-form-item label="属性7" prop="attribute7">
                        <el-input v-model="orgFormNew.attribute7"></el-input>
                    </el-form-item>
                    <el-form-item label="属性8" prop="attribute8">
                        <el-input v-model="orgFormNew.attribute8"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="orgFormNew = resetForm(orgFormNew)" class="resetbtn"><i class="icon iconfont icon-zhongzhi marginright"></i>重 置</el-button>
                    <el-button type="primary" @click="submitForm('orgFormNew')"><i class="icon iconfont icon-tijiao-fuben marginright"></i>提 交</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: true,
            orgForm: {},
            isDisabled: false,
            orgFormNew: {},
            rules: {
                // companyCode: [
                //    { required: true, message: '请输入公司代码', trigger: 'blur' }
                // ],
                orgFullName: [
                    {
                        required: true,
                        message: "请输入组织全称",
                        trigger: "blur"
                    }
                    //,{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                cnName: [
                    {
                        required: true,
                        message: "请输入中文名称",
                        trigger: "blur"
                    }
                ],
                orgCode: [
                    {
                        required: true,
                        message: "请输入组织代码",
                        trigger: "blur"
                    }
                ]
            },
            openFormVisible: false,
            openFormTitle: "新建",
            treeData: [],
            defaultProps: {
                children: "children",
                label: "cnName"
            }
        };
    },
    created() {
        this.getTreeData();
    },
    methods: {
        handleNodeClick(data , state) {
            this.$fetch(
                "management/organization/getOrgInfo/" + data.id + ""
            ).then(res => {
                this.orgForm = res.datas;
            });
        },
        //打开新建窗口
        openForm(flag) {
            if (flag == "new") {
                this.openFormVisible = true;
                this.openFormTitle = "新建";
                this.isDisabled = false;
                this.orgFormNew = this.resetForm(this.orgFormNew);
            } else {
                if (!this.orgForm.id) {
                    this.$message.warning("请选择一条记录!!");
                    return;
                }
                this.openFormVisible = true;
                this.openFormTitle = "编辑";
                this.orgFormNew = this.orgForm;
                if (this.orgForm.id < 0) {
                    this.isDisabled = true;
                } else {
                    this.isDisabled = false;
                }
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false;
                }
                let params = this.orgFormNew;
                let url = "/management/organization/addOrgInfo/";
                this.$post(url, params).then(res => {
                    this.$message.success("操作成功!!");
                    this.openFormVisible = false;
                    this.getTreeData();
                    this.orgFormNew = this.resetForm(this.orgFormNew);
                });
            });
        },
        resetForm(jsonData) {
            let data = {};
            for (let field in jsonData) {
                data[field] = "";
            }
            return data;
        },
        //刷新
        getnew() {
            this.getTreeData();
            this.orgForm = this.resetForm(this.orgForm);
        },
        //删除
        deleteRows() {
            if (!this.orgForm.id) {
                this.$message.warning("请选择一行记录!!");
                return;
            }
            if (this.orgForm.id < 0) {
                this.$message.warning("该数据不可删除!!");
                return;
            }
            this.$confirm("删除后将不可恢复，是否确认？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let url = "/management/organization/deleteOrg/";
                    this.$postSimple(url, { id: this.orgForm.id }).then(res => {
                        this.$message.success("操作成功!!");
                        this.getTreeData();
                        this.orgForm = this.resetForm(this.orgForm);
                    });
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        getTreeData() {
            let url = "/management/organization/getOrgsTree";
            this.$fetch(url).then(res => {
                this.treeData = res.datas;
                this.loading = false;
            });
        }
    }
};
</script>
<style lang="scss">
.syscode .grid-content.bg-purple-light,
.syscode .grid-content.bg-purple {
    -webkit-box-shadow: 0px 0px 0px #eee;
    box-shadow: 0px 0px 0px #eee;
}
.orgMaintain {
    .container {
        background-color: transparent;
    }
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
    .organization .el-form-item.el-form-item--small {
        width: 46%;
        min-width: 335px;
        .el-form-item__content {
            width: 70%;
            .el-select.el-select--small {
                width: 100%;
            }
        }
    }
    .dislogs {
        .el-form-item--small.el-form-item {
            width: 30%;
            min-width: 327px;
        }
        .el-input.el-input--small.el-input--suffix {
            width: 92%;
        }
        .el-textarea {
            width: 95%;
        }
    }
    .el-date-editor.mini.el-input.el-input--small.el-input--prefix.el-input--suffix.el-date-editor--date {
        width: 86%;
    }
}
</style>
    
    
    