const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        account: ''
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

        this.isBtnActive();
    },
    // 删除输入框
    delAccountNum() {

        this.setData({
            initialNum: '',
            account: '',
            isDel: false,
        })
        this.isBtnActive();
    },
    //密码
    password(e) {

        let password = e.detail.value;

        this.setData({
            password,

        })
        this.isBtnActive();

    },

    // 密码可见

    isVisible() {

        this.setData({
            visiblePWD: !this.data.visiblePWD,
        })

    },

    // 提交表单
    submitLogin() {

        let user_name = this.data.account,
            user_psw = this.data.password;

        // 可前台判断一下手机格式 util.vailPhone( num)
        const isMatch = util.vailPhone(user_name);

        if (!isMatch) {
            util.errorTips('请确认手机号！');
            return false;
        }

        api.login({
            method: 'POST',
            data: {
                user_name,
                user_psw
            }
        }).then((res) => {
            console.log(res);

            app.globalData.token = res.data;

            wx.setStorage({
                key: 'token',
                data: res.data,
            })

            wx.navigateBack();
            // wx.navigateTo({
            //     url: '../shoppingCart/shoppingCart',
            // })
            // wx.navigateTo({
            //     url: '../goodsDetail/goodsDetail?id=2'
            // })

        }).catch((res) => {

            util.errorTips(res.msg);
        })


    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // vailPhone()
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 判定按钮状态
    isBtnActive() {

        if (this.data.account && this.data.password) {
            this.setData({
                BtnActive: true
            })
        } else {
            this.setData({
                BtnActive: false
            })
        }
    }
})