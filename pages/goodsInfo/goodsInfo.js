// pages/goodsInfo/goodsInfo.js

const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: ['图文详情', '产品详情', '定制须知'],
        selectIDX: 0,
        purchaseNum: 1,
    },
    // tab栏选择
    selectTab(e) {
        console.log(e);
        let selectIDX = e.target.dataset.idx;

        this.setData({
            selectIDX
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {  
      // 来自促销页面
        if (options.sales){ 
          let fromSales = options.sales;
          this.data.id = options.id;
         
          this.setData({
            fromSales
          })
          // 获取数据
          this.getData(this.data.id);
        }
        
        // 将字符串转化为数组,将介绍切割成合适的格式
        let imgsrc = options.descimg.split(','),
            descstr = options.descstr.split(';').map((ele) => {
            return ele.split(':')
        })
   
        this.setData({
            imgsrc,
            descstr
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
      // 获取默认地址
      this.getDefaultAddress();
      
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

    getData(id){
      let fid = id;
      let data = {
        id : fid
      }
      api.getSalesCategoryDetail({
        data
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.setData({
            itemInfo: res.data,
          })

          // if (res.data.total == -1 || (parseInt(res.data.total) - parseInt(res.data.sale_volume)) > 0){
          //   this.setData({
          //     fromSales:0
          //   })
          // }
        }
      })
    },
    //  获取默认地址
    getDefaultAddress() {
      // 登录了才调用此接口
      let token = app.globalData.token;

      if (token) {
        // 获取默认地址
        api.defaultAddress({

        }).then((res) => {

          let defaultAddress = res.data;

          console.log('默认地址', defaultAddress)

          // 可能位空数组
          if (Array.isArray(defaultAddress)) {

            this.setData({
              defaultAddress: false,
              addressId: ''
            })

          } else {

            this.setData({
              defaultAddress,
              addressId: defaultAddress.id
            })

          }

        }).catch((res) => {

        })
      }
    },


    snapUp() {
      this.setData({
        isShow: true
      })
    },
    // 关闭购买窗
    close() {
      this.setData({
        isShow: false
      })
    },
    // 地址管理
    dealAddress(e) {

      let token = app.globalData.token;
      // 登录了才调用此接口

      if (!token) {
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

        return false;
      }

      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })

    },

    // 减少数量

    min() {

      let nowNum = this.data.purchaseNum;

      if (nowNum <= 1) {
        return false;
      }
      nowNum--;
      this.setData({
        purchaseNum: nowNum
      })

    },

    add() {

      let nowNum = this.data.purchaseNum;
      // 存储量
      let stocks = this.data.itemInfo.last_stock;
      let peopleLimit = this.data.itemInfo.people_limit;
      let unit_name = this.data.itemInfo.detail.sku[0].unit_name;
      if (peopleLimit != -1) {
        if (nowNum >= peopleLimit) {
          util.errorTips(`限购${peopleLimit}${unit_name}`)
          return false;
        }
        else if (nowNum >= stocks) {
          util.errorTips('已是最大库存量')
          return false;
        }
      }
      nowNum++;

      this.setData({
        purchaseNum: nowNum
      })

    },

    change(e) {
      let inputVal = e.detail.value.replace(/\b(0+)/gi, "");
      if (parseInt(inputVal) <= 0) {
        util.errorTips('购买数量必须大于等于1')
      }
      inputVal = parseInt(inputVal) <= 0 ? 1 : inputVal;
      let peopleLimit = this.data.itemInfo.people_limit;
      let unit_name = this.data.itemInfo.detail.sku[0].unit_name;
      if (inputVal.length === 0) {
        this.setData({
          purchaseNum: '1'
        })
      } else if (inputVal > peopleLimit && peopleLimit <= this.data.itemInfo.last_stock) {
        util.errorTips(`单次限购${peopleLimit}${unit_name}`)
        this.setData({
          purchaseNum: peopleLimit
        })
      }
      else if (inputVal > peopleLimit && peopleLimit > this.data.itemInfo.last_stock) {
        util.errorTips(`单次限购${peopleLimit}${unit_name}`)
        this.setData({
          purchaseNum: this.data.itemInfo.last_stock
        })
      }
      else if (inputVal > this.data.itemInfo.last_stock) {
        util.errorTips('超过最大库存量')
        this.setData({
          purchaseNum: this.data.itemInfo.last_stock
        })
      } else {
        this.setData({
          purchaseNum: inputVal
        })
      }
    },
    // 抢购
    purchase() {

      console.log('抢购');
      // 限制
      let receiving_id = this.data.addressId,
        number = this.data.purchaseNum,
        id = this.data.itemInfo.id;

      let token = app.globalData.token;
      // 登录了才会检测收货地址

      if (receiving_id == undefined) {
        util.errorTips('请填写收货地址')
        return false
      }


      // 禁止按钮
      this.setData({
        submitBtn: true
      })

      wx.showLoading({
        title: '处理中...',
      })

      api.getSalesMake({
        method: 'POST',
        data: {
          id,
          number,
          receiving_id,
          payment_id: '2'
        }
      }).then((res) => {
        wx.hideLoading();
        if (res.code == -1) {
          util.errorTips(res.msg);
          return false
        }
        // 发起微信支付
        wx.requestPayment({
          ...res.data.pay,
          method: "POST",
          success: (res) => {

            wx.reLaunch({
              url: `../index/index?redict=activecomplete`,
            })
            console.log('发起微信支付正确返回', res);

          },
          fail: (err) => {
            console.log('发起微信支付错误返回,取消事件', err);

            if (err.errMsg.indexOf('cancel') > -1) {

              wx.showModal({
                title: '温馨提示',
                content: '已生成订单，可前往订单列表继续支付',
                confirmText: '前往',
                confirmColor: '#c81a29',
                success: (res) => {

                  if (res.confirm) {
                    wx.reLaunch({
                      url: `../index/index?redict=activenotcomplete`,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })

              this.setData({
                purchaseNum: 1,
                isShow: false
              })

            } else {
              util.errorTips('支付失败')
            }
          }
        });

        // 更新信息
        //this.updataInfo()

      }).catch((err) => {

        wx.hideLoading();

        if (-401 !== err.code) {
          util.errorTips(err.msg);

          // 尚有订单未支付
          if (-2 === err.code) {
            wx.showModal({
              title: '温馨提示',
              content: '您尚有活动订单未结算，可前往订单列表完成支付',
              confirmText: '前往',
              confirmColor: '#c81a29',
              success: (res) => {

                if (res.confirm) {
                  wx.reLaunch({
                    url: `../index/index?redict=activenotcomplete`,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }

      }).finally(() => {

        // 延时激活按钮
        setTimeout(() => {
          this.setData({
            submitBtn: false
          })
        }, 300)

      })

    },
    // 商品详情
    goodsInfo() {

      // let goodsData = this.data.itemInfo.detail,
      //   descstr = goodsData.binds_str,
      //   srcList = [];

      // // 解析图片路径
      // goodsData.goods_desc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
      //   srcList.push(capture);
      // });

      // console.log('解析到的图片路径', srcList);
      // srcList = srcList.join(',');

      // wx.navigateTo({
      //   url: `../goodsInfo/goodsInfo?descimg=${srcList}&descstr=${descstr}`,
      // })
      wx.navigateTo({
        url: `../goodsInfo/goodsInfo?sales=1`,
      })
    },
    // 更新数据
    updataInfo(cb) {

      api.activity({
        data: {
          id: this.data.itemInfo.id
        }
      }).then((res) => {
        console.log('活动接口数据', res);

        let itemInfo = res.data;

        // 兼容苹果时间格式
        itemInfo.isActiveEnd = (Date.parse(itemInfo.now_date.replace(/-/g, '/')) - Date.parse(itemInfo.end_date.replace(/-/g, '/')) > 0) || itemInfo.last_stock <= 0;

        itemInfo.isActiveTimeEnd = (Date.parse(itemInfo.now_date.replace(/-/g, '/')) - Date.parse(itemInfo.end_date.replace(/-/g, '/')) > 0) ? '活动结束' : '已抢完,活动结束';

        // 转换日期 开始时间
        let beginData = new Date(itemInfo.begin_date.replace(/-/g, '/'));

        itemInfo.beginData = beginData.getFullYear() + '年' + (beginData.getMonth() + 1) + '月' + beginData.getDate() + '日';
        // 转换日期 结束时间
        let endData = new Date(itemInfo.end_date.replace(/-/g, '/'));

        itemInfo.endData = endData.getFullYear() + '年' + (endData.getMonth() + 1) + '月' + endData.getDate() + '日';

        // 更新数据
        this.setData({
          itemInfo
        })

      }).finally(() => {
        cb && cb()
      })

    }

})