
/**
 * 数字格式转换成千分位
 *@param{Object}num
 */
export function setFinanceVal(num) {
    if ((num + "").trim() == "") { return ""; }
    if (isNaN(num)) { return ""; }
    num = num + "";
    if (/^.*\..*$/.test(num)) {
        var pointIndex = num.lastIndexOf(".");
        var intPart = num.substring(0, pointIndex);
        var pointPart = num.substring(pointIndex + 1, num.length);
        intPart = intPart + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(intPart)) {
            intPart = intPart.replace(re, "$1,$2")
        }
        num = intPart + "." + pointPart.substring(0, 2);
    } else {
        num = num + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
            num = num.replace(re, "$1,$2")
        }
        num += ".00";
    }
    num = !num || num == "null" || num == "undefined" ? 0 : num;
    return num;
}
//数值转换
export function setDecimalVal(num) {
    num += "";
    if (num.trim() == "") { return ""; }
    num = num.replace(/,/gi, '');
    return num;
}

//组件列表
export function getComponents() {
    let comps = [
        { label: '筛选器1', value: 'filter/ConditionalSeaechs' },
        { label: '筛选器2', value: 'filter/ConditionalSeaech' },
        { label: '卡片1', value: 'filter/filter-card' },
        { label: '柱状图-折线图', value: 'echarts/LineBar' },
        { label: '堆叠柱状图', value: 'echarts/BarStack' },
        { label: '折线图', value: 'echarts/Line' },
        { label: '饼状图', value: 'echarts/PieChart' },
        { label: '表单1', value: 'form/Form' },
        { label: '表格1', value: 'table/Table' },
        { label: '三级下钻表格', value: 'table/DynamicTable' },
        { label: 'KPI指标', value: 'title/title-kpi' },
        { label: '地图', value: 'map/Map' },
        { label: '地图-散点', value: 'map/MapGeo' },
        { label: '单选框1', value: 'filter/filter-radio' }
    ];
    return comps;
}


