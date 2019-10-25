<template>
    <div :style="{width:widthData}" class="line-box">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <el-table class="max_height_390" :data="tableData" :span-method="objectSpanMethod" :show-summary="showSummary" border>
            <template v-for="(col, index) in tableColumns" >
                <el-table-column v-if = "col.children" :prop="col.prop" :label="col.label" >
                    <template v-for="(col2,index2) in col.children">
                        <el-table-column :key="index2" :prop="col2.prop" :label="col2.label" :sortable = "col2.sortable"/>
                    </template>    
                </el-table-column>
                <el-table-column v-else  :key="index" :prop="col.prop" :label="col.label" :sortable = "col.sortable">    
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
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                params: '',
                title:'',
                widthData: '100%',
                showSummary: false,
                rowspanData: {},
                level: 1,
                tableColumns: [],
                tableData1: [{
                    id: '液态奶事业部',
                    name: '王小虎',
                    amount1: '234',
                    amount2: '3.2',
                    amount3: 10,
                    level: 1,
                }, {
                    id: '奶粉事业部',
                    name: '王小虎',
                    amount1: '165',
                    amount2: '4.43',
                    amount3: 12,
                    level: 1,
                }, {
                    id: '冷饮事业部',
                    name: '王小虎',
                    amount1: '324',
                    amount2: '1.9',
                    amount3: 9,
                    level: 1,
                }, {
                    id: '健康饮品事业部',
                    name: '王小虎',
                    amount1: '621',
                    amount2: '2.2',
                    amount3: 17,
                    level: 1,
                }, {
                    id: '奶酪事业部',
                    name: '王小虎',
                    amount1: '539',
                    amount2: '4.1',
                    amount3: 15,
                    level: 1,
                }],
                tableData2: [
                    {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 2,
                    }, {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌2',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 2,
                    }, {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌3',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 2,
                    }, {
                        id: '奶粉事业部',
                        id2: '奶粉事业部--子品牌',
                        name: '王小虎',
                        amount1: '165',
                        amount2: '4.43',
                        amount3: 12,
                        level: 2,

                    }, {
                        id: '奶粉事业部',
                        id2: '奶粉事业部--子品牌2',
                        name: '王小虎',
                        amount1: '165',
                        amount2: '4.43',
                        amount3: 12,
                        level: 2,
                    }, {
                        id: '冷饮事业部',
                        id2: '冷饮事业部--子品牌',
                        name: '王小虎',
                        amount1: '324',
                        amount2: '1.9',
                        amount3: 9,
                        level: 2,
                    }, {
                        id: '健康饮品事业部',
                        id2: '健康饮品事业部--子品牌2',
                        name: '王小虎',
                        amount1: '621',
                        amount2: '2.2',
                        amount3: 17,
                        level: 2,
                    }, {
                        id: '奶酪事业部',
                        id2: '奶酪事业部--子品牌',
                        name: '王小虎',
                        amount1: '539',
                        amount2: '4.1',
                        amount3: 15,
                        level: 2,
                    }, {
                        id: '冷饮事业部',
                        id2: '冷饮事业部--子品牌2',
                        name: '王小虎',
                        amount1: '324',
                        amount2: '1.9',
                        amount3: 9,
                        level: 2,
                    }, {
                        id: '健康饮品事业部',
                        id2: '健康饮品事业部--子品牌',
                        name: '王小虎',
                        amount1: '621',
                        amount2: '2.2',
                        amount3: 17,
                        level: 2,
                    }, {
                        id: '奶酪事业部',
                        id2: '奶酪事业部--子品牌2',
                        name: '王小虎',
                        amount1: '539',
                        amount2: '4.1',
                        amount3: 15,
                        level: 2,
                    }
                ],
                tableData3: [
                    {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌',
                        id3: '液态奶事业部--子品牌--SKU',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    },
                    {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌',
                        id3: '液态奶事业部--子品牌--SKU2',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    },
                    {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌',
                        id3: '液态奶事业部--子品牌--SKU3',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    }
                    , {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌2',
                        id3: '液态奶事业部--子品牌2--SKU',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    }
                    , {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌2',
                        id3: '液态奶事业部--子品牌2--SKU2',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    }, {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌2',
                        id3: '液态奶事业部--子品牌2--SKU3',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    }, {
                        id: '液态奶事业部',
                        id2: '液态奶事业部--子品牌3',
                        id3: '液态奶事业部--子品牌3--SKU',
                        name: '王小虎',
                        amount1: '234',
                        amount2: '3.2',
                        amount3: 10,
                        level: 3,
                    }, {
                        id: '奶粉事业部',
                        id2: '奶粉事业部--子品牌',
                        id3: '奶粉事业部--子品牌--SKU',
                        name: '王小虎',
                        amount1: '165',
                        amount2: '4.43',
                        amount3: 12,
                        level: 3,

                    }, {
                        id: '奶粉事业部',
                        id2: '奶粉事业部--子品牌2',
                        id3: '奶粉事业部--子品牌2--SKU',
                        name: '王小虎',
                        amount1: '165',
                        amount2: '4.43',
                        amount3: 12,
                        level: 3,
                    }
                ],
                
            };
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if(!newValue){return;}
                this.params = newValue;
                this.loadReportData(this.level);
                this.prop.params = "";
            }
        },
        created() {
            if(this.prop.config.widthData){
                this.widthData = this.prop.config.widthData;
            }
            this.showSummary = this.prop.config.showSummary;
            this.loadTableHead(this.prop.config.level);
        },
        methods: {

            loadReportData(level) {
                let sql = this.prop.sqls;
                // for (let obj of params.searchSelect) {
                //     if (!obj.value) { continue; }
                //     if (obj.operation != 'in') {
                //         sql += " " + obj.type + " " + obj.tableField + " = '" + obj.value + "'";
                //     }
                // }
                // if (groupby) {
                //     groupby = ' group by ' + groupby;
                //     sql += groupby;
                // }
                // this.$requestData('/report/list', 'post', { params: sql }).then(res => {
                //     this.tableData = res.datas;
                // });
            },
            loadTableHead(level) {//动态加载表头
                let tableColumn = this.prop.config['items' + level];
                this.tableColumns = tableColumn.concat(this.prop.config.items);
                this.title = this.prop.config.title;
                this.level = level;
                this.tableData = this['tableData' + level];
                if (this.level == 2) {
                    this.getSpanArr(this.tableData, 0, this.prop.config.rowSpanField[0]);
                } else if (this.level == 3) {
                    this.getSpanArr(this.tableData, 0, this.prop.config.rowSpanField[0]);
                    this.getSpanArr(this.tableData, 1, this.prop.config.rowSpanField[1]);
                }
                this.loadReportData(level);
            },
            changeNode(index, type) {//下钻加载数据
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
        background: #409eff;
        color: #fff;
        padding-left: 15px;
        margin: 10px 0 10px 0;
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
    .max_height_390{
        max-height: 390px;
    }
    .el-table{
        position: unset !important;
        overflow: auto !important;
    }
</style>