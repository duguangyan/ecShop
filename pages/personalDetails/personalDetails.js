let app = getApp();
const api = require('../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 性别默认选项
        region: ["男", "女", "未定"],
        index: 2

    },
    test () {

        wx.showActionSheet({
            itemList: ['男','女','未知'],
            success: function (res) {
                console.log(res, res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })

    },

    //   选择头像
    chooseImage(e) {

        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                this.setData({
                    files: res.tempFilePaths
                });
            }
        })

    },
    // 性别选择

    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);

        let index = e.detail.value;

        // 修改信息接口
        api.modifyMemberInfo({

        })

        this.setData({
            index: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let memberInfo = app.globalData.memberInfo;

        this.setData({
            memberInfo
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