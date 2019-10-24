import { utils } from './utils/utils'
import { PV } from './module/pagevisit'
import { dealWithUrl } from './module/send'
import { clickHandler } from './module/clickHandler'
import { dispatch } from './module/dispatch'

class Collect {
    constructor(){
        this.version = '1.0.0';
        console.log('埋点的版本号：' + this.version);
        this.sendUrl = 'http://10.8.6.6';
        this.mall_userId = utils.cookie.getItem('mall_userId') || '';
        this.pageUrl = location.href;
        this.pageName = document.title || '';
        this.pvSuccess = true;
        this.currentTime = new Date().getTime();
        this.sessionId = utils.uuid()
        this.setPv = '';

        this.pvData = {
            sessionId: utils.uuid(),
            userid: utils.cookie.getItem('mall_userId') || '',
            pageName: document.title || '',
            pageUrl: location.href,
            currentTime: new Date().getTime()
        };
        this.beginTime = ''; // onbeforeunload执行的开始时间


        //自定义事件初始化
        this.dispatch = dispatch;
        
        //点击事件初始化
        utils.on(document.body, 'click', clickHandler);

        //页面初始化
        utils.on(window,'load',(e) => {
            // 页面加载上报pv
            dealWithUrl(this.sendUrl,this.pvData)
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
                this.pvData.currentTime = new Date().getTime();
                dealWithUrl(this.sendUrl,this.pvData)
            } else { // 页面刷新
                this.pvData.currentTime = new Date().getTime();
                dealWithUrl(this.sendUrl,this.pvData)
            }

        }

        utils.showState(()=>{
            // 最小化到最大化时pv的上报（这个需要不需要待商榷）
            this.pvData.currentTime = new Date().getTime();
            dealWithUrl(this.sendUrl,this.pvData)
            // PV(this.pvData,(res)=>{
            //     if(res != 200){
            //         this.pvSuccess = false;
            //     }
            // })
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