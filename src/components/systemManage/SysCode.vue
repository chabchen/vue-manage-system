<!--
@date:2018年07月14日07:26:33
@author:zjj
-->
<template>
    <div class="syscode container need_scroll">
        <div class="row_btn" style="margin-bottom: 0px;">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getnew">
                            <i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
                        <el-button type="primary" @click="newSysCode">
                            <i class="el-icon-plus marginright"></i>新增</el-button>
                        <el-button type="primary" @click="editBtn">
                            <i class="el-icon-edit marginright"></i>编辑</el-button>
                        <el-button type="primary" @click="deleteRows">
                            <i class="el-icon-close marginright"></i>删除</el-button>
                        <el-button type="primary" @click="save">
                            <i class="icon iconfont icon-baocun marginright"></i>保存</el-button>
                        <el-button type="primary" @click="doEnable" ref="enableBtn" :disabled="enBtnFlag">
                            <i class="icon iconfont icon-zanting marginright"></i>启用</el-button>
                        <el-button type="primary" @click="doDisable" ref="disableBtn" :disabled="disBtnFlag">
                            <i class="icon iconfont icon-tingyong marginright"></i>停用</el-button>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <el-select v-model="value4" clearable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="value4" clearable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>

        </div>
        <el-tabs v-model="activeName" style="margin-bottom:10px;" @tab-click="handleClick">
            <el-tab-pane label="数据浏览" name="first">
                <el-card>
                    <div slot="header">
                        <span>系统代码类别</span>
                    </div>
                    <div>
                        <template>
                            <div class="demo-input-suffix" style="margin-bottom : 15px;">
                                代码类别中文名称：
                                <el-input size="mini" placeholder="请输入代码类别中文名称" prefix-icon="el-icon-search" v-model="searchConditions.categoryCnName" class="marginbigright"></el-input>
                                代码类别code：
                                <el-input size="mini" placeholder="请输入代码类别code" prefix-icon="el-icon-search" v-model="searchConditions.categoryCode" class="marginbigright"></el-input>
                                <el-button type="primary" @click="reset" class="resetbtn">
                                    <i class="icon iconfont icon-zhongzhi marginright"></i>重置</el-button>
                                <el-button type="primary" @click="doSearch">
                                    <i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
                            </div>
                        </template>
                        <div class="myTable" v-loading="loading">
                            <el-table stripe :data="tableData" height="200" border style="width: 100%" highlight-current-row ref="singleTable" @current-change="handleSelectionChange">
                                <el-table-column prop="categoryCnName" label="代码类别中文名称">
                                </el-table-column>
                                <el-table-column prop="categoryCode" label="代码类别code">
                                </el-table-column>
                                <el-table-column prop="categoryEnName" label="代码类别英文名称">
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="categoryListLength">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </el-card>

                <el-card style="margin-top:10px;">
                    <div slot="header">
                        <span>代码信息</span>
                    </div>
                    <div>
                        <template>
                            <div class="demo-input-suffix" style="margin-bottom : 15px;">
                                系统代码code：
                                <el-input size="mini" placeholder="请输入代码" prefix-icon="el-icon-search" v-model="sysCodeSearchConditions.code"></el-input>
                                代码中文名称：
                                <el-input size="mini" placeholder="请输入名称" prefix-icon="el-icon-search" v-model="sysCodeSearchConditions.codeCnName"></el-input>
                            </div>
                        </template>
                        <div class="myTable" v-loading="loading">
                            <el-table stripe :row-class-name="handleSelectedBg" :data="sysCodeTableDate" ref="multipleTable" height="200" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSysCodeSelect" @row-click="rowclick">
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column prop="code" label="系统代码code">
                                </el-table-column>
                                <el-table-column prop="codeCnName" label="代码中文名称">
                                </el-table-column>
                                <el-table-column prop="codeEnName" label="代码英文名称">
                                </el-table-column>
                                <el-table-column prop="remark" label="代码备注">
                                </el-table-column>
                                <el-table-column prop="enableFlag" :formatter="formatFlag" label="状态">
                                </el-table-column>
                                <el-table-column prop="startTime" label="代码有效开始时间">
                                </el-table-column>
                                <el-table-column prop="endTime" label="代码有效结束时间">
                                </el-table-column>
                                <el-table-column prop="sortNo" label="排序">
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="sysCodeListSearch.length">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </el-card>

            </el-tab-pane>
            <el-tab-pane label="数据编辑" name="second">

                <el-collapse v-model="activeNames">
                    <el-collapse-item title="代码信息" name="1" class="edit">
                        <el-form :rules="rules" :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="系统代码code" prop="code">
                                <el-input v-model="inputForm.code" :disabled="codeDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="代码中文名称" prop="codeCnName">
                                <el-input v-model="inputForm.codeCnName"></el-input>
                            </el-form-item>
                            <el-form-item label="代码英文名称" prop="codeEnName">
                                <el-input v-model="inputForm.codeEnName"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-form :rules="rules" :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="排序" prop="sortNo">
                                <el-input v-model="inputForm.sortNo"></el-input>
                            </el-form-item>
                            <el-form-item label="有效开始时间" prop="startTime">
                                <el-date-picker value-format="yyyy-MM-dd" v-model="inputForm.startTime" type="date" :picker-options="startTimePickerOptions" style="width:179px">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="有效结束时间" size="small">
                                <el-date-picker value-format="yyyy-MM-dd" v-model="inputForm.endTime" type="date" :picker-options="endTimePickerOptions" style="width:179px">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>

                        <el-form :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="代码备注">
                                <el-input v-model="inputForm.remark" style="width:461px"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="属性信息" name="2">
                        <el-form :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="属性1" prop="attribute1">
                                <el-input v-model="inputForm.attribute1"></el-input>
                            </el-form-item>
                            <el-form-item label="属性2" prop="attribute2">
                                <el-input v-model="inputForm.attribute2"></el-input>
                            </el-form-item>
                            <el-form-item label="属性3" prop="attribute3">
                                <el-input v-model="inputForm.attribute3"></el-input>
                            </el-form-item>

                        </el-form>
                        <el-form :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="属性4" prop="attribute4">
                                <el-input v-model="inputForm.attribute4"></el-input>
                            </el-form-item>
                            <el-form-item label="属性5" prop="attribute5">
                                <el-input v-model="inputForm.attribute5"></el-input>
                            </el-form-item>
                            <el-form-item label="属性6" prop="attribute6">
                                <el-input v-model="inputForm.attribute6"></el-input>
                            </el-form-item>

                        </el-form>
                        <el-form :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="属性7" prop="attribute7">
                                <el-input v-model="inputForm.attribute7"></el-input>
                            </el-form-item>
                            <el-form-item label="属性8" prop="attribute8">
                                <el-input v-model="inputForm.attribute8"></el-input>
                            </el-form-item>
                            <el-form-item label="属性9" prop="attribute9">
                                <el-input v-model="inputForm.attribute9"></el-input>
                            </el-form-item>

                        </el-form>
                        <el-form :model="inputForm" label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="true">
                            <el-form-item label="属性10" prop="attribute10">
                                <el-input v-model="inputForm.attribute10"></el-input>
                            </el-form-item>
                        </el-form>

                    </el-collapse-item>
                    <el-collapse-item title="关联代码信息" name="3">
                        <el-button v-show="codeDisabled" type="primary" @click="newChildBtn">
                            <i class="el-icon-plus marginright"></i>新增</el-button>
                        <el-button v-show="codeDisabled" type="primary" @click="deleteChildBtn">
                            <i class="el-icon-delete marginright"></i>删除</el-button>
                        <el-table :data="codeChildTableData" style="width: 100%" @selection-change="selectedChild">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="tmpSysCategory" label="代码类别code">
                            </el-table-column>
                            <el-table-column prop="categoryCnName" label="代码类别名称">
                            </el-table-column>
                            <el-table-column prop="tmpSysCategoryCode" label="代码">
                            </el-table-column>
                            <el-table-column prop="codeCnName" label="代码名称">
                            </el-table-column>
                        </el-table>

                        <el-dialog title="增加代码关联" :visible.sync="newChildDialog" width="50%" :close-on-click-modal="false">

                            <el-form label-width="120px" class="inputForm" v-bind:disabled="isDisabled" :inline="false">
                                <el-form-item label="代码类别">
                                    <el-select v-model="dialogCategory" value-key="id" filterable placeholder="请选择代码类别" @change="changeDiglogSysCode">
                                        <el-option v-for="item in dialogCategoryList" :key="item.id" :label="item.categoryCnName" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="系统代码">
                                    <el-select v-model="dialogSysCode" value-key="id" filterable placeholder="请选择系统代码" :disabled="dialogSysCodeDisabled">
                                        <el-option v-for="item in dialogSysCodeList" :key="item.id" :label="item.codeCnName" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>

                            <span slot="footer" class="dialog-footer">
                                <el-button @click="newChildDialog = false">
                                    <i class="icon iconfont icon-quxiao marginright"></i>取 消</el-button>
                                <el-button type="primary" @click="newChildDialogOkBtn">
                                    <i class="icon iconfont icon-tijiao-fuben marginright"></i>确 定</el-button>
                            </span>

                        </el-dialog>

                    </el-collapse-item>
                </el-collapse>

            </el-tab-pane>
        </el-tabs>

    </div>
