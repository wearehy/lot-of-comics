
const crud= {
    //标题
    title:'',
    //表单
    form:{},
    // 等待时间
    time: 50,
    msg: {
      submit: '提交成功',
      add: '新增成功',
      edit: '编辑成功',
      del: '删除成功'
    },
    page: {
      // 页码
      page: 0,
      // 每页数据条数
      size: 10,
      // 总数据条数
      total: 0
    },
    // 整体loading
    loading: true,
    //diaolog 弹出层
    dialog:false,
  }

  export default crud