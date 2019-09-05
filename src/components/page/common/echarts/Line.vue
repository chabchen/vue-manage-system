<template>
    <div :style="{width:widthData}" class="line-box">
        <div class="echart-ex1">
            <div class="line-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="line-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-line :data="chartData" width=100% height="414px" :extend="chartExtend" :colors="chartSettings.chartColor" :loading="loading"
                :settings="chartSettings" />
        </div>
    </div>
</template>
<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                selectData: {},
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                loading: true,
                widthData: '50%'
            }
        },
        created() {
            this.loading = false;
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
        }
    }
</script>
<style scoped>
    .line-title {
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
        margin: 30px 0 60px 0;
    }

    .echart-ex1 {
        display: inline-block;
        width: 95%;
        margin: 0 auto;
        border-width: 0px;
        height: 500px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
    }

    .line-title p {
        display: inline-block;
    }

    .line-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-block;
    }
</style>