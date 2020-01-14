<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if="selectData.title" class="head-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="lineBar-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" @change="changeSelect" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div v-show="!nodataFlag">
                <ve-histogram width=100% :height="heightData" :extend="chartExtend" :colors="chartSettings.chartColor" :data="chartData"
                    :loading="loading" :settings="chartSettings" />
            </div>
            <div v-show="nodataFlag">
                <nodata/>
            </div>
        </div>
    </div>
</template>

<script>
    import nodata from '../nodata.vue'
    export default {
        components: { nodata },
        props: { prop: Object },
        data() {
            return {
                loading: false,
                selectData: {},
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                widthData: '50%',
                heightData: '350px',
                params: '',
                dataSource: "",
                sqlFlag: false,
                fieldFlag: "",
                iconFlag: false,
                nodataFlag: false,
                datas: []
            }
        },
        created() {
            this.selectData = this.prop.config.selectData;
            this.dataSource = this.prop.dataSource;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            if (this.prop.config.heightData) {
                this.heightData = this.prop.config.heightData;
            }
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
                this.$requestData(url, 'post', { params: sql,dataSource:this.dataSource }).then(res => {
                    this.loading = false;
                    if (res.code == "502") { this.nodataFlag = true; }
                    if (!res.datas) { return; }
                    this.setToolTip(res.datas);
                    this.setData(res.datas);
                }).catch((e) => {
                    this.loading = false;
                });
            },
            setData(data) {
                let name = this.chartData.columns[0];
                if (!data[0][name]) { return; }
                this.chartData.rows = data;
            },
            setToolTip(data) {
                this.setToolbox();
                this.datas = data;
                this.chartExtend.series.label.normal.show = false;
                if (!data || !this.chartExtend.tooltip) { return; }
                if (this.chartExtend.tooltip.formatter) { return; }
                let legendName = this.chartSettings.legendName
                let name = this.chartData.columns[0];
                let _this = this;
                this.chartExtend.tooltip.formatter = function (params) {
                    let str = ''
                    let labelMapObj = _this.chartData.labelMapObj ? _this.chartData.labelMapObj[_this.selectData.value] : "";
                    for (let data of _this.datas) {
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

            },
            setToolbox() {
                if (!this.chartExtend.toolbox || !this.chartExtend.toolbox.feature) { return; }
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
            },
            changViewData(iconFlag) {
                let icon = require('@/assets/img/view_off.png');
                let icon2 = require('@/assets/img/view.png');
                this.chartExtend.toolbox.feature.myTool.icon = this.iconFlag ? 'image://' + icon2 : 'image://' + icon;
                this.chartExtend.series.label.normal.show = this.iconFlag;
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
        width: 99.6%;
        border-width: 0px;
        background: inherit;
        border: none;
        border-radius: 0px;
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
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

    .lineBar-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
    }
</style>