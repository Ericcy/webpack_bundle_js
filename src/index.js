import { utils } from './utils/utils'
import { sendLog } from './module/send'
import { TYPE } from './utils/type'

/**
 * 实例化的时候可以改变上报的地址和其他参数默认值
 * new DF_SDK_Collect({sendUrl: 'url地址', ...}) 注意：URL地址为全地址
 * 1. pageVisit 上报PV
 * 2. setIntervalPv 定时上报 --- 计算停留时长
 * 3. clickHandler 点击事件上报
 */
class DFCollectSDK {
    constructor(obj){
        this.version = '1.0.0';
        console.log('埋点的版本号：' + this.version);
        this.sendUrl = 'http://10.10.5.65/tracker/add';       // 数据上报接口
        this.heartBeatUrl = '';                               // 心跳接口-----用来计算页面的停留时间
        this.commonUpData = {
            userId: utils.cookie.getItem('mall_userId') || '',          // 用户id
            sessionId: utils.cookie.getItem('sessionId') || '',         // 设备号
            plantform: utils.plantform() || '0',                        // 平台
            pageUrl: location.href,                                     // 当前页面地址
            pageName: document.title || '',                             // 当前页面的标题
            pageFrom: document.referrer || utils.storage.getFromSession('pageFrom') || '',     // 当前页面的来源
            pageToken: utils.uuid() || '',                              // 用来计算页面的停留时间
            eventType: '',                                              // 事件类型
            currentTime: new Date().getTime(),                          // 当前时间
            extraInfo: ''                                               // 扩展参数
        }

        // 定时器的实例
        this.intervalInstantiate = null 

        // 初始化的时候重置参数
        this._extraData(obj);
        
        // 生成唯一的设备id
        this._createSessionId();
    
        //对象初始化时改写history
        this._pageListener();  

        //声明式埋点初始化
        this._initClick();

    }
    
    // 作对象合并
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
            if(Object.prototype.toString.call(obj[item].constructor.prototype.addRoutes) === '[object Function]'){
                that[item] = obj[item]
            }else{
                if(that.hasOwnProperty(item)){
                    this._addNewData(that,obj,item)
                }else{
                    this._addNewData(that,obj,item)
                }
            }
        }
    }

    // 生成唯一的设备号存
    _createSessionId(){
        if(!utils.cookie.getItem('sessionId')){
            var sessionId = utils.uuid();
            this.commonUpData.sessionId = sessionId;
            utils.cookie.setItem('sessionId', sessionId, 30) 
        }
    }

    //改写history
    _pageListener(){
        var _wr = function(type) {
           var orig = history[type];
           return function() {
               var rv = orig.apply(this, arguments);
              var e = new Event(type);
               e.arguments = arguments;
               window.dispatchEvent(e);
               return rv;
           };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');
    }

    //定时上报
    _setInterval(cTime,obj){
        var that = this;
        that.pageVisit(obj);
        clearInterval(that.intervalInstantiate);
        that.intervalInstantiate = setInterval(()=>{
            that.pageVisit(obj);
        }, cTime);
    }

    //获取买单标签属性
    _getAttrByTreacker(e){
        var obj = {};
        obj.pageChannel = e.target.getAttribute('tracker-channel') || '';
        obj.pageName = e.target.getAttribute('tracker-pname') || '';
        obj.pagePosition = e.target.getAttribute('tracker-position') || '';
        obj.extraInfo = e.target.getAttribute('tracker-extra') || '';
        obj.currentTarget = e.target.nodeName;
        obj.eventType = 'click';
        if(obj.pageChannel || obj.pageName || obj.pagePosition || obj.extraInfo){
            return obj;
        }else{
            return false;
        }
    }

    /**
     * 声明式埋点
     * @method _initClick
     * @param {String}  页面频道(pageChannel)
     * @param {String}  页面名称(pageName)    
     * @param {String}  当前位置(pagePosition)
    */
    _initClick(){
        var that = this;
        window.addEventListener('click', function(e){
            var obj = that._getAttrByTreacker(e);
            if(obj){
                obj = Object.assign(that.commonUpData, obj);
                sendLog(that.sendUrl, obj);
            }
        }, false);
    }

    /**
     * PV事件
     * @method pageVisit
     * @param {Object} extraObj 需要额外上报的数据
     * 一般包括：
     * @param {String} - userId
     * @param {String} - sessionId
     * @param {String} - plantform
     * @param {String} - pageFrom
     * @param {String} - extraInfo
     */
    pageVisit(extraObj){
        let resObj = {};
        if(extraObj&&Object.prototype.toString.call(extraObj) != '[object Object]'){return}
        Object.assign(resObj,this.commonUpData,extraObj)
        resObj.eventType = TYPE.PV;
        sendLog(this.sendUrl,resObj);
    }

    /**
     * 自定义事件
     * @method clickHandler (obj)                 
     * @param {String} pageChannel     页面频道
     * @param {String} pagePosition    当前位置    
     * @param {String} currentTarget   当前标签
     * @param {String} eventType       事件类型
     * @param {String} extraInfo       额外信息
     */
    dipatch(obj){
        if(obj && Object.prototype.toString.call(obj) != '[object Object]') return;
        obj.extraInfo = obj.extraInfo ? utils.changeJSON2Query(obj.extraInfo) : '';
        obj = Object.assign(this.commonUpData, obj);
        sendLog(this.sendUrl, obj);
    }


    /**
     * 定时上报
     * @method setIntervalPv 
     * @param {Number} cTime    时间
     */
    setIntervalPv(cTime){
        let preUrl = '';
        utils.storage.set2Session('pageFrom', location.href);
        var that = this;
        //时间容错
        if(typeof cTime !== 'number' || isNaN(cTime) || cTime < 1000 ) return;
        //初始化时
        that._setInterval(cTime);
        //导航标签隐藏时
        utils.showState((isVisible)=>{
            if(isVisible === 'visible'){
                that._setInterval(cTime);
            }else{
                clearInterval(that.intervalInstantiate);
            }
        })
        //spa页面路由变化时
        window.addEventListener('replaceState', function(e) {
            that.commonUpData.pageToken = utils.uuid(); // 每次路由变化都要更改pageToken
            preUrl = utils.storage.getFromSession('pageFrom');
            utils.storage.set2Session('pageFrom', location.href);
            that._setInterval(cTime,{pageFrom: preUrl,pageUrl: location.href});
        });
        window.addEventListener('pushState', function(e) {
            that.commonUpData.pageToken = utils.uuid(); // 每次路由变化都要更改pageToken
            preUrl = utils.storage.getFromSession('pageFrom');
            utils.storage.set2Session('pageFrom', location.href);
            that._setInterval(cTime,{pageFrom: preUrl,pageUrl: location.href});
        });
    }

    
}


window.DFCollectSDK = DFCollectSDK;