</template>
    <script>
export default {
    components: {},
    data() {
        return {
            codeChildTableData: [],
            selectedChildList: [],

            //关联代码模态窗
            dialogCategory: {},

            dialogCategoryList: [],
            dialogSysCode: {},
            dialogSysCodeDisabled: true,
            dialogSysCodeList: [],

            newChildDialog: false,

            activeNames: ["1", "2", "3"],
            codeDisabled: false,

            isDisabled: false,
            options: [
                {
                    value: "选项1",
                    label: "公司1"
                },
                {
                    value: "选项2",
                    label: "公司2"
                },
                {
                    value: "选项3",
                    label: "公司3"
                },
                {
                    value: "选项4",
                    label: "公司4"
                },
                {
                    value: "选项5",
                    label: "公司5"
                }
            ],
            value4: "",

            categoryIds: "",
            sysCodeSearchConditions: {
                code: "",
                codeCnName: "",
                codeEnName: ""
            },

            enBtnFlag: true,
            disBtnFlag: true,

            //当前显示的tab
            activeName: "first",

            loading: true,
            name: "",

            // total: 0,
            //第一个表格分页用的参数
            pagesize: 10,
            currentPage: 1,
            categoryListLength: 1,
            //第二个表格分页用的参数
            pagesize1: "10",
            currentPage1: 1,

            searchConditions: {
                categoryCnName: "",
                categoryCode: ""
            },

            tableData: [],

            sysCodeList: [],

            currentSelection: null,

            sysCodeId: "",
            sysCodeId2: "",

            //页面输入框展示的内容
            inputForm: {},

            startTimePickerOptions: {
                disabledDate: time => {
                    return (
                        time.getTime() >
                        new Date(this.inputForm.endTime).getTime()
                    );
                }
            },

            endTimePickerOptions: {
                disabledDate: time => {
                    return (
                        time.getTime() <
                        new Date(this.inputForm.startTime).getTime()
                    );
                }
            },

            rules: {
                code: [
                    {
                        required: true,
                        message: "请输入系统代码code",
                        trigger: "blur"
                    }
                ],
                codeCnName: [
                    {
                        required: true,
                        message: "请输入代码中文名称",
                        trigger: "blur"
                    }
                ],
                startTime: [
                    {
                        required: true,
                        message: "请输入有效时间",
                        trigger: "blur"
                    }
                ]
            },

            editForm: {
                // categoryCnName: "",
                // categoryCode: "",
                // categoryEnName: ""
            },

            selectList: [],

            operateType: "none", //用来标识数据编辑页面的状态
            flag: true
        };
    },
    created() {
        this.getData();
        this.keyupSubmit();
    },
    methods: {
        // 键盘enter事件
        keyupSubmit() {
            document.onkeydown = e => {
                if (window.event) {
                    let _key = window.event.keyCode;
                    if (_key === 13) {
                        this.doSearch();
                    }
                }
            };
        },
        handleSelectedBg({ row, rowIndex }) {
            if (this.selectList.indexOf(row) != -1) {
                return "selected-row";
            }
            return "";
        },
        deleteChildBtn() {
            this.selectedChildList.forEach(item => {
                var index = this.indexOf(this.codeChildTableData, item);
                this.codeChildTableData.splice(index, 1);
            });
        },

        indexOf(arr, item) {
            var index = -1; // 先定义一个下标
            arr.forEach(function(res, i) {
                // 元素  下标
                if (res === item && index === -1) {
                    index = i;
                }
            });
            return index;
        },

        selectedChild(val) {
            this.selectedChildList = val;
        },

        newChildDialogOkBtn() {
            if (JSON.stringify(this.dialogSysCode) == "{}") {
                this.$message({
                    message: "请选择关联代码后再确定",
                    type: "warning"
                });
            } else {
                var val = {
                    tmpSysCategory: this.dialogCategory.categoryCode,
                    categoryCnName: this.dialogCategory.categoryCnName,
                    tmpSysCategoryCode: this.dialogSysCode.code,
                    codeCnName: this.dialogSysCode.codeCnName
                };

                var index = JSON.stringify(this.codeChildTableData).indexOf(
                    JSON.stringify(val)
                );

                if (index == -1) {
                    this.codeChildTableData.push(val);
                    this.newChildDialog = false;
                } else {
                    this.$message({
                        message: "此代码已经关联，请不要重复选择！",
                        type: "warning"
                    });
                }
            }
        },
        changeDiglogSysCode() {
            this.dialogSysCodeDisabled = false;

            let url = "management/sysCode/querySysCodeList";
            this.$fetch(url, { categoryId: this.dialogCategory.id }).then(
                res => {
                    this.dialogSysCodeList = res.page.content;
                }
            );
        },

        newChildBtn() {
            this.dialogCategory = {};
            this.dialogCategoryList = [];
            this.dialogSysCode = {};
            this.dialogSysCodeDisabled = true;
            this.dialogSysCodeList = [];
            this.dialogCategoryList = this.tableData;
            this.newChildDialog = true;
        },
        reset() {
            this.searchConditions.categoryCnName = "";
            this.searchConditions.categoryCode = "";
        },
        handleClick(tab) {
            if (tab.name == "second" && this.inputForm.categoryId == "") {
                this.isDisabled = true;
            }
        },
        doSysCodeSearch() {},
        formatFlag: function(row, column) {
            return row.enableFlag == "0" ? "启用" : "停用";
        },
        //第一个表格分页的方法
        //改变页面的条数
        handleSizeChange(size) {
            this.pagesize = size;
            this.getData();
        },

        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        //第二个表格分页的方法
        //改变页面的条数
        handleSizeChange1(size) {
            this.pagesize1 = size;
        },

        // 分页导航
        handleCurrentChange1(val) {
            this.currentPage1 = val;
        },
        //保存编辑
        save() {
            if (
                this.inputForm.code.trim() == "" ||
                this.inputForm.codeCnName.trim() == "" ||
                // this.inputForm.codeEnName.trim() == "" ||
                this.inputForm.startTime == "" ||
                this.inputForm.startTime == null
            ) {
            } else {
                // var param;
                var param = this.inputForm;

                this.categoryIds = this.inputForm.categoryId;
                let url = "management/sysCode/saveSysCode";
                if (this.operateType == "new") {
                    this.$post(url, param).then(res => {
                        this.$message({
                            type: "success",
                            message: "新增成功!"
                        });

                        this.getSysCodeListByCategoryID(
                            this.inputForm.categoryId
                        );
                        this.submit();
                        this.inputForm = {};
                        this.inputForm.categoryId = this.categoryIds;
                        // this.operateType = "newDone";
                    });
                } else if (this.operateType == "edit") {
                    param.id =
                        this.sysCodeId == "" ? this.sysCodeId2 : this.sysCodeId;
                    this.$post(url, param).then(res => {
                        this.$message({
                            type: "success",
                            message: "保存成功!"
                        });
                        this.submit();
                        this.sysCodeId2 = param.id;

                        this.getSysCodeListByCategoryID(
                            this.inputForm.categoryId
                        );
                    });
                }
            }
        },

        //提交关联代码的信息
        submit() {
            var param2 = [];
            this.codeChildTableData.forEach(ele => {
                var val = {
                    code: this.inputForm.code,
                    categoryCode: this.currentSelection.categoryCode,
                    sortNo: 0,
                    tmpSysCategory: ele.tmpSysCategory,
                    tmpSysCategoryCode: ele.tmpSysCategoryCode
                };
                param2.push(val);
            });

            if (param2.length == 0) {
                this.$postSimple("management/sysCode/delAllCategoryCodeChild", {
                    categoryCode: this.currentSelection.categoryCode,
                    code: this.inputForm.code
                });
            } else {
                let url3 = "management/sysCode/saveCategoryCodeChild";
                this.$post(url3, param2).then(res => {});
            }
        },
        //删除
        deleteRows() {
            if (this.selectList.length == 0) {
                this.$message.error("请选择一条记录删除！");
            } else {
                this.$confirm("此操作将永久删除该代码类别, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        var ids = "";
                        var categoryId = this.selectList[0].categoryId;
                        this.selectList.forEach(value => {
                            ids += value.id + ",";
                        });
                        ids = ids.substring(0, ids.length - 1);
                        let url = "management/sysCode/delSysCode";
                        var param = { ids: ids };
                        this.$postSimple(url, param).then(res => {
                            this.getSysCodeListByCategoryID(categoryId);
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            }
        },

        //点击选择
        rowclick(row, event) {
            this.flag = false;
            this.$refs.multipleTable.clearSelection();
            this.flag = true;
            this.$refs.multipleTable.toggleRowSelection(row);
        },

        //新增一个系统代码
        newSysCode() {
            if (this.inputForm.categoryId == "") {
                this.$message({
                    type: "error",
                    message: "请先选择一个系统代码类别"
                });
            } else {
                this.isDisabled = false;
                this.codeDisabled = false;
                this.activeName = "second";
                this.operateType = "new";
                var temp = this.inputForm.categoryId;
                this.inputForm = {};
                this.inputForm.categoryId = temp;
                this.codeChildTableData = [];
            }
        },

        editBtn() {
            if (this.sysCodeId == "") {
                this.$message({
                    type: "error",
                    message: "请先选择一个系统代码"
                });
            } else {
                this.querySysCodeDetail();
                this.activeName = "second";
                this.codeDisabled = true;
                this.isDisabled = false;
                this.operateType = "edit";
            }
        },

        querySysCodeDetail() {
            let url = "management/sysCode/querySysCode";
            this.$fetch(url, {
                id: this.sysCodeId
            }).then(res => {
                this.inputForm = res.datas;
                //查询关联代码，转化结果到table
                let url1 = "management/sysCode/queryCategoryCodeChild";
                this.$fetch(url1, {
                    code: this.inputForm.code,
                    categoryCode: this.currentSelection.categoryCode
                }).then(res => {
                    var list = res.datas;
                    this.codeChildTableData = [];
                    list.forEach(ele => {
                        var tableEle = {
                            tmpSysCategory: ele.sysCategory.categoryCode,
                            categoryCnName: ele.sysCategory.categoryCnName,
                            tmpSysCategoryCode: ele.sysCategoryCode.code,
                            codeCnName: ele.sysCategoryCode.codeCnName
                        };
                        this.codeChildTableData.push(tableEle);
                    });
                });
            });
        },

        handleSysCodeSelect(val) {
            if (this.flag) {
                this.selectList = val;

                if (val.length != 0) {
                    this.sysCodeId = val[val.length - 1].id;

                    if (val[val.length - 1].enableFlag == 0) {
                        this.enBtnFlag = true;
                        this.disBtnFlag = false;
                    } else {
                        this.enBtnFlag = false;
                        this.disBtnFlag = true;
                    }
                } else {
                    this.sysCodeId = "";
                    this.enBtnFlag = true;
                    this.disBtnFlag = true;
                }
                if (this.sysCodeId != "") {
                    this.querySysCodeDetail();
                    this.codeDisabled = false;
                    this.isDisabled = true;
                }
            }
        },
        //启用
        doEnable() {
            let ids = "";
            this.selectList.forEach(sysCode => {
                if (sysCode.enableFlag == 1) {
                    ids += sysCode.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            if (ids.length == 0) {
                this.$message({
                    message: "选中的代码类别无可启用项",
                    type: "info"
                });
            } else {
                let url = "management/sysCode/doCodeEnableFlag";
                this.$postSimple(url, { ids: ids }).then(res => {
                    this.$message({
                        type: "success",
                        message: "启用成功"
                    });
                    this.getSysCodeListByCategoryID(this.inputForm.categoryId);
                });
            }
        },
        //停用
        doDisable() {
            let ids = "";
            this.selectList.forEach(sysCode => {
                if (sysCode.enableFlag == 0) {
                    ids += sysCode.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            if (ids.length == 0) {
                this.$message({
                    message: "选中的代码类别无可停用项",
                    type: "info"
                });
            } else {
                let url = "management/sysCode/doCodeEnableFlag";
                this.$postSimple(url, { ids: ids }).then(res => {
                    this.$message({
                        type: "success",
                        message: "停用成功"
                    });
                    this.getSysCodeListByCategoryID(this.inputForm.categoryId);
                });
            }
        },

        //刷新
        getnew() {
            this.sysCodeList = [];

            (this.inputForm = {
                categoryId: "",
                code: "",
                codeCnName: "",
                codeEnName: "",
                remark: "",
                date: ""
            }),
                (this.searchConditions.categoryCnName = "");
            this.searchConditions.categoryCode = "";
            this.getData();
        },

        handleSelectionChange(val) {
            this.currentSelection = val;
            //根据选择的类别获取子集
            this.getSysCodeListByCategoryID(this.currentSelection.id);
            this.inputForm.categoryId = this.currentSelection.id;
        },

        //根据选择的类别获取子集
        getSysCodeListByCategoryID(id) {
            let url = "management/sysCode/querySysCodeList";
            this.$fetch(url, { categoryId: id }).then(res => {
                this.sysCodeList = res.page.content;
            });
        },

        //真分页获取代码类别数据
        getData() {
            this.tableData = [];

            var param = {
                categoryCode: this.searchConditions.categoryCode,
                categoryCnName: this.searchConditions.categoryCnName,
                pageNo: this.currentPage,
                pageSize: this.pagesize
            };

            this.$fetch("management/sysCode/queryCategoryList", param).then(
                res => {
                    this.tableData = res.page.content;
                    this.categoryListLength = res.page.totalElements;
                    this.loading = false;
                }
            );
        },

        //查询数据
        doSearch() {
            this.currentPage = 1;
            this.getData();
        }
    },
    computed: {
        sysCodeTableDate() {
            var resultList = this.sysCodeListSearch.slice(
                (this.currentPage1 - 1) * this.pagesize1,
                this.currentPage1 * this.pagesize1
            );

            return resultList;
        },

        sysCodeListSearch() {
            var list = [];
            this.sysCodeList.forEach(sysCode => {
                if (
                    sysCode.code.includes(this.sysCodeSearchConditions.code) &&
                    sysCode.codeCnName.includes(
                        this.sysCodeSearchConditions.codeCnName
                    ) &&
                    (sysCode.codeEnName == null ||
                        sysCode.codeEnName.includes(
                            this.sysCodeSearchConditions.codeEnName
                        ))
                ) {
                    list.push(sysCode);
                }
            });
            return list;
        }
    }
};
</script>
    <style lang="scss">
.syscode {
    .edit {
        .el-input--small .el-input__inner {
            width: 179px;
        }
    }
    .el-form-item {
        margin-bottom: 15px;
    }
    .el-input--mini {
        width: auto;
    }

    .inputForm {
        width: 100%;
    }

    .myTable {
        .el-table__header {
            width: 100% !important;
        }

        .el-table__body {
            width: 100% !important;
        }
    }

    .el-card {
        background-color: #fff;
        color: #303133;
    }
    .grid-content.bg-purple-light,
    .grid-content.bg-purple {
        border: 0px solid #eee;
        box-shadow: 0px 0px 0px #eee;
    }
    .el-card__header {
        padding: 8px 6px;
        font-weight: 600;
    }
}
.el-select-dropdown__item.selected {
    color: black;
    font-weight: 400;
}
</style>
    
    