import { utils } from './utils/utils'
import { sendLog } from './module/send'
import { TYPE } from './utils/type'

/**
 * 实例化的时候可以改变上报的地址和其他参数默认值
 * new DF_SDK_Collect({sendUrl: 'url地址', ...}) 注意：URL地址为全地址
 */
class DF_SDK_Collect {
    constructor(obj){
        this.version = '1.0.0';
        console.log('埋点的版本号：' + this.version);
        this.sendUrl = 'http://localhost:8088';
        this.commonUpData = {
            userId: utils.cookie.getItem('mall_userId') || '',      // 用户id
            sessionId: utils.uuid(),                                     // 设备号
            plantform: '',                                               // 平台
            pageUrl: location.href,                                      // 当前页面地址
            pageName: document.title || '',                              // 当前页面的标题
            pageFrom: document.referrer,                                 // 当前页面的来源
            eventType: '',                                               // 事件类型
            currentTime: new Date().getTime(),                           // 当前时间
            //leaveTime: 0,                                                // 离开页面的时间
            extraInfo: null                                              // 扩展参数
        }
        // 初始化的时候重置参数
        this._extraData(obj)
    }

    _addNewData(oldObj,newObj,key){
        if(Object.prototype.toString.call(newObj[key]) === '[object String]'){
            oldObj[key] = newObj[key]
        }else{
            for(let sItem in newObj[key]){
                if(oldObj[key].hasOwnProperty(sItem)){
                    oldObj[key][sItem] = newObj[key][sItem]
                }else{
                    oldObj[key][sItem] = newObj[key][sItem]
                }
            }
        }
    }
    _extraData(obj){
        var that = this;
        for(let item in obj){
            if(that.hasOwnProperty(item)){
                this._addNewData(that,obj,item)
            }else{
                this._addNewData(that,obj,item)
            }
        }
    }
   
    /**
     * @param {Object} extraObj 需要额外上报的数据
     * 一般包括：
     * - mall_userId
     * - sessionId
     * - plantform
     * - pageFrom
     * - extraInfo
     */
    pageVisit(extraObj){
        let resObj = {};
        if(extraObj&&Object.prototype.toString.call(extraObj) === '[object Object]'){
            Object.assign(resObj,this.commonUpData,extraObj)
            resObj.eventType = TYPE.PV;
            sendLog(this.sendUrl,resObj);
        }else{
            Object.assign(resObj,this.commonUpData,extraObj)
            resObj.eventType = TYPE.PV;
            sendLog(this.sendUrl,resObj);
        }
    }

    /**
     * 点击回调事件
     * @method clickHandler (obj)                 
     * @param {String} pageChannel     页面频道
     * @param {String} pagePosition    当前位置    
     * @param {String} currentTarget   当前标签
     * @param {String} eventType       事件类型
     * @param {Object} extraInfo       额外信息
     */
    clickHandler(obj){
        obj = Object.assign(this.commonUpData, obj);
        sendLog(this.sendUrl, obj);
    }
}


window.DF_SDK_Collect = DF_SDK_Collect;