import { utils } from './utils/utils'
import { clickHandler } from './module/clickHandler'
import { dispatch } from './module/dispatch'
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
            mall_userId: utils.cookie.getItem('mall_userId') || '',      // 用户id
            sessionId: utils.uuid(),                                     // 设备号
            plantform: '',                                               // 平台
            pageUrl: location.href,                                      // 当前页面地址
            pageName: document.title || '',                              // 当前页面的标题
            pageFrom: document.referrer,                                 // 当前页面的来源
            eventType: '',                                               // 事件类型
            currentTime: new Date().getTime(),                           // 当前时间
            //leaveTime: 0,                                                // 离开页面的时间
            extraData: null                                              // 扩展参数
        }
        // 初始化的时候重置参数
        this._extraData(obj)
        //自定义事件初始化
        this.dispatch = dispatch;
        
        //点击事件初始化
        utils.on(document.body, 'click', clickHandler);
        
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
     * - extraData
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
}


window.DF_SDK_Collect = DF_SDK_Collect;