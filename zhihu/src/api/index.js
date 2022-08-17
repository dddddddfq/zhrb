import axios from "./http";

export default {
    //获取今日新闻 
    queryNewsLatest() {
        return axios.get('/api/news_latest');
    },
    //获取今日新闻 
    queryNewsBefore(time) {
        return axios.get('/api/news_before', {
            params: {
                time
            }
        })
    },
    //获取新闻详情
    queryNewsInfo(id) {
        return axios.get('/api/news_info', {
            params: {
                id
            }
        })
    },
    //获取新闻点赞信息
    queryNewsStory(id) {
        return axios.get('/api/story_extra', {
            params: {
                id
            }
        })
    },
    //用户登录
    login(phone, code) {
        return axios.post('/api/login', {
            phone, code
        })
    },
    //获取手机验证码
    phoneCode(phone) {
        return axios.post('/api/phone_code', {
            phone
        })
    },
    // ___________________________________________________________________________
    // 以下接口需要在请求头中携带三个信息
    //      authorzation: token「客户端登录成功后存储在本地的令牌信息(从服务器获取)」
    //      time: 时间戳
    //      sign: 签名信息「客户端基于md5，把token和时间戳进行加密生成(加密规则：md5(token@time @zhufeng))」
    //检测是否登录 
    isLogin() {
        return axios.get('/api/check_login');
    },
    //获取登陆者信息
    userInfo() {
        return axios.get('/api/user_info');
    },
    // 修改用户信息
    userUpdate(username, file) {
        let fm = new FormData();
        fm.append("username", username);
        fm.append("file", file);
        return axios.post('/api/user_update', fm);
    },
    // 收藏新闻  /store  POST 
    store(newsId) {
        return axios.post('/api/store',
            {
                newsId
            });
    },
    // 移除收藏  /store_remove  GET
    storeRemove(id) {
        return axios.get('/api/store_remove',{
          params:{
            id
          }
          
        });
    },
    // 获取登录者收藏列表  /store_list  GET
    storeList() {
        return axios.get('/api/store_list')
    },
}