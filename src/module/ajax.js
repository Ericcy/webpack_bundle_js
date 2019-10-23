export function ajax(obj) {
    //默认参数
    var defaults = {
        type: 'get',
        data: {},
        url: '#',
        dataType: 'text',
        async: true,
        success: function (data) { }
    }
    //处理形参，传递参数的时候就覆盖默认的参数，不传递就使用默认的参数
    for (var key in obj) {
        defaults[key] = obj[key];
    }
    //1.创建一个XMLHttpRequest对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    var param = '';
    for (var attr in obj.data) {
        param += attr + '=' + obj.data[attr] + '&';
    }
    if (param) {
        param = param.substring(0, param.length - 1);
    }
    // 处理get请求参数并处理中文乱码问题
    if (defaults.type == 'get' && param) {
        defaults.url += '&' + encodeURI(param);
    }
    // 2.准备发送
    xhr.open(defaults.type, defaults.url, defaults.async);
     
    // 处理post请求参数并且设置请求头信息
    var data = null;
    if (defaults.type == 'post') {
        data = param;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    //3.执行发送动作
    xhr.send(data);
    // 处理同步请求，不会调用回调函数
    if (!defaults.async) {
        if (defaults.dataType == 'json') {
            defaults.success(JSON.parse(xhr.responseText))
        } else {
            defaults.success(xhr.responseText)
        }
        return;
    }
    //4.指定回调函数
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (defaults.dataType == 'json') {
                data = JSON.parse(data);
            }
            defaults.success(data);
        }
    }
}