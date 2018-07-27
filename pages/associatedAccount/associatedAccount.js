const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
let app = getApp();

let needShouquan = false;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        agree: true,
        isMember: true
    },
    // 手机账号
    mobile(e) {

        let account = e.detail.value;
        if (account.length > 0) {
            this.setData({
                isDel: true,
                account,
            })
        } else {
            this.setData({
                isDel: false,
                account,
            })
        }
        // 判断用户状态

        if (account.length === 11) {

            api.memberExit({
                method: 'POST',
                data: {
                    user_name: account
                }
            }).then((res) => {

                console.log('用户已存在!');

                // 设置密码隐藏
                this.setData({
                    isMember: true
                })

            }).catch((res) => {
                // 用户不存在res.msg

                if (-1 === res.code) {
                    console.log('用户不存在!');
                    // 设置密码显示
                    this.setData({
                        isMember: false
                    })

                }
            })

        }

    },
    // 删除输入框
    delAccountNum() {

        this.setData({
            initialNum: '',
            account: '',
            isDel: false,
        })


    },
    // 获取手机验证码
    getSMS() {

        let account = this.data.account;

        if (!account) {
            util.errorTips('请填写手机号码');
            return false;
        }

        const isMatch = util.vailPhone(account);

        if (isMatch) {
            this.setData({
                smsStatus: true,
            })

            api.regSMS({
                data: {
                    phone: account
                }
            }).then((res) => {
                // 短信发送成功，限制按钮
                util.successTips('短信发送成功');
                this.setData({
                    smsID: res.data
                })
                // 倒计时60s
                let second = 60;
                const timer = setInterval(() => {

                    second--;

                    let smsText = `${second}s后重新发送`;
                    this.setData({
                        smsText
                    })

                    if (second == 1) {
                        this.setData({
                            smsStatus: false,
                            smsText: false
                        })
                        clearInterval(timer)
                    }

                }, 1000)

            }).catch((res) => {

                util.errorTips('短信发送失败');
                this.setData({
                    smsStatus: false,
                })

            })


        } else {
            util.errorTips('请确认手机号码');
        }

    },

    // 验证码
    sms(e) {
        let sms = e.detail.value;

        this.setData({
            sms,
        })

    },

    //密码
    password(e) {

        let password = e.detail.value;

        this.setData({
            password,
        })



    },

    // 密码可见

    isVisible() {

        this.setData({
            visiblePWD: !this.data.visiblePWD,
        })

    },
    // 协议同意

    isAgree(e) {

        this.setData({
            agree: !this.data.agree
        })


    },
    //确保获取用户信息
    userInfoHandler(e) {
        console.log(e)

    },

    // 提交表单
    regSubmit() {

        // 确认授权

        if (needShouquan) {

            wx.getSetting({
                success: (res) => {
                    console.log('检测授权信息', res);
                    var authSetting = res.authSetting;

                    if (authSetting['scope.userInfo'] === false) {

                        wx.showModal({
                            title: '温馨提示',
                            content: '为了更好的服务，需要请开启您授权用户信息权限',
                            showCancel: false,
                            success: () => {

                                wx.openSetting({
                                    success: (res) => {
                                        console.log(res)
                                        if (res.authSetting["scope.userInfo"]) {
                                            //这里是授权成功之后 填写你重新获取数据的js,调用解密信息接口
                                            needShouquan = false;
                                            wx.showToast({
                                                title: '设置成功',
                                            })

                                        }
                                    }
                                })

                            }
                        })

                    }
                }
            })

            return false;
        }

        console.log(this.data.account, this.data.password, this.data.sms, this.data.agree);

        let data = this.data,
            account = data.account || '',
            smsID = data.smsID,
            sms = data.sms || '',
            password = data.password || '',
            agree = data.agree;


        // 再次验证手机号
        const isMatch = util.vailPhone(account);

        if (!isMatch) {
            util.errorTips('请确认手机号码');
            return false;
        }

        if (sms.length !== 4) {
            util.errorTips('请确认验证码');
            return false;
        }


        // 会员用户
        let data2 = {};
        data2.id = wx.getStorageSync('id') || '';
        data2.user_name = account;
        data2.sms_id = smsID;
        data2.code = sms;

        // 未注册用户
        if (!this.data.isMember) {

            if (password.length < 6) {
                util.errorTips('密码长度不符');
                return false
            }

            if (!agree) {
                util.errorTips('请同意协议');
                return false
            }

            data2.user_psw = password;
        }

        // 请求
        api.associateAccount({
            data: data2
        }).then((res) => {

            console.log(res);

            util.successTips('绑定成功');
            app.globalData.token = res.data;
            wx.setStorage({
                key: 'token',
                data: res.data,
            })

            wx.navigateBack();

        }).catch((res) => {
            // 返回错误信息
            console.log(res)
            if (-1 === res.code) {
                // 手机号码已绑定,请退出并删除小程序，重新进入，允许用户授权自动登录
                // wx.showModal({
                //     title: '温馨提示',
                //     content: '该手机号码已绑定,请退出并删除小程序，重新进入，允许用户授权以便自动登录',
                //     showCancel: false,
                //     success: () => {

                //     }
                // })

            }
            util.errorTips(res.msg)
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('关联账号onLoad');
        // return false;
        wx.getSetting({
            success: (res) => {
                console.log('检测授权信息', res);
                var authSetting = res.authSetting;

                if (authSetting['scope.userInfo'] === false) {
                    // 之前拒绝授权
                    needShouquan = true;

                    console.log(' false 拒绝授权');

                } else if (JSON.stringify(authSetting) === '{}') {
                    // 之前没有授权过
                    console.log('{} 之前没有授权过');
                    this._getUserInfo();


                } else if (authSetting['scope.userInfo'] === true) {

                    console.log('授权成功的状态')

                }
            }
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {



    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    // 获取授权信息
    _getUserInfo() {
        // 解密信息接口
        const deciphering = (sessionKey) => {

            wx.getUserInfo({
                success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    app.globalData.userInfo = res.userInfo;
                    console.log(app.globalData.userInfo, res)

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


                    }).catch((res) => {

                        // 解密
                        console.log('解密 = ', res.data);
                    })

                }
            })


        }

        wx.login({
            success: res => {
                if (res.code) {

                    api.wxLogin({
                        data: {
                            code: res.code
                        }
                    }).then((res) => {
                        // 获取sessionKey值
                        // console.log('解密code返回', res);
                        // deciphering(sessionKey);

                    }).catch((err) => {
                        // 获取sessionKey值
                        let sessionKey = err.data.session_key;

                        deciphering(sessionKey);

                    })

                }

            }
        })

    }

})