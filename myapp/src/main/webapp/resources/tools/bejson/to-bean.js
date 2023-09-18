function main() {
}
/**
 * 把本程序定义的数据格式，转换为java bean文本
 * @param bean
 * @returns {string}
 */
function toBeanText(bean) {

    var beanFields = bean.val;
    var className = bean.name;

    var importText = "";
    var fieldText = "";
    var setterText = "";
    var typeSet = {};
    var shoudImportJackson = false;
    var tpl = document.getElementById('getset-templ').innerHTML;

    //依次遍历每个属性
    for (key in beanFields) {

        //如果存在下划线小写格式的属性名，要改成驼峰命名
        var camelKey = camelCase(key);
        if (camelKey != key) {
            //标准要用Jackson工具包做转换
            fieldText += '   @JsonProperty("' + key + '")\n';
            shoudImportJackson = true;
        }

        //生成属性定义
        fieldText += "   private " + beanFields[key] + " " + camelKey + ";\n";
        //记录属性类型,beanFields[key]可能有一些值，是List<Date>之类，要替换成Date
        var type = beanFields[key];
        if(type.indexOf("List<") > -1){
            type = beanFields[key].replace('List<',"");
            type = type.replace('>',"");
            typeSet["List"] = 'true';
        }
        typeSet[type] = 'true';

        //生成setter，getter语句
        var tplMap = {
            a: camelKey,
            A: firstToUpperCase(camelKey),
            T: beanFields[key]
        };
        setterText += tpl.replace(/a|A|T/g, function(matched) {
            return tplMap[matched];
        });

    }

    //生成import语句
    for (t in typeSet) {
        if (importMap[t]) {
            importText += "import " + importMap[t] + ";\n";
        }
    }
    if (shoudImportJackson) {
        importText += "import org.codehaus.jackson.annotate.JsonIgnoreProperties;\nimport org.codehaus.jackson.annotate.JsonProperty;"
    }
    var packageName = "";
    if(packageName){
        importText = "package "+ packageName + ";\n" + importText;
    }

    //把import,属性定义，setter，getter拼到一起，就是一个完整的java bean了
    return importText + "\n\n   \npublic class "+className+" {\n\n" + fieldText + setterText + "\n}";
}

/**
 * 解析Json，返回json中包含的属性、属性类型
 * @param text
 * @returns {{}}
 */
function getBeanFieldFromJson(text) {

    //1.先将文本转换成json实体
    var jsonObject = null;

    //一些容错配置
    //把首尾空格去掉，那么如果第一和最后一个字符为[]，说明是json数组，而非对象
    text = trimStr(text);

    jsonlint.parse(text);
    if (text[0] === "[" && text[text.length - 1] === "]") {
        text = '{ "list": ' + text + '}';
        //如果是数组，则默认去数组第一个元素
        jsonObject = JSON.parse(text).list[0];
    } else {
        jsonObject = JSON.parse(text);
    }

    //2.将json对象转换成bean类
    var bean = {};
    var attrClassAry = [];
    for (key in jsonObject) {
        var val = jsonObject[key];
        bean[key] = getTypeFromJsonVal(val,key,attrClassAry);
    }
    var className = "WanAndroid";
    if(!className){
        className = "A";
    }
    else{
        className = camelCaseWithFirstCharUpper(className);
    }
    bean = {name:className,val:bean};

    return $.merge( [bean], attrClassAry );
}



/**
 * 从json 属性值中判断该值的数据类型
 * @param val
 * @returns {string}
 */
function getTypeFromJsonVal(val,key,attrClassAry) {

    //去掉空格，以避免一些无谓的转换错误
    if(val && val.replace) {
        val =  val.replace(/ /g, "");
    }
    var typeofStr = typeof(val);
    if (typeofStr === 'number') {
        if (isInt(val)) {
            return "int";
        } else {
            return "double";
        }
    } else if (typeofStr === 'boolean') {
        return typeofStr;
    } else if (isDate(val)) {
        return "Date";
    } else if(!val){
        return "String";
    }
    else if (typeofStr === 'string') {
        return "String";
    } else {
        if (isArray(val)) {
            var type  = getTypeFromJsonVal(val[0],key,attrClassAry);
            return "List<"+type +">";
        } else {
                //会走到这里，说明属性值是个json，说明属性类型是个自定义类
            var typeName = camelCaseWithFirstCharUpper(key);
            var bean = {};
            for (key in val) {
                var fieldValue = val[key];
                bean[key] = getTypeFromJsonVal(fieldValue,key,attrClassAry);
            }
            attrClassAry.push({name:typeName,val:bean});
            return typeName;

        }
    }
}

var importMap = {
    'Date': 'java.util.Date',
    'List': 'java.util.List'
}

