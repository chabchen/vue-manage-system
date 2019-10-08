<template>
    <div id="mapGeoChart" :style="style"></div>
</template>

<script>
    import cityMap from "./js/china-main-city-map.js";
    import axios from "axios";
    export default {
        props: { prop: Object },
        data() {
            return {
                chinaId: 100000,
                chinaName: 'china',
                mapStack: [],
                parentId: '',
                parentName: '',
                myChart: '',
                mapData: '',
                params: '',
                sourceParam: '',
                geoMapData: [],
                mapUrl: "",
                style: { height: 800 + 'px' },
            }
        },computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if(!newValue){return;}
                this.loadReportData(newValue.searchSelect);
                this.params = newValue;
                this.prop.params = "";
            }
        },
        created() {
            this.mapUrl = window.config.mapUrl;
            this.style = this.prop.config && this.prop.config.style ? this.prop.config.style : this.style;
        },
        methods: {
            //保存初始化筛选器参数
            saveSourceParam(data) {
                this.sourceParam = [];
                for (let obj of data) {
                    let newObj = {};
                    for (let field in obj) {
                        newObj[field] = obj[field];
                    }
                    this.sourceParam.push(newObj);
                }
            },
            /**
             * id        省市县Id
             * name      省市县名称
             * mapJson   地图Json数据
             * flag      是否往mapStack里添加parentId，parentName
             */
            registerAndsetOption(id, name, mapJson, flag) {
                this.$echarts.registerMap(name, mapJson);
                this.myChart.setOption({
                    geo: {
                        map: 'china',
                        label: { emphasis: { show: false } },
                        roam: false,
                        itemStyle: {
                            normal: {
                                areaColor: '#8faadc',//'rgba(48,56,69,0.8)',//地图默认的背景颜色
                                borderColor: '#fff'//地图默认的边线颜色
                            },
                            emphasis: { areaColor: 'rgba(48,56,69,0.8)' }//地图触发地区的背景颜色
                        }
                    },
                    series: [
                        {
                            name: 'name',            // series名称
                            type: 'scatter',          // series图表类型
                            coordinateSystem: 'geo',  // series坐标系类型
                            data: this.geoMapData,  // series数据内容
                            symbolSize: 15,
                            //控制显示文本
                            label: {
                                normal: {
                                    show: true,
                                    formatter: function (params) {
                                        if ("蒙牛,伊利,共有".indexOf(params.name) > -1) {
                                            return '                ' + params.name;
                                        }
                                        return "";
                                    }
                                },
                                emphasis: { show: true }
                            },
                            //series样式
                            itemStyle: { emphasis: { borderColor: '#fff', borderWidth: 1 } }
                        }
                    ],
                    tooltip: {
                        padding: 10,
                        backgroundColor: '#222',
                        borderColor: '#777',
                        borderWidth: 1,
                        trigger: 'item',
                        formatter: function (params) {
                            return '';
                        }
                    },
                    visualMap: {
                        show: false,
                        min: 0,//最小
                        max: 300,//最大
                        //splitNumber: 3,//共分5层
                        splitList: [
                            { start: 200, end: 300 },//MN
                            { start: 100, end: 200 },//YL
                            { start: 0, end: 100 }//GY
                        ],
                        color: ['#0000BF', '#FFFF00','#D9001B'],//颜色从高到低依次渐变
                        //color: ['#DB4504', '#4B7902', '#FF9D1E'],//颜色从高到低依次渐变
                        textStyle: { color: '#fff' }
                    }
                });
                if (!flag) { return; }
                //往mapStack里添加parentId，parentName,返回上一级使用
                this.mapStack.push({ mapId: this.parentId, mapName: this.parentName });
                this.parentId = id;
                this.parentName = name;
            },
            loadReportData(params) {
                let sql = this.prop.sqls;
                let param = "";
                for (let obj of params) {//筛选器过滤
                    if (!obj.value || obj.field != 'halfYear') { continue; }
                    param += " " + obj.type + " " + obj.tableField + " = '" + obj.value + "' ";
                }
                sql += param;
                this.geoMapData = [
                    { name: "蒙牛", value: [76.2, 26.3, 250] },
                    { name: "伊利", value: [76.3, 24.3, 150] },
                    { name: "共有", value: [76.3, 22.3, 50] }
                ];
                this.$requestData('/report/list', 'post', { params: sql }).then(res => {
                    let data = res.datas && res.datas.length ? res.datas : [];
                    for (let obj of data) {
                        if (!obj.longitude_and_latitude) { continue; }
                        let longitude = obj.longitude_and_latitude.split(",")[0];
                        let latitude = obj.longitude_and_latitude.split(",")[1];
                        let value = [parseFloat(longitude), parseFloat(latitude)];
                        if (obj.enterprise == 'MN') {
                            value.push(250);
                        } else if (obj.enterprise == 'YL') {
                            value.push(150);
                        } else {
                            value.push(50);
                        }
                        this.geoMapData.push({ name: obj.enterprise, value: value });
                    }
                    this.geoMapData = this.geoMapData;
                    this.mapChart();
                })
                    .catch(() => {
                        this.mapChart();
                    });
            },
            mapChart() {
                window.oncontextmenu = function (e) { e.preventDefault(); }
                axios.get(this.mapUrl + this.chinaId + ".json", {}).then(response => {
                    let mapJson = response.data;
                    this.myChart = this.$echarts.init(document.getElementById('mapGeoChart'));
                    this.registerAndsetOption(this.chinaId, this.chinaName, mapJson, false);
                    this.parentId = this.chinaId;
                    this.parentName = "china";
                });
            }
        }
    };

</script>

<style scoped>
</style>