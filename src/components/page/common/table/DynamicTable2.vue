<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <div v-if="showTable">
            <el-table class="max_height_390" :data="tableData" :span-method="objectSpanMethod" :show-summary="showSummary" border>
                <template v-for="(col, index) in tableColumns">
                    <el-table-column v-if="col.children" :prop="col.prop" :label="col.label" align="center">
                        <template v-for="(col2,index2) in col.children">
                            <el-table-column :key="index2" :prop="col2.prop" :label="col2.label" :sortable="col2.sortable" />
                        </template>
                    </el-table-column>
                    <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :sortable="col.sortable" min-width="100px">
                        <template slot="header" slot-scope="scope">
                            {{col.label}}
                            <el-row v-show="col.event" style="float: right;line-height:0;">
                                <el-button v-if="col.type == 'open'" @click="changeNode(scope.$index,col.type)" icon="el-icon-plus"></el-button>
                                <el-button v-if="col.type == 'close'" @click="changeNode(scope.$index,col.type)" icon='el-icon-minus'></el-button>
                            </el-row>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                params: '',
                title: '',
                widthData: '100%',
                showSummary: false,
                rowspanData: {},
                level: 1,
                url: "",
                sqlFlag: false,
                sql2: "",
                showTable: false,
                tableColumns: [],
                tableData: []
            };
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if (!newValue) { return; }
                this.params = newValue;
                this.loadTableHead(this.level);
                this.prop.params = "";
            }
        },
        created() {
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            this.showSummary = this.prop.config.showSummary;
            this.sql2 = this.prop.config.sql2;
            this.url = this.prop.config.url;
        },
        methods: {
            getParams(params) {
                if (!params || (!params.searchSelect && !params.searchDate)) { return ""; }
                let param = "";
                if (params.searchSelect) {
                    for (let obj of params.searchSelect) {
                        if (!obj.value || !obj.value.length) { continue; }
                        if (obj.type && obj.operation != 'in') {
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                        }
                        if (obj.type && obj.operation == 'in') {
                            if (!obj.value.length && !Array.isArray(obj.value)) { continue; }
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation;
                            let inValue = "";
                            for (let value of obj.value) {
                                if (!value) { continue; }
                                inValue += "'" + value + "',";
                            }
                            inValue = inValue.substring(0, inValue.length - 1);
                            if (inValue) {
                                param += " (" + inValue + ")";
                            }
                        }
                        //多sql情况下根据筛选器选择对应的sql
                        if (obj.tableField == "sqlFlag") {
                            //酸奶调拨【吨|件】切换
                            this.sqlFlag = obj.value == "sql2" ? true : false;
                        }
                    }
                }
                if (!params.searchDate) { return param }
                for (let obj of params.searchDate) {
                    if (!obj.value) { continue; }
                    param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                }
                return param;
            },
            loadReportData(level) {
                let sql = this.prop.sqls;
                if (!sql || !this.params) { return; }
                let param = this.getParams(this.params);
                if (this.sqlFlag && this.sql2) {
                    sql = this.sql2;
                }
                let groupby = sql.split("groupby")[1];
                if (groupby) {
                    sql = sql.split("groupby")[0];
                }
                if (param) { sql += param; }
                if (level == 2) {//下钻到品项时需要加上sku的查询字段
                    sql = sql.replace("psatm.orgn_name", "psatm.product_sku,psatm.orgn_name");
                    groupby = groupby.replace("psatm.orgn_name", "psatm.product_sku,psatm.orgn_name");
                }
                if (groupby) {
                    groupby = ' group by ' + groupby;
                    sql += groupby;
                }
                if (!sql || !this.url) { return; }
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
                    this.tableData = res.datas;
                    this.showTable = true;
                    this.loadTableHead(level, true);
                });
            },
            loadTableHead(level, flag) {//动态加载表头
                if (!flag) {
                    this.loadReportData(level);
                }
                let tableColumn = this.prop.config['items' + level];
                this.tableColumns = tableColumn.concat(this.prop.config.items);
                this.title = this.prop.config.title;
                this.level = level;
                this.getSpanArr(this.tableData, 0, this.prop.config.rowSpanField[0]);
                if (this.level == 3) {
                    this.getSpanArr(this.tableData, 0, this.prop.config.rowSpanField[0]);
                    this.getSpanArr(this.tableData, 1, this.prop.config.rowSpanField[1]);
                }
            },
            changeNode(index, type) {//下钻加载数据
                this.loading = true;
                this.showTable = false;
                if (index == 1 && this.level == 3 && type == 'close') {
                    this.loadTableHead(2);
                }
                if (index == 1 && this.level == 2 && type == 'open') {
                    this.loadTableHead(3);
                }
                if (index == 0 && type == 'close') {
                    this.loadTableHead(1);
                }
                if (index == 0 && type == 'open') {
                    this.loadTableHead(2);
                }
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {//动态合并行
                if (columnIndex === 0) {
                    let _row = this.rowspanData['spanArr' + columnIndex][rowIndex];
                    let _col = _row > 0 ? 1 : 0;
                    return { rowspan: _row, colspan: _col };
                }
            },
            getSpanArr(data, level, field) {//获取合并行数据
                let spanArr = [], pos = 0;
                for (var i = 0, j = data.length; i < j; i++) {
                    if (i == 0) {
                        spanArr.push(1);
                        pos = 0;
                    } else {
                        if (data[i][field] == data[i - 1][field]) {
                            spanArr[pos] += 1;
                            spanArr.push(0);
                        } else {
                            spanArr.push(1);
                            pos = i;
                        }
                    }
                }
                this.rowspanData['spanArr' + level] = spanArr;
            },
        }
    };
</script>
<style scoped>
    .el-row .el-button--small,
    .el-button--small.is-round {
        padding: 2px;
    }

    .head-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        color: #333333;
        vertical-align: none;
        line-height: 50px;
        text-transform: none;
        background: rgba(242, 242, 242, 1);
        padding-left: 15px;
        margin: 10px 0 10px 0;
    }

    .head-title p {
        display: inline-grid;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
        overflow: auto;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        margin-bottom: 20px
    }

    .max_height_390 {
        max-height: 460px;
        width: 100%;
    }

    .el-table {
        position: unset !important;
        overflow: auto !important;
    }

    .has-gutter .gutter {
        display: block !important;
    }
    .el-table::before {
        height: 0px
    }
</style>