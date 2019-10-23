import { http } from './module/http'
import { utils } from './utils/utils'

class Collect {
    constructor(){
        this.version = '1.0.0';
        console.log('埋点的版本号：' + this.version);
        this.pageUrl = location.href;
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