<template>
    <div :style="{width:widthData}" class="line-box">
        <div class="echart-ex1">
            <div v-if = "selectData.title" class="lineBar-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="lineBar-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-histogram width=100% height="414px" :extend="chartExtend" :colors="chartSettings.chartColor" :data="chartData" :loading="loading"
                :settings="chartSettings" />
        </div>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                selectData: {},
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                widthData: '50%',
                params: '',
                sqlFlag: false,
                url: ''
            }
        },
        created() {
            this.loading = false;
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            this.url = this.prop.config.url;
            this.sql2 = this.prop.config.sql2;
            if(this.prop.config.widthData){
                this.widthData = this.prop.config.widthData;
            }
            //this.loadReportData(this.prop.params);
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
                this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {
            getParams(params){
                if(!params || (!params.searchSelect && !params.searchDate)){return "";}
                let param = "";
                if(params.searchSelect){
                    for (let obj of params.searchSelect) {
                        if (!obj.value || !obj.value.length) { continue; }
                        if (obj.type && obj.operation != 'in') {
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                        }
                        if(obj.type && obj.operation == 'in'){
                            if(!obj.value.length && !Array.isArray(obj.value)){continue;}
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation;
                            let inValue = "";
                            for(let value of obj.value){
                                if(!value){continue;}
                                inValue += "'" + value + "',";
                            }
                            inValue = inValue.substring(0,inValue.length-1);
                            if(inValue){
                                param += " (" + inValue + ")";
                            }
                        }
                        //多sql情况下根据筛选器选择对应的sql
                        if(obj.tableField == "sqlFlag"){
                            //酸奶调拨【吨|件】切换
                            this.sqlFlag = obj.value == "sql2" ? true : false;
                        }
                    }
                }
                if(!params.searchDate){ return param}
                for (let obj of params.searchDate) {
                    if (!obj.value) { continue; }
                    param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                }
                return param;
            },
            loadReportData(params) {
                let sql = this.prop.sqls;
                let param = this.getParams(params);
                let groupby = '';
                //判断单位为吨还是件
                if(this.sqlFlag && this.sql2){
                    groupby = this.sql2.split("groupby")[1];
                    sql = this.sql2.split("groupby")[0];
                }else{
                    groupby = sql.split("groupby")[1]
                    sql = sql.split("groupby")[0];
                }
                //判断是否存在groupby
                if (groupby) {
                    groupby = ' group by' + groupby;
                }
                if(!sql || !this.url){return;}
                this.$requestData(this.url , 'post', { params: sql + param + groupby }).then(res => {
                    if (!res.datas[0]) { return; }
                    this.chartData.rows = []
                    let filedArr = this.prop.config.selectData.filedArr
                    let chartData = this.prop.config.chartData
                    for(let i=0;i<res.datas.length;i++){
                        chartData.rows[i] = {}
                        for(let item in chartData.columns){
                            chartData.rows[i][chartData.columns[item]] = res.datas[i][filedArr[item]]
                        }
                    }
                });
            },
        }
    }
</script>
<style scoped>
    .echart-ex1 {
        display: inline-block;
        width: 99.6%;
        margin: 2% auto;
        border-width: 0px;
        height: 500px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0px;
        /*-moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);*/
        /*-webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);*/
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
    }

    .lineBar-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        color: #333333;
        vertical-align: none;
        line-height: 50px;
        text-transform: none;
        /*background: #409eff;*/
        background: rgba(242, 242, 242, 1);
        color: #333333;
        padding-left: 15px;
        margin: 10px 0 10px 0;
    }

    .lineBar-title p {
        display: inline-block;
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