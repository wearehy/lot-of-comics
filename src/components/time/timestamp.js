// this.$timestamp.time1       年月日 时分秒
// this.$timestamp.time2       年月日

const timer = {}
timer.time1 = (time) => {
    if(!time||time == 'N/A'){
        return 'N/A'
    }else{
        let times = new Date( time*1000 );
        let YY = times.getFullYear();
        let MM = times.getMonth() + 1;
        let DD = times.getDate();
        let hh = times.getHours();
        let mm = times.getMinutes();
        let ss = times.getSeconds();
        if(MM<10){MM = '0'+MM}
        if(DD<10){DD = '0'+DD}
        if(hh<10){hh = '0'+hh}
        if(mm<10){mm = '0'+mm}
        if(ss<10){ss = '0'+ss}

        return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
    }
        
}
timer.time2 = (time) => {
    if(!time||time=='N/A'){
        return 'N/A'
    }else{
        let times = new Date( time*1000 );
        let YY = times.getFullYear();
        let MM = times.getMonth() + 1;
        let DD = times.getDate();
        let hh = times.getHours();
        let mm = times.getMinutes();
        let ss = times.getSeconds();
        if(MM<10){MM = '0'+MM}
        if(DD<10){DD = '0'+DD}
        if(hh<10){hh = '0'+hh}
        if(mm<10){mm = '0'+mm}
        if(ss<10){ss = '0'+ss}

        return `${YY}-${MM}-${DD}`;
    }
    
}

export default timer