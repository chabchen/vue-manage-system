<template>
    <div class="box">
        <div id="mapChart" class="chart"></div>
    </div>
    
</template>

<script>
    import cityMap from "../js/china-main-city-map.js";
    import axios from "axios";
    export default {
        props: { msg: String },
        data() {
            return {
                chinaId: 100000,
                chinaName: 'china',
                mapStack: [],
                parentId: '',
                parentName: '',
                myChart: '',
            }
        },
        created() {
            this.mapChart();
        },
        methods: {
            back() {//返回上一级地图
                if (!this.mapStack.length) { return; }
                //如果有上级目录则执行
                let map = this.mapStack.pop();
                axios.get("/json/map/" + map.mapId + ".json", {}).then(response => {
                    const mapJson = response.data;
                    this.registerAndsetOption(map.mapId, map.mapName, mapJson, false);
                    //返回上一级后，父级的ID、Name随之改变
                    this.parentId = map.mapId;
                    this.parentName = map.mapName;
                });
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
                    series: [{ type: "map", map: name, 
                            itemStyle: { normal: { areaColor: "rgba(23, 27, 57,0)", borderColor: "#1dc199", borderWidth: 1 } }, 
                            data: this.initMapData(mapJson) 
                        }]
                });
                if (!flag) {return;}
                //往mapStack里添加parentId，parentName,返回上一级使用
                this.mapStack.push({ mapId: this.parentId, mapName: this.parentName });
                this.parentId = id;
                this.parentName = name;                
            },
            initMapData(mapJson) {
                let mapData = [];
                for (let i = 0; i < mapJson.features.length; i++) {
                    mapData.push({ name: mapJson.features[i].properties.name });
                }
                return mapData;
            },
            mapChart() {
                window.oncontextmenu=function(e){e.preventDefault();}

                axios.get("/json/map/" + this.chinaId + ".json", {}).then(response => {
                    let mapJson = response.data;
                    this.myChart = this.$echarts.init(document.getElementById('mapChart'));
                    this.registerAndsetOption(this.chinaId, this.chinaName, mapJson, false);
                    this.parentId = this.chinaId;
                    this.parentName = "china";
                    let _this = this;
                    this.myChart.on("click", function (param) {
                        let cityId = cityMap[param.name];
                        if(!cityId){return;}
                        //代表有下级地图
                        axios.get("/json/map/" + cityId + ".json", {}).then(response => {
                            const mapJson = response.data;
                            _this.registerAndsetOption(cityId, param.name, mapJson, true);
                        });
                    });
                    this.myChart.on("contextmenu", function (param) {
                        _this.back();
                    });
                });
            }
        }
    };

</script>

<style scoped>
    .box {
        position: absolute;
        width: 90%;
        height: 80vh;
        left: 5%;
        top: 10%;
    }

    .chart {
        position: relative;
        height: 90%;
        top: 10%;
    }
</style>