/**
 * 工具方法 
 */

//扩展帮助方法*/
export const utils = {};

// 唯一标示 uuid,pageSessionId
utils.uuid = function() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

//遍历
/**
 * @method each
 * @parame loopable 要遍历的对象
 * @parame callback 回调函数
 * @parame self 上下文
 **/
utils.each = function(loopable, callback, self) {
    var additionalArgs = Array.prototype.slice.call(arguments,3);
    if(loopable) {
        if(loopable.length === +loopable.length) {
            for(var i=0; i<loopable.length; i++) {
                callback.apply(self, [loopable[i],i].concat(additionalArgs));
            }
        } else {
            for(var item in loopable) {
                callback.apply(self, [loopable[item], item].concat(additionalArgs));
            }
        }
    }
};

//扩展
/**
 *@method extend
 *@parame base 要扩展的对象
 *@return base  返回扩展后的对象
 **/
utils.extend = function(base) {
    utils.each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {
        utils.each(extensionObject, function(value, key) {
            if(extensionObject.hasOwnPrototype(key)) {
                base[key] = value;
            }
        });
    });
    return base;
};

//返回数组元素所在的位置，确定是否包含在里面
/**
 *@method indexOf
 *@parame arrayToSearch 查找的对象
 *@parame item 查找的元素
 *@return args  返回位置
 **/
utils.indexOf = function(arrayToSearch,item){
    if(Array.prototype.indexOf){
        return arrayToSearch.indexOf(item);
    } else {
        for(var i=0; i< arrayToSearch.length; i++){
            if(arrayToSearch[i] === item) return i;
        }
        return -1;
    }
};

//绑定事件
utils.on = function(target, type, handler) {
    if(target.addEventListener) {
        target.addEventListener(type, handler, false);
    } else {
        target.attachEvent("on" + type,
            function(event) {
                return handler.call(target, event);
            }, false);
    }
};

//取消事件监听
utils.remove = function(target, type, handler) {
    if(target.removeEventListener) {
        target.removeEventListener(type, handler);
    } else {
        target.detachEvent("on" + type,
                function(event) {
                    return handler.call(target, event);
                }, true);
    }
};

//将json转为字符串
utils.changeJSON2Query =  function (jsonObj) {
    var args = '';
    for (var i in jsonObj) {
        if (args != '') {
            args += '&';
        }
        args += i + '=' + encodeURIComponent(jsonObj[i]);
    }
    return args;
};

//将相对路径解析成文档全路径
utils.normalize = function (url){
    var a=document.createElement('a');
    a.setAttribute('href',url)
    return a.href;
}

//拷贝元素 浅拷贝
utils.copyObj = function (copyObj) {
    var obj = {};
    for ( var i in copyObj) {
        obj[i] = copyObj[i];
    }
    return obj;
}