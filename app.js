const api = require('./utils/api.js');
let onfire = require('./utils/onfire.js');
var aldstat = require('./utils/ald-stat.js');

App({
    onLaunch: function () {
        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs);

        // 版本更新
        if (wx.getUpdateManager) {

            const updateManager = wx.getUpdateManager();
            console.log('updata version', updateManager);

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            })

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })

            })
        }

        // 获取用户信息
        const memberInfo = () => {

            api.memberInfo({

            }).then((res) => {
                console.log('用户信息 = ', res);
                this.globalData.memberInfo = res.data;
                let data = res.data;
                // 绑定事件

                setTimeout(() => {
                    console.log('打印this', this)

                }, 2000);

                onfire.on('getMemberInfo', function (data) {

                    wx.showToast({
                        title: '事件订阅触发',
                    })

                })

            }).catch(() => {

            })
        }

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                console.log('code = ', res)

                if (res.code) {

                    api.wxLogin({
                        data: {
                            code: res.code
                        }
                    }).then((res) => {
                        // 检测已经绑定，自动登录
                        console.log('登录状态 0', res, res.data);
                        this.globalData.token = res.data;
                        // wx.setStorage({
                        //     key: 'token',
                        //     data: res.data,
                        // })
                        wx.setStorageSync('token', res.data);

                        // 获取用户信息
                        memberInfo();
                        // 获取购物车数量
                        this.getCartNum()

                    }).catch((res) => {
                        console.log('没有自动登录状态之外', res);
                        if (200 === res.code) {
                            // 第一次进入
                            console.log('成功返回sessionkey = ', res);
                            let sessionKey = res.data.session_key;

                            wx.setStorage({
                                key: 'id',
                                data: res.data.id,
                            })
                            // 调用微信授权框

                            wx.getSetting({
                                success: res => {
                                    console.log(res);
                                    if (!res.authSetting['scope.userInfo']) {
                                    }
                                }
                            })

                            wx.getUserInfo({
                                success: res => {
                                    // 可以将 res 发送给后台解码出 unionId
                                    this.globalData.userInfo = res.userInfo;
                                    console.log(this.globalData.userInfo, res)

                                    let iv = res.iv,
                                        encryptedData = res.encryptedData;

                                    api.wxDatacrypt({
                                        data: {
                                            iv,
                                            encryptedData,
                                            sessionKey
                                        }
                                    }).then((res) => {
                                        // 授权
                                        console.log('授权返回信息 = ', res.data);
                                        this.globalData.token = res.data;
                                        wx.setStorage({
                                            key: 'token',
                                            data: res.data,
                                        })
                                        // 更新用户信息
                                        memberInfo();
                                        // 获取购物车数量
                                        this.getCartNum()

                                    }).catch((res) => {

                                        if (-1 === res.code) {
                                            // 未绑定，记录id ，去绑定
                                            wx.setStorage({
                                                key: 'id',
                                                data: res.data,
                                            })
                                            wx.navigateTo({
                                                url: '../associatedAccount/associatedAccount',
                                            })
                                        }

                                    })

                                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                    // 所以此处加入 callback 以防止这种情况
                                    if (this.userInfoReadyCallback) {
                                        this.userInfoReadyCallback(res)
                                    }
                                },
                                fail(err) {

                                }
                            })


                        }

                        // 第二次进入，检测绝对没有绑定，获取id，用于绑定
                        else if (-1 === res.code) {
                            console.log('登录状态 -1 == ', res.data);
                            wx.setStorage({
                                key: 'id',
                                data: res.data,
                            })
                            wx.navigateTo({
                                url: '../associatedAccount/associatedAccount',
                            })

                        } else if (-2 === res.code) {
                            //解密失败  {code: -2, msg: "encodingAesKey 非法", data: ""
                        }
                    })
                }

            }
        })

    },

    onShow(options) {
        // console.log('ApponShow数据', options)

        // if (options && options.path === 'pages/luSouTab/luSouTab' && options.referrerInfo && options.referrerInfo.appId) {

        //     this.globalData.backMini = true;

        //     wx.switchTab({
        //         url: this.globalData.backUrl,
        //     })

        //     // wx.navigateTo({
        //     //     url: '../goodsDetail/goodsDetail',
        //     // })
        // } else {
        //     this.globalData.backMini = false;
        // }


    },
    /**
    * 当小程序从前台进入后台，会触发 onHide
    */
    onHide: function () {
        // var i = 0;
        // setInterval(function () {
        //     i++;
        //     wx.setTopBarText({
        //         text: "aaaa" + i,
        //         success: function (res) {
        //             console.log(res);
        //         },
        //         fail: function (res) {
        //             console.log(res);
        //         }
        //     });
        // }, 6000);
    },
    // 设置登录状态缓存
    setTokenStorage() {

    },

    // 获取购物车数量
    getCartNum() {

        api.cartNumber(

        ).then((res) => {

            this.globalData.cartNum = res.data;

            if (!!res.data) {
                // 存在显示
                wx.setTabBarBadge({
                    index: 1,
                    text: `${res.data}`
                })
            }

        }).catch((res) => {

        })
    },

    globalData: {
        userInfo: null,
        categoryListData: [],
        backUrl: '../index/index'
    }
})