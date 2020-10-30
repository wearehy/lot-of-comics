import axios from 'axios'
import { getToken } from '@/utils/auth'

// this.$hyUpload(data).then(res => {})

const hyUpload = (data) => {
    return new Promise((resolve, reject) => {
        //这里可以在调用的时候看到你的method、url、data、headers等参数
        //console.log(newOptions);
        axios
            .post(process.env.VUE_APP_BASE_API + '/upload', data, {
                contentType: false,
                processData: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: getToken()
                }
            })
            .then(res => {
                if (res.status == 200) {
                    //这里我们只需要获取返回的data中的数据即可
                    resolve(res.data.data);
                } else {
                    reject(res.data.data);
                }
            }).catch(err => {
                reject(err);
            })
    });
}
export default hyUpload
