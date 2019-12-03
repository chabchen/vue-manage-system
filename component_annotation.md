#  General components
sql2                切换radio后的sql
url                 服务器地址



# selector
divWidth            筛选器与button相隔宽度
searchDate:
    dateType        时间筛选器类型
    showFormat      时间筛选器显示格式
    valueFormat     时间筛选器真实传递格式
    operation       时间筛选器的sql拼接符号   （如："field":"beginDate","operation":"="    则：sql传递 beginDate = “”）
    type            与其他筛选器条件的连接符  （如： "type":"and"                          则：select * from table where 1=1 and 2=2)
    dataShow        是否初始显示,默认为true,如为false则在切换radio后显示
    sql             筛选器的数据查询sql
searchSelect:
    operation       时间筛选器的sql拼接符号   （如："field":"beginDate","operation":"="    则：sql传递 beginDate = “”）
    type            与其他筛选器条件的连接符  （如： "type":"and"                          则：select * from table where 1=1 and 2=2)
    relation        级联查询时使用,为true时为父级联元素,与relationField共同使用
    relationField   级联查询时使用,内容为与其关联的父元素
    checkboxValue   暂未使用
    sql             筛选器的数据查询sql
    
# card
lastDateFlag        子表查询时使用,为true时时间选择器子表传参只传筛选器的结束时间
widthData           card宽度
items:
checked             卡片可勾选--暂未使用
limitFields         子表查询时使用,限制传参的字段,如没有则不传
sqlFlag             有维度切换时使用,用来判断使用sql还是sql2
fieldFlag           吨件判断
nodataFlag          无数据显示flag
rightPx             card右侧宽度,用来换行
radioCard           有维度切换时可能使用,用来判断不用维度显示的内容,
cardFlag            用来切换radioCard

#lineBar
widthData           图表宽度
limitFields         子表查询时使用,限制传参的字段,如没有则不传
lastDateFlag        子表查询时使用,为true时时间选择器子表传参只传筛选器的结束时间
selectData:
    value           图标筛选器的值,与columnsObj中的值对应
    options         筛选器的下拉选项
        value       下拉选项的值,与columnsObj中的值对应
chartData:
    columnsObj      有筛选器的图表使用,内部包含的每一个对象都是筛选器的一个选择
    labelMapObj     有筛选器的图表使用,控制鼠标移上时显示的内容
chartExtend:
    tooltip         控制鼠标移上时显示的内容，可为空，为空显示全部 
    toolbox         自定义按钮,本项目中用于控制是否显示图表数值
chartSettings:
    legendName      鼠标移上文本显示内容标记
    labelMap        图例显示内容
    axisSite        图例单位对应键值
    
#DynamicTable
items1              仅一级下钻显示字段
items2              仅二级下钻显示字段
items3              仅三级下钻显示字段
item                固定显示字段
level               初始下钻级别
rowSpanField        下钻时关联字段
mainField           sql传参时替换字段

dateData            sql中复杂逻辑日期字段替换，
replaceField        对应的替换字段
noTime              sql中排除日期选择器
param_year          年报中日期筛选器截取年份
getBehind           牧场怀孕率情期筛选器截取结束日期
fieldName           根据字段名匹配数据
mapUrl              投资地图的json路径