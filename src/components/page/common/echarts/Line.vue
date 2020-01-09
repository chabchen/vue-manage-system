<template>
    <div :style="{width:widthData}" class="line-box">
        <div class="echart-ex1">
            <div v-if="selectData.title" class="head-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="line-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" @change="changeSelect" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div v-show="!nodataFlag">
                <lineChart :app="appUrl" :prop="{option:chartOption}" />
            </div>
            <div v-show="nodataFlag">
                <nodata/>
            </div>
        </div>
    </div>
</template>
<script>
    import nodata from '../nodata.vue'
    import lineChart from './LineChart.vue'
    export default {
        components: { lineChart, nodata },
        props: { prop: Object },
        data() {
            return {
                selectData: {},
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                myChart: '',
                loading: false,
                widthData: '100%',
                heightData: '350px',
                params: '',
                dataSource: "",
                iconFlag: false,
                sqlFlag: false,
                fieldFlag: "",
                nodataFlag: false,
                appUrl: "",
                chartOption: "",
                datas: [],
            }
        },
        created() {
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            this.url = this.prop.config.url;
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            if (this.prop.config.heightData) {
                this.heightData = this.prop.config.heightData;
            }
            //this.initLineCharts();
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
                this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {
            getSqlFlag(params, sql) { //根据维度切换对应的sql
                if (!params || !params.searchDate) { return; }
                for (let obj of params.searchDate) {
                    if (!obj.dataShow) { continue; }
                    if (this.fieldFlag && this.fieldFlag != obj.tableField) {
                        this.sqlFlag = !this.sqlFlag;
                    }
                    this.fieldFlag = obj.tableField;
                    this.dateData = obj.value;
                }
            },
            loadReportData(params) {
                this.iconFlag = false;
                this.loading = true;
                this.nodataFlag = false;
                let sql = this.prop.sqls;
                let url = this.prop.config.url;
                if (!sql || !url || !this.params) { this.loading = false; return; }
                sql = this.$getParam(sql, this.params);
                this.chartData.rows = [];
                this.$requestData(url, 'post', { params: sql, dataSource: this.dataSource }).then(res => {
                    this.loading = false;
                    if (res.code == "502") { this.nodataFlag = true; }
                    if (!res.datas) { return; }
                    this.setData(res.datas);
                    this.initLineCharts();
                }).catch((e) => {
                    this.loading = false;
                });
            },
            setData(datas) {
                this.chartData.rows = [];
                let fields = this.chartData.fields;
                this.chartData.columns = this.chartData.columns2;
                if (this.reportType == "monthReport") {
                    fields = this.chartData.fields2;
                    this.chartData.columns = this.chartData.columns3;
                }
                for (let obj of datas) {
                    let row = {};
                    for (let field in fields) {
                        row[fields[field]] = obj.field;
                    }
                    this.chartData.rows.push(row);
                }
            },
            changeSelect(value) {
                this.chartData.columns = this.chartData.columnsObj[value]
            },
            initLineCharts() {
                this.chartOption = "";
                this.getOption();
                this.chartOption = this.chartExtend;
                this.appUrl = "echarts/LineChart";
            },
            getOption() {
                this.chartData.rows = this.datas;
                let chartData = this.chartData.rows;
                let columns = this.chartData.columns;
                let chartSettings = this.chartSettings;
                let legendName = chartSettings.legendName;
                let yAxisName = chartSettings.yAxisName;
                if (!columns || !columns.length) { return this.chartExtend; }
                let dataArr = [];
                let xAxisData = [];
                for (let n = 0, m = chartData.length; n < m; n++) {
                    let obj = chartData[n];
                    let data = [];
                    xAxisData.push(obj[columns[0]]);//X坐标值
                    for (let i = 1, j = columns.length; i < j; i++) {
                        if (!obj[columns[i]]) { continue; }
                        data.push(obj[columns[i]]);
                    }
                    if (!data || !data.length) { continue; }
                    dataArr.push(data);
                }
                if (!Array.isArray(this.chartExtend.series)) { return this.chartExtend; }
                let series = [];
                for (let i = 0, j = this.chartExtend.series.length; i < j; i++) {
                    series.push({ data: dataArr[i], type: 'line', name: legendName[columns[i + 1]],label:{show:false}});
                }
                this.chartExtend.series = series;
                if (xAxisData && xAxisData.length) {//X轴数据
                    this.chartExtend.xAxis['data'] = xAxisData;
                }
                if (yAxisName && yAxisName.length) {//Y轴单位
                    this.chartExtend.yAxis = [{ type: 'value', name: yAxisName[0] }, { type: 'value', name: yAxisName[1] }];
                }
                let labelMap = chartSettings.labelMap;
                let legendData = [];
                for (let field in labelMap) {
                    legendData.push(labelMap[field]);
                }
                if (legendData && legendData.length) {//图例
                    this.chartExtend['legend']['data'] = legendData;
                }
                if (this.chartExtend.tooltip && !this.chartExtend.tooltip.formatter) { //设置tooltip
                    let name = this.chartData.columns[0];
                    this.chartExtend.tooltip.formatter = function (params) {
                        let str = ''
                        let labelMapObj = _this.chartData.labelMapObj ? _this.chartData.labelMapObj[_this.selectData.value] : "";
                        for (let data of _this.chartData.rows) {
                            if (!data || data[name] != params[0].name) { continue }
                            str += data[name] + "<br>";
                            for (let field in data) {
                                if (field == name) { continue; }
                                if (labelMapObj && labelMapObj.indexOf(field) == -1) { continue; }
                                let value = data[field] ? data[field] : 0;
                                str += legendName[field] + " : " + value + "<br>"
                            }
                        }
                        return str
                    };
                }

                if (this.chartExtend.toolbox && this.chartExtend.toolbox.feature) {//设置toolbox 
                    let icon = require('@/assets/img/view_off.png');
                    let _this = this;
                    this.chartExtend.toolbox.feature = {
                        myTool: {
                            show: true,
                            title: " ",
                            icon: 'image://' + icon,
                            onclick: function () {
                                _this.iconFlag = !_this.iconFlag;
                                _this.changViewData(_this.iconFlag);
                            }
                        },
                        saveAsImage: {
                            type: "png",
                            show: true
                        }
                    }
                }
                this.chartExtend.color = this.chartSettings.chartColor;//设置颜色
                return this.chartExtend;
            },
            changViewData(iconFlag) {
                let icon = require('@/assets/img/view_off.png');
                let icon2 = require('@/assets/img/view.png');
                this.chartExtend.toolbox.feature.myTool.icon = this.iconFlag ? 'image://' + icon2 : 'image://' + icon;
                for(let obj of this.chartExtend.series){
                    obj.label.show = this.iconFlag;
                }             
                this.chartOption = "";
                this.chartOption = this.chartExtend;
            },
            changeSelect(value) {
                this.chartData.columns = this.chartData.columnsObj[value];
            }
        }
    }
</script>
<style scoped>
    .echart-ex1 {
        display: inline-block;
        width: 100%;
        border-width: 0px;
        background: inherit;
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
        overflow: hidden;
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

    .line-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
        margin: 0;
    }
</style>