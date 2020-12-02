import axios from 'axios'
import request from '@/utils/request'
import {
    getToken
} from '@/utils/auth'

// this.$hyUpload(data).then(res => {})

const hyUpload = (data) => {

    return request({
        url: process.env.VUE_APP_BASE_API + '/file/upload',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getToken()
        },
        data: data
    })


}
export default hyUpload