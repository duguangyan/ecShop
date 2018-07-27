const util = require('../../utils/util.js');

let invPayeeSave = '',
    invTaxSave = '';


Page({

    /**
     * 页面的初始数据
     */
    data: {

        isPerson: true,
        invPayee: '',
        invTax: '',


    },
    //   选择发票类型

    selectType(e) {

        console.log(e)

        let id = e.currentTarget.dataset.id;


        if (id === '1') {
            // 个人
            this.setData({
                isPerson: true
            })


        } else if (id === '2') {
            // 公司
            this.setData({
                isPerson: false
            })
            // 获取发票信息
            wx.chooseInvoiceTitle({
                success: (res) => {
                    console.log('发票信息',res);
                    this.setData({
                        invPayee: res.title,
                        invTax: res.taxNumber
                    })
                }
            });
            


        }

    },

    // 抬头
    invPayee(e) {
        let invPayee = e.detail.value;
        this.setData({
            invPayee
        })
    },
    // 识别号
    invTax(e) {
        let invTax = e.detail.value;
        this.setData({
            invTax
        })
    },
    // 保存
    submit() {
        // 获取页面栈
        let pages = getCurrentPages(),
            prevPage = pages[pages.length - 2];

        // 个人
        if (this.data.isPerson) {

            prevPage.setData({
                invoiceData: {
                    inv_type: 1,
                    inv_way: 1,
                    inv_payee: '个人',
                    inv_tax: '',
                }
            })

            wx.navigateBack({})


        } else {
            // 企业

            let invPayee = this.data.invPayee,
                invTax = this.data.invTax;

            if (invPayee.length === 0) {
                util.errorTips('请确认公司名称');
                return false
            }

            if (invTax.length === 0) {
                util.errorTips('请确认识别号');
                return false
            }

            prevPage.setData({
                invoiceData: {
                    inv_type: 2,
                    inv_way: 1,
                    inv_payee: invPayee,
                    inv_tax: invTax,
                    // 公司必填
                    // company_id: '',
                    // inv_receiving_id: ''
                }
            })

            // 保存识别号
            invPayeeSave = invPayee;
            invTaxSave = invTax;

            wx.navigateBack({})
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            invPayee: invPayeeSave,
            invTax: invTaxSave
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


})