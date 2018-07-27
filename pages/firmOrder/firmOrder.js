const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        //发票信息
        invoiceData: {
            inv_type: 1,
            inv_way: 1,
            inv_payee: '个人',
            inv_tax: '',
        },

    },
    submitOrder() {

        // 禁止提交按钮，防止多次提交
        this.setData({
            hasSubmit: true
        })

        //    会员用户不传发票信息

        if (this.data.demandPrice != 0) {
            // 非会员用户
            let formData = { ...this.data.invoiceData, ...this.data.orderData };

            // 提交form表单
            api.addDemand({
                method: "POST",
                data: formData
            }).then((res) => {

                // 提交成功，清空上个页面栈信息  获取页面栈
                let pages = getCurrentPages(),
                    prevPage = pages[pages.length - 2];
                // console.log('上个页面栈', prevPage);
                prevPage.setData({
                    descValue: '',
                    files: [{}, {}, {}],
                    selcetTabNum: '1',
                })

                console.log('套餐表单表单需求提交', res);

                wx.redirectTo({
                    url: `../onlinePayment/onlinePayment?type=find&id=${res.data.id}&sn=${res.data.id}&amount=${res.data.pay_fee}`,
                })

            }).catch((err) => {

                util.errorTips(err.msg);

            }).finally(() => {

                this.setData({
                    hasSubmit: false
                })
            })
        } else {
            // 会员用户,跳转
            let formData = { ...this.data.orderData };

            api.addDemand({
                method: "POST",
                data: formData
            }).then((res) => {

                // 提交成功，清空上个页面栈信息  获取页面栈
                let pages = getCurrentPages(),
                    prevPage = pages[pages.length - 2];
                // console.log('上个页面栈', prevPage);
                prevPage.setData({
                    descValue: '',
                    files: [{}, {}, {}],
                    selcetTabNum: '1',
                })

                console.log('表单需求提交', res)
                wx.redirectTo({
                    url: `../payFindSuccess/payFindSuccess?id=${res.data.id}&sn=${res.data.id}&amount=${res.data.pay_fee}&membertype=member`,
                })

            }).catch((err) => {

            }).finally(() => {

                this.setData({
                    hasSubmit: false
                })

            })

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if (options.type == 1) {
            // 图片照样
            let imgArr = app.globalData.orderArr.join(',').split(',');
            console.log(imgArr)
            this.setData({
                imgArr
            })
        }

        // 传递form表单数据
        let orderData = JSON.parse(options.data);

        // 传递页面表单参数 分类描述 价格 找料方式
        this.setData({
            orderData,
            desc: options.desc,
            range: options.range,
            cname: options.cname,
            type: options.type
        })

        // 获取默认地址
        let address = api.defaultAddress({

        }).then((res) => {
          
            let defaultAddress = res.data;
            // 可能位空数组
            this.setData({
                defaultAddress,
                addressId: defaultAddress.id
            })
        })

        // 获取价格
        let price = api.demandPrice({

        }).then((res) => {
         
            let demandPrice = res.data.pay_fee;

            this.setData({
                demandPrice
            })

        }).catch(() => {

        })

        // 获取用户vip信息
            let info = api.memberInfo({

            }).then((res) => {
                console.log('用户信息 = ', res);
                app.globalData.memberInfo = res.data;

                let isVip = res.data.is_find_vip;
                // 0 number 不是vip  1是vip；
                this.setData({
                    isVip
                })

            }).catch(() => {

            })

        // 等待返回可开放按钮点击
        Promise.all([address, price, info]).then(function (values) {
            console.log('promise ', values)
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
        // 清除全局的数据
        app.globalData.orderArr = null;
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