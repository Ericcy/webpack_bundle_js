import { utils } from './utils/utils'
import { PV } from './module/pagevisit'

class Collect {
    constructor(){
        this.version = '1.0.0';
        console.log('埋点的版本号：' + this.version);
        this.mall_userId = '';
        this.pageUrl = location.href;
        this.pageName = document.title || '';
        this.pvSuccess = true;
        this.currentTime = new Date().getTime();
        this.sessionId = utils.uuid()
        this.setPv = '';

        this.pvData = {
            sessionId: utils.uuid(),
            userid: '',
            pageName: document.title || '',
            pageUrl: location.href,
            currentTime: new Date().getTime()
        };

        this.beginTime = ''; // onbeforeunload执行的开始时间

        utils.on(window,'load',(e) => {
            // 页面加载上报pv
            PV(this.pvData,(res)=>{
                if(res != 200){
                    this.pvSuccess = false;
                }
            })
            // 轮询上报pv
            // this.setPv = setInterval(() => {
            //     PV(pvData,(res)=>{
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
                PV(this.pvData,(res)=>{
                    if(res != 200){
                        this.pvSuccess = false;
                    }
                })
            } else { // 页面刷新
                PV(this.pvData,(res)=>{
                    if(res != 200){
                        this.pvSuccess = false;
                    }
                })
            }

        }

        utils.showState(()=>{
            // 最小化到最大化时pv的上报（这个需要不需要待商榷）
            PV(this.pvData,(res)=>{
                if(res != 200){
                    this.pvSuccess = false;
                }
            })
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