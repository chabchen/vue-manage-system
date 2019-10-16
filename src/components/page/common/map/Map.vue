<template>
    <div v-loading="loading" id="mapChart" :style="style"></div>
</template>

<script>
    import cityMap from "./js/china-main-city-map.js";
    import axios from "axios";
    var mapLevel = 0;
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                reportId: '',
                chinaId: 100000,
                currentId: 100000,
                chinaName: 'china',
                mapStack: [],
                parentId: '',
                parentName: '',
                myChart: '',
                mapData: [],
                datas: [],
                params: '',
                style: { height: 600 + 'px', width: '57%', float: 'left' },
                sourceParam: [],
                expanded: false,
                configData: [],
                mapNames: [],
                markPoint: false,
                markPointSql: '',
                markPointSql2: '',
                markPointType: "",
                flag: true,
                eventFlag: false,
                initOnEvent: true,
                mapUrl: ""
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
                if (this.flag) {
                    this.flag = false;
                    this.saveSourceParam(newValue.searchSelect);
                }
                this.params = newValue;
                this.mapChart();
                this.prop.params = "";
            }
        },
        created() {
            mapLevel = 0;
            this.mapUrl = window.config.mapUrl;
            this.configData = this.prop.config.items;
            this.expanded = this.prop.config.expanded;
            this.markPoint = this.prop.config.markPoint;
            this.markPointSql = this.prop.config.markPointSql;
            this.markPointSql2 = this.prop.config.markPointSql2;
            this.markPointType = this.prop.config.markPointType;
        },
        methods: {
            //查询事件
            searchEvent(name, type) {
                this.style = { height: 600 + 'px', width: '57%', float: 'left' };
                let param = {};
                this.eventFlag = true;
                let filterArr = [];
                let newFilterArr = [];
                for (let obj of this.params.searchSelect) {//筛选器过滤
                    if (!obj.value) { continue; }
                    filterArr.push({ operation: obj.operation, type: obj.type, tableField: obj.tableField, value: obj.value });
                }
                if ('back' == type) {
                    newFilterArr = this.removeByIndex(filterArr, filterArr.length - 1);
                    this.params.searchSelect = this.removeByIndex(this.params.searchSelect, this.params.searchSelect.length - 1);
                    param.markPointName = "";
                }
                let tableField = mapLevel == 1 ? "province" : "city";
                tableField = mapLevel == 2 && type == "markPoint" ? this.markPointType : tableField;
                if (this.chinaName == name) {
                    this.$parent.$parent.parentSearchEvent({ searchSelect: this.sourceParam });
                    return;
                }
                if (type != "markPoint" && this.isExist(filterArr, tableField)) {
                    filterArr.push({ operation: "=", tableField: tableField, type: "and", value: name });
                }
                if (type == "markPoint" && this.isExist(filterArr, tableField, name)) {
                    filterArr.push({ operation: "=", tableField: tableField, type: "and", value: name });
                }
                if ('back' == type) {
                    param.searchSelect = newFilterArr;
                } else {
                    param.searchSelect = filterArr;
                }
                if (mapLevel == 2 && type == "markPoint") {
                    param.markPointName = name;
                    this.style = { height: 600 + 'px', width: '57%', float: 'left' };
                }
                this.$parent.$parent.parentSearchEvent(param);
            },
            //判断数组中是否存在该对象
            isExist(filterArr, tableField, value) {
                for (let obj of filterArr) {
                    if (!obj) { continue; }
                    if (!value && tableField == obj.tableField) { return false; }
                    if (value && tableField == obj.tableField) { obj.value = value; return false; }
                }
                return true;
            },
            //根据下标删除数组对象
            removeByIndex(arr, index) {
                delete arr[index];
                let newArr = [];
                for (let obj of arr) {
                    if (!obj) { continue; }
                    let newObj = {};
                    for (let field in obj) {
                        newObj[field] = obj[field];
                    }
                    newArr.push(newObj);
                }
                return newArr;
            },
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
            back(id) {//返回上一级地图
                if (!this.mapStack.length) { return; }
                //如果有上级目录则执行
                let map = this.mapStack.pop();
                let mapId = map.mapId;
                if (id) {
                    this.currentId = id;
                    mapId = id;
                    mapLevel = 1;
                }
                axios.get(this.mapUrl + map.mapId + ".json", {}).then(response => {
                    const mapJson = response.data;
                    if(mapLevel > 0){mapLevel--};
                    this.searchEvent(map.mapName, 'back');
                    this.registerAndsetOption(map.mapId, map.mapName, mapJson, false);
                    //返回上一级后，父级的ID、Name随之改变
                    this.currentId = "";
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
                this.datas = [];
                this.mapData = [];
                let _this = this;
                let param = this.getParam();
                this.initMapData(mapJson, name, param);
                if (mapLevel == 2 && this.markPointSql) {
                    //加载当前城市的工厂坐标
                    this.loadMarkPoint(param + " and city = '" + name.replace("市", "") + "'", name);
                } else if (this.markPoint) {
                    this.loadMarkPoint(param, name);
                } else {
                    this.setMapChart(name);
                }
                if (!flag) { return; }
                //往mapStack里添加parentId，parentName,返回上一级使用
                this.mapStack.push({ mapId: this.parentId, mapName: this.parentName });
                this.parentId = id;
                this.parentName = name;
            },
            //绘制地图
            setMapChart(name){
                let _this = this;
                setTimeout(function(){
                    _this.myChart.setOption(_this.getOption(name));
                },100);
            },
            //获取筛选器参数
            getParam() {
                let paramData = mapLevel == 0 ? this.sourceParam : this.params.searchSelect;
                let param = ' ';
                if (!this.params) { return param; }
                for (let obj of paramData) {//筛选器过滤
                    if (!obj.value) { continue; }
                    if (obj.operation != 'in') {
                        param += " " + obj.type + " " + obj.tableField + " = '" + obj.value + "' ";
                    }
                }
                if(mapLevel == 0 && this.params){
                    for(let obj of this.params.searchSelect){
                        if(obj.tableField.indexOf('biz_unit') == -1 || !obj.value){continue;}
                        param += " " + obj.type + " " + obj.tableField + " = '" + obj.value + "' ";
                    }
                }
                return param;
            },
            //初始化地图数据，根据随机数设置块颜色
            initMapData:  function (mapJson, mapName, param) {//async await
                let sql = this.prop.sqls + param;
                //加载各个地区的数据
                for (let i = 0, j = mapJson.features.length; i < j; i++) {
                    let name = mapJson.features[i].properties.name;
                    this.mapData.push({ name: name, value: Math.round(Math.random() * 500), coord: [] });
                    let condition = "";
                    if (!name) { continue; }
                    if (mapLevel == 0) {
                        condition = " and province = '" + name + "' ";
                    } else if (mapLevel == 1) {
                        condition = " and city = '" + name.replace("市", "") + "' ";
                    } else if (mapLevel == 2) {
                        condition = " and county = '" + name + "' ";
                    }
                    //如果需要标注城市则不加载省级数据
                    if (this.markPoint) { continue; }
                    this.loadMapData(name,sql + condition);
                }
            },
            //加载指标数据
            loadMapData(name, sql) {
                this.$requestData('/report/list', 'post', { params: sql }).then(res => {
                    let data = res.datas && res.datas.length ? res.datas[0] : "";
                    if (!data) { return; }
                    this.datas.push({ name: name, value: data });
                    if(this.mapNames.indexOf(name) == -1){
                        this.mapNames.push(name);
                    }                    
                });
            },
            //加载打点数据
            loadMarkPoint(param, name) {
                let sql = this.prop.sqls + param;
                let sql2 = this.markPointSql + param;
                let sql3 = this.markPointSql2 + param;
                if (mapLevel == 2 && this.markPoint) {
                    sql2 = this.markPointSql2 ? sql3 : sql2;
                }
                this.$requestData('/report/list', 'post', { params: sql2 }).then(res => {
                    let data = res.datas && res.datas.length ? res.datas : [];
                    if (!data[0]) {this.setMapChart(name);return; }
                    let nameArr = "";
                    for (let obj of data) {
                        if (!obj.longitude_and_latitude || !obj.name) { continue; }
                        let longitude = obj.longitude_and_latitude.split(",")[0];
                        let latitude = obj.longitude_and_latitude.split(",")[1];
                        if (nameArr.indexOf(obj.name) == -1) {
                            this.mapData.push({ name: obj.name, value: obj.name, coord: [parseFloat(longitude), parseFloat(latitude)] });
                        }
                        nameArr += obj.name;
                        if (!this.markPoint) { continue; }//工厂标注时不需要加载城市数据
                        if (mapLevel == 0) {
                            this.loadMapData(obj.name, sql + " and city = '" + obj.name.replace("市", "") + "' ");
                        }
                    }
                    this.setMapChart(name);
                })
                .catch(() => {
                    this.setMapChart(name);
                });
            },
            //初始化地图
            mapChart() {//地图下钻时禁止重置eventFlag
                if (mapLevel > 0 && (!this.currentId || this.eventFlag)) { return; }
                this.currentId = mapLevel == 0 ? this.chinaId : this.currentId;
                window.oncontextmenu = function (e) { e.preventDefault(); }
                axios.get(this.mapUrl + this.currentId + ".json", {}).then(response => {
                    let mapJson = response.data;
                    this.myChart = this.$echarts.init(document.getElementById('mapChart'));
                    this.registerAndsetOption(this.chinaId, this.chinaName, mapJson, false);
                    this.parentId = this.chinaId;
                    this.parentName = "china";
                    let _this = this;
                    if (!this.expanded) { return; }

                    // this.myChart.on("dblclick", function (param) {
                    //     _this.back(this.chinaId);
                    // });
                    
                    if(!this.initOnEvent){return;}
                    this.initOnEvent = false;
                    this.myChart.on("click", function (param) {
                        this.loading = true;
                        let cityId = cityMap[param.name] ? cityMap[param.name] : cityMap[param.name.replace("市", "")];
                        if (param.componentType != "markPoint" && _this.currentId == cityId) { return; }
                        _this.currentId = cityId;
                        if (!cityId && param.componentType == "markPoint") {
                            _this.searchEvent(param.name, param.componentType);//联动事件
                        }
                        if (!cityId || (_this.markPoint && param.componentType != "markPoint")) { return; }
                        if (param.componentType == "markPoint" && mapLevel < 2) { mapLevel++; }
                        axios.get(_this.mapUrl + cityId + ".json", {}).then(response => {
                            const mapJson = response.data;
                            if(mapLevel < 2){mapLevel++;}                     
                            _this.searchEvent(param.name);//联动事件
                            _this.registerAndsetOption(cityId, param.name, mapJson, true);
                        });
                    });
                    this.myChart.on("contextmenu", function (param) {
                        this.loading = true;
                        if (_this.markPoint && param.componentType != "markPoint") { return; }
                        if (mapLevel == 0) { return; }
                        if (_this.markPoint && param.componentType == "markPoint" && mapLevel > 0) { mapLevel--; }       
                        _this.back();
                    });
                });
            },
            //千分位处理
            setFinanceVal(value, type) {
                value = value ? value : 0;
                if (typeof (value) == 'number' && type != 'int') {
                    value = this.$setFinanceVal(value.toFixed(2))
                }
                return value;
            },
            getOption(name) {
                this.loading = false;
                let _this = this;
                let layoutSize = mapLevel == 0 ? 730 : 600;
                let option = {
                    series: [{
                        type: "map", map: name,
                        layoutCenter: ['50%', '48%'],
                        layoutSize: layoutSize,
                        itemStyle: { normal: { areaColor: "rgba(23, 27, 57,0)", borderColor: "#1dc199", borderWidth: 1 } },
                        label: {
                            normal: {
                                show: !this.markPoint,
                                formatter: function (params) {
                                    if (_this.mapNames.length && _this.mapNames.indexOf(params.name) > -1) {
                                        return params.name;
                                    }
                                    return params.name;
                                }//是否显示默认名称
                            },
                            emphasis: { show: false }//鼠标悬浮是否显示默认地理名称
                        },
                        data: this.mapData,
                        markPoint: {
                            // symbol:'circle',
                            symbolSize: mapLevel == 1 || mapLevel == 2 ? 50 : 20,
                            label: {//标注的文本
                                normal: {
                                    show: mapLevel == 1 || mapLevel == 2 ? true : false,//即是否显示标注的名称（data:name）
                                    formatter: '{b}'//模板变量有 {a}、{b}、{c}，分别表示系列名，数据名，数据值。
                                }
                            },//标注的样式。
                            itemStyle: { normal: { color: 'blue' } },
                            data: this.mapData,
                            silent: false,
                            tooltip: {
                                formatter: function (params) {
                                    let html = '';
                                    for (let obj of _this.datas) {
                                        if (!obj.name || !obj.value || params.name != obj.name) { continue; }
                                        html = '<div>' + obj.name + '<br>';
                                        for (let item of _this.configData) {
                                            if (!item.label || !obj.value[item.value]) { continue; }
                                            html += item.label + _this.setFinanceVal(obj.value[item.value], item.type) + '<br>';
                                        }
                                        return (html + '</div>');
                                    }
                                    return html;
                                }
                            }
                        }
                    }],
                    tooltip: {
                        padding: 10,
                        backgroundColor: '#222',
                        borderColor: '#777',
                        borderWidth: 1,
                        trigger: 'item',
                        formatter: function (params) {
                            if (_this.markPoint) { return; }
                            let html = '';
                            for (let obj of _this.datas) {
                                if (!obj.name || !obj.value || params.name != obj.name) { continue; }
                                html = '<div>' + obj.name + '<br>';
                                for (let item of _this.configData) {
                                    if (!item.label || !obj.value[item.value]) { continue; }
                                    html += item.label + _this.setFinanceVal(obj.value[item.value], item.type) + '<br>';
                                }
                                return (html + '</div>');
                            }
                            return html;
                        }
                    },
                    visualMap: {
                        show: false,
                        x: 'left',
                        y: 'center',
                        splitList: [
                            { start: 500, end: 600 },
                            { start: 400, end: 500 },
                            { start: 300, end: 400 },
                            { start: 200, end: 300 },
                            { start: 100, end: 200 },
                            { start: 0, end: 100 }
                        ],
                        color: ['#5475f5', '#9feaa5', '#85daef', '#74e2ca', '#e6ac53', '#9fb5ea']
                    }
                };
                return option;
            }
        }
    };

</script>

<style scoped>
</style>