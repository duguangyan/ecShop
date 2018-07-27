let app = getApp();
const api = require('../../utils/api.js');
let onfire = require('../../utils/onfire.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {

        orderTab: [{
            id: 1,
            name: '待审核'
        }, {
            id: 2,
            name: '待付款'
        }, {
            id: 3,
            name: '待收货'
        }, {
            id: 4,
            name: '已完成'
        }],


    },
    // 修改个人资料
    modifyInfo() {

        wx.navigateTo({
            url: '../personalDetails/personalDetails',
        })

    },
    // 开通续费会员操作
    memberService (e) {

        let type = e.currentTarget.dataset.type;
        
        if(type === 'open'){
            wx.navigateTo({
                url: '../rechargePackage/rechargePackage',
            })
        } else if (type === 'renewal') {
            wx.navigateTo({
                url: '../rechargePackage/rechargePackage',
            })
        }

    },
    // 商品订单跳转
    toMyOrder(e) {

        console.log(e.currentTarget.dataset.id);
        let statusID = e.currentTarget.dataset.id;

        let token = app.globalData.token;

        console.log(token);

        if (token) {
            wx.navigateTo({
                url: `../myOrder/myOrder?status=${statusID}`,
            })
        } else {
            wx.showModal({
                title: '您尚未登录',
                content: '是否前往登录页面',
                confirmText: '前往',
                confirmColor: '#c81a29',
                success: (res) => {

                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../associatedAccount/associatedAccount',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },

    // 增票资质 自我增加

    collatingTickets() {
        
        wx.getSetting({
            success: res => {
                console.log(res);
                if (res.authSetting['scope.invoiceTitle'] === false) {

                    wx.showModal({
                        title: '温馨提示',
                        content: '为了更好的服务，需要请开启您授权发票抬头信息权限',
                        showCancel: false,
                        success: () => {

                            wx.openSetting({
                                success: (res) => {
                                    console.log(res)
                                    if (res.authSetting["scope.userInfo"]) {
                                        //这里是授权成功之后 填写你重新获取数据的js,调用解密信息接口
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

        wx.chooseInvoiceTitle({ });

    },

    // 索样开发中展示
    developing() {

        wx.showToast({
            title: '功能开发中',
            image: '../../images/icons/error.png',
            duration: 1500
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {




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

        //onfire.fire('getMemberInfo', 'data');
        
        // 设置小程序返回页面
        //app.globalData.backUrl = this.route.replace('pages', '..');


        // 更新用户信息
        let memberInfo = app.globalData.memberInfo;
        console.log(memberInfo)
        if (!!memberInfo) {

            this.setData({
                memberInfo
            })

        } else {

            // 用于注册返回更新用户状态
            let token = wx.getStorageSync('token');
            if (!!token) {

                api.memberInfo({

                }).then((res) => {
                    console.log('用户信息 = ', res);
                    app.globalData.memberInfo = res.data;
                    this.setData({
                        memberInfo: res.data
                    })
                }).catch((res)=>{
        
                })
            }

        }

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

    }
})