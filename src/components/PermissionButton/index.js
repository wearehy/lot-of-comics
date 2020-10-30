import store from '@/store'


const search = (binding) => {
  const  value  = binding
  const roles = store.getters && store.getters.roles
  if (value) {
    
    if ( roles.indexOf(value) != -1 ) {
      //存在时 disabled 为 false ，按钮正常使用
      return false;
    }else{
      return true;
    }
  } else {
    
  }
}

export default search
