const api = require('../../utils/api.js');
let firstIn = true;
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 设为默认
    setDefault(e) {
        console.log(e)
        let id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;

        api.setDefaultAddress({
            data: {
                address_id: id
            }
        }).then((res) => {

            // 默认地址
            let addressList = this.data.addressList;

            addressList.forEach((ele) => {
                if (ele.is_default == 1) {
                    ele.is_default = 0;
                }
            })

            addressList[index].is_default = 1;

            this.setData({
                addressList
            })

            wx.showToast({
                title: '已设为默认地址',
            })

        }).catch(() => {

        })


    },
    // 编辑
    edit(e) {
        let id = e.currentTarget.dataset.id;

        wx.navigateTo({
            url: `../newAddress/newAddress?type=edit&id=${id}`,
        })
    },

    // 删除
    del(e) {
        let id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;

        wx.showModal({
            title: '确定要删除吗？',
            content: '',
            confirmColor: '#C81A29',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定');
                    // 确定删除
                    api.deleteAddress({
                        data: {
                            address_id: id
                        }
                    }).then((res) => {

                        wx.showToast({
                            title: '删除成功',
                        })
                        // 获取列表数据
                        this.getAddressListData();


                    }).catch(() => {

                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })




    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 获取列表数据
        if (firstIn) {
            this.getAddressListData();

        }


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
        // 获取列表数据
        if (!firstIn) {
            this.getAddressListData();
        }
        firstIn = false;

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

    // 获取收货地址列表数据
    getAddressListData() {

        wx.showNavigationBarLoading();

        api.listAddress({

        }).then((res) => {

            console.log('地址执行')
            let addressList = res.data.list;

            let isEmpty = addressList.length == 0 ? true : false;

            this.setData({
                addressList,
                isEmpty
            })

        }).catch((res) => {

        }).finally(() => wx.hideNavigationBarLoading())

    }
})