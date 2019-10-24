import { utils } from './utils/utils'
import { PV } from './module/pagevisit'
import { clickHandler } from './module/clickHandler'
import { dispatch } from './module/dispatch'

class Collect {
    constructor(){
        this.version = '1.0.0';
        console.log('埋点的版本号：' + this.version);
        this.sendUrl = 'http://localhost:8088';
        this.mall_userId = utils.cookie.getItem('mall_userId') || '';
        this.commonUpData = {
            deviceId: '111',
            mall_userId: utils.cookie.getItem('mall_userId') || '',
            pageUrl: location.href,
            pageName: document.title || '',
            currentTime: new Date().getTime(),
            sessionId: utils.uuid(),
            from: document.referrer
        }
        this.pvSuccess = true;
        this.setPv = '';
        this.beginTime = ''; // onbeforeunload执行的开始时间


        //自定义事件初始化
        this.dispatch = dispatch;
        
        //点击事件初始化
        utils.on(document.body, 'click', clickHandler);

        //页面初始化
        utils.on(window,'load',(e) => {
            // 页面加载上报pv并记录当前
            utils.storage.set2Session('url',location.href)
            PV(this.sendUrl,this.commonUpData)
            // dealWithUrl(this.sendUrl,this.commonUpData)
            // PV(this.pvData,(res)=>{
            //     if(res != 200){
            //         this.pvSuccess = false;
            //     }
            // })
            // 轮询上报pv
            // this.setPv = setInterval(() => {
            //     this.pvData.currentTime = new Date().getTime();
            //     PV(this.pvData,(res)=>{
            //         if(res != 200){
            //             this.pvSuccess = false;
            //         }
            //     })
            // },5000)
        })
        window.onbeforeunload = function (){
            this.beginTime = new Date().getTime();
        };
        window.onunload = function () {
            let differTime = new Date().getTime() - this.beginTime;
            if (differTime <= 5) { // 页面关闭
                this.commonUpData.currentTime = new Date().getTime();
                PV(this.sendUrl,this.commonUpData)
            } else { // 页面刷新
                // this.commonUpData.currentTime = new Date().getTime();
                // dealWithUrl(this.sendUrl,this.commonUpData)
            }

        }

        utils.showState(()=>{
            // 最小化到最大化时pv的上报（这个需要不需要待商榷）
            // this.commonUpData.currentTime = new Date().getTime();
            // this.commonUpData.from = document.referrer;
            // dealWithUrl(this.sendUrl,this.commonUpData)
            // PV(this.pvData,(res)=>{
            //     if(res != 200){
            //         this.pvSuccess = false;
            //     }
            // })
        })

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
        utils.on(window, 'replaceState',(e)=>{
            this.commonUpData.from = utils.storage.getFromSession('url');
            utils.storage.set2Session('url',e.target.location.href)
            this.commonUpData.pageUrl = e.target.location.href;
            PV(this.sendUrl,this.commonUpData)
        })
        utils.on(window, 'pushState',(e)=>{
            this.commonUpData.from = utils.storage.getFromSession('url');
            utils.storage.set2Session('url',e.target.location.href)
            this.commonUpData.pageUrl = e.target.location.href;
            PV(this.sendUrl,this.commonUpData)
        })
    }
}


const DFcollect = new Collect();
if(!window.dfsite || Object.prototype.toString(window.dfsite) !== '[object Object]'){
    console.log("window.dfsite对象不存在或者非Object类型，重新创建");
    window.dfsite = Object.create(null);
}
window.dfsite.DFcollect = DFcollect;
export default DFcollect;

export {DFcollect};