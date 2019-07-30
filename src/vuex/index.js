import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        account: Cookies.get('username'),
        loginTime: Cookies.get('logTime'),
        pomainContent: null,
    },
    mutations: {
        setAcc(state, item) {
            if (item.username) {
                Cookies.set('username', item.username)
                Cookies.set('logTime', item.logTime)
                // console.log(item.models)
                Cookies.set('models', item.models)
                state.account = item.username
                state.loginTime = item.logTime
            } else {
                state.account = item.username
            }
        },
        edit(state, parma) {
            state.pomainContent = parma
            // console.log('----',state.pomainContent)
        }
    },
    actions: {
        check(context, payload) {
            //定义promise对象，返回（正确/错误 的情况），从而使login页能改变路由
            return new Promise((resolve, reject) => {
                //post请求的格式
                axios.post('/api/sys/login', `username=${payload.username}&password=${payload.userpwd}`).then((res) => {
                    if (res.data.status == 3) {
                        reject(res.data.statusInfo)
                    } else if (res.data.status == 2) {
                        //请求成功，则提交username的值给到mutations中，并且返回给了login页面
                        resolve()
                        let models = res.data.data.models.map(item => {
                            return item.modelName
                        })

                        context.commit({ type: 'setAcc', username: payload.username, logTime: payload.logTime ,models:models})
                    } else if (res.data.status == 4) {
                        reject(res.data.statusInfo)
                    } else if (res.data.status == 1) {
                        reject(res.data.statusInfo)
                    }
                    else {
                        reject('服务器异常')
                    }
                }).catch()
            })
        },
        removeCookie(context) {
            
            Cookies.remove('logTime')
            Cookies.remove('username')
            Cookies.remove('models')
            context.commit('setAcc', '')
        },
        editPomain(context, parma) {
            // console.log(parma)
            context.commit('edit', parma)
        }
    }
})

export default store