
export default {
    //获取当前时间
    getTime: function () {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();
        return year + "-" + this.rootTime(month) + "-" + this.rootTime(day) + " " + this.rootTime(hour) + ":" + this.rootTime(mm) + ":" + this.rootTime(ss);
    },
    getDate: function () {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1;
        let day = now.getDate();
        return year + "-" + this.rootTime(month) + "-" + this.rootTime(day)
    },
    //显示数据化时间作为编号
    timeId: function () {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();
        return year + this.rootTime(month) + this.rootTime(day) + this.rootTime(hour) + this.rootTime(mm) + this.rootTime(ss);
    },
    //时间格式化
    rootTime: function (num) {
        let rtime
        num >= 10 ? rtime = num : rtime = "0" + num;
        return rtime
    },
    payFun(val){
        switch(val){
            case 1 : return '货到付款' ;
            case 2 : return '款到发货' ;
            case 3 : return '预付款到发货' ;
        }
    },
    statusFun(val){
        switch(val){
            case 1 : return '新增' ;
            case 2 : return '已收货' ;
            case 3 : return '已付款' ;
            case 4 : return '已了结' ;
            case 5 : return '已预付' ;
        }
    },
    

}