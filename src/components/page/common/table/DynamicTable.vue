<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <div style="overflow: auto;" v-if="showTable">
            <el-table :data="tableData" :span-method="objectSpanMethod" :show-summary="showSummary" border :max-height="maxHeight">
                <template v-for="(col, index) in tableColumns">
                    <el-table-column v-if="col.children" :prop="col.prop" :label="col.label">
                        <template v-for="(col2,index2) in col.children">
                            <el-table-column :key="index2" :prop="col2.prop" :label="col2.label" :sortable="col2.sortable" />
                        </template>
                    </el-table-column>
                    <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :sortable="col.sortable" min-width="100px" show-overflow-tooltip>
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
                extendParam: '',
                title: '',
                widthData: '100%',
                maxHeight: "350",
                showTable: false,
                showSummary: false,
                rowspanData: {},
                level: 1,
                url: "",
                sqlFlag: false,
                fieldFlag: "",//用于维度切换
                sql2: "",
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
            
            this.showSummary = this.prop.config.showSummary;
            this.sql2 = this.prop.config.sql2;
            this.url = this.prop.config.url;
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            if (this.prop.config.maxHeight) {
                this.maxHeight = this.prop.config.maxHeight;
            }
        },
        methods: {
            getSqlFlag(params) { //根据维度切换对应的sql
                if (!params || (!params.searchDate && params.searchSelect)) { return; }
                if (params.searchSelect) {
                    for (let obj of params.searchSelect) {
                        if (obj.tableField != "sqlFlag") { continue; }
                        this.sqlFlag = obj.value == "sql2" ? true : false;
                    }
                }
                if (!params.searchDate) { return; }
                for (let obj of params.searchDate) {
                    if (!obj.dataShow) { continue; }
                    if (this.fieldFlag && this.fieldFlag != obj.tableField) {
                        this.sqlFlag = !this.sqlFlag;
                    }
                    this.fieldFlag = obj.tableField;
                }
            },
            dynamicGroupBy(sql, level) {
                if (level == 1) {
                    sql = sql.replace("groupby", "group by");
                    sql = sql.replace("groupby", "group by");
                    sql = sql.replace("orderby", "order by");
                    return sql;
                }
                let selectArr = sql.split("select");
                sql = selectArr[0] + "select";
                for (let i = 1, j = selectArr.length; i < j; i++) {
                    sql += this.setRowSpanField(level, selectArr[i]);
                    if (i < selectArr.length - 1) {
                        sql += "select";
                    }
                }

                let groupbyArr = sql.split("groupby");
                let newSql = groupbyArr[0] + " group by ";
                for (let i = 1, j = groupbyArr.length; i < j; i++) {
                    newSql += this.setRowSpanField(level, groupbyArr[i]);
                    if (i < groupbyArr.length - 1) {
                        newSql += "group by";
                    }
                }
                let arr2 = newSql.split("orderby");
                let mainFields = this.prop.config.mainField;
                let field1 = mainFields[1];
                let field2 = mainFields[2];
                if (sql.indexOf("temp_table") > -1) {
                    if (level == 2) {
                        newSql = arr2[0] + "and " + field1 + " = temp_table." + field1.split(".")[1] + " order by" + this.setRowSpanField(level, arr2[1]);
                    } else {
                        newSql = arr2[0] + "and " + field2 + " = temp_table." + field2.split(".")[1] + " order by" + this.setRowSpanField(level, arr2[1]);
                    }
                }else{
                    newSql = arr2[0] + " order by " + this.setRowSpanField(level, arr2[1]);
                }

                return newSql;
            },
            loadReportData(level) {
                let sql = this.prop.sqls;
                let limitFields = this.prop.config.limitFields;
                let lastDateFlag = this.prop.config.lastDateFlag;
                if (!sql || !this.url) { this.loading = false; return; }
                this.getSqlFlag(this.params);
                if (this.sqlFlag && this.sql2) { sql = this.sql2; }
                sql = this.dynamicGroupBy(sql, level);
                sql = this.$setParams(sql, this.params, limitFields, lastDateFlag);
                this.loading = true;
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.showTable = true;
                    this.loading = false;
                    if (!res.datas) { return; }
                    for (let obj of res.datas) {
                        obj.level = level;
                    }
                    this.tableData = res.datas;
                    this.loadTableHead(level, true);
                }).catch(() => {
                    this.showTable = true;
                    this.loading = false;
                });
            },
            setRowSpanField(level, str) {
                if (!str) { return; }
                let mainFields = this.prop.config.mainField;
                if (!mainFields.length || level == 1) { return str; }
                let field1 = mainFields[0];
                if (str.indexOf(field1) == -1) { return str; }
                let field2 = mainFields[1];
                if (field2 && level == 2) { str = str.replace(field1, field1 + "," + field2); }
                let field3 = mainFields[2];
                if (field2 && field3 && level == 3) { str = str.replace(field1, field1 + "," + field2 + "," + field3); }
                return str;
            },
            loadTableHead(level, flag) {//动态加载表头
                let tableColumn = this.prop.config['items' + level];
                this.tableColumns = tableColumn.concat(this.prop.config.items);
                this.title = this.prop.config.title;
                this.level = level;
                if (this.level == 2) {
                    this.getSpanArr(this.tableData, 0, this.prop.config.rowSpanField[0]);
                } else if (this.level == 3) {
                    this.getSpanArr(this.tableData, 0, this.prop.config.rowSpanField[0]);
                    this.getSpanArr(this.tableData, 1, this.prop.config.rowSpanField[1]);
                }
                if (!flag) {
                    this.loadReportData(level);
                }
            },
            changeNode(index, type) {//下钻加载数据
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
                if(this.prop.config.noSpan){return ;}
                if (row.level > 1 && columnIndex === 0) {
                    let _row = this.rowspanData['spanArr' + columnIndex][rowIndex];
                    let _col = _row > 0 ? 1 : 0;
                    return { rowspan: _row, colspan: _col };
                }
                if (row.level > 2 && columnIndex === 1) {
                    let _row = this.rowspanData['spanArr' + columnIndex][rowIndex];
                    let _col = _row > 0 ? 1 : 0;
                    return { rowspan: _row, colspan: _col };
                }
            },
            getSpanArr(data, level, field) {//获取合并行数据
                if(this.prop.config.noSpan){return ;}
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
        line-height: 36px;
        text-transform: none;
        background: rgba(242, 242, 242, 1);
        padding-left: 15px;
        margin: 10px 0 3px 0;
    }

    .head-title p {
        display: inline-grid;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
    }

    .el-table {
        position: unset !important;
    }

    .el-button {
        padding: 0 !important;
    }
</style>