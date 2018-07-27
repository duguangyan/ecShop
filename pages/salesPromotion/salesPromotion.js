// pages/salesPromotion/salesPromotion.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:'',       // 分类 默认无 全部
    column_id:1,  // 1.今日爆款  2.热卖爆款
    page:1,       // 列表页数
    isPullDown:false, // 否试到下来位置
    purchaseNum:1,
    topNav: ['今日特惠','热卖爆款'],
    topNavIndex:0,
    bottomNavIndex1:0,
    bottomNavIndex2: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取活动列表
    this.getSalesList();
    
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
    console.log('----------------------到底部了1----------------------');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 获取分类信息
  getSalesCategory(){
    api.getSalesCategory({}).then((res)=>{
      console.log(res);
      if(res.code==0){
        let category = res.data;
        this.setData({
          category
        })
      }
    })
  },
  snapUpOver(){
    return false;
  },
  // 获取活动产品列表
  getSalesList(){
    this.setData({
      isLoadMore:false
    })
    wx.showLoading({
      title: '加载中...',
    })
    let data = { };
    api.getSalesList({
      data
    }).then((res)=>{   
      console.log(res);
      if(res.code==0){
        let hot = res.data.hot;
        let today = res.data.today;
        let hot_category = res.data.hot_category;
        let today_category = res.data.today_category;


        let hots = hot;
        let todays = today;
        // let hots = [];
        // let todays = [];
        // let today_category_id = today_category[0].id;
        // let hot_category_id = hot_category[0].id;  
        // hot.forEach((v, i) => { 
        //   if (v.cat_id == hot_category_id){
        //     hots.push(v);
        //   }
        //   if (v.total <= -1) {
        //   } else {
        //     if ((parseInt(v.total) - parseInt(v.sale_volume)) == 0) {
        //       hot[i].isOver = true;
        //     }
        //   }
        // })

        // today.forEach((v, i) => {
        //   if (v.cat_id == today_category_id) {
        //     todays.push(v);
        //   }
        //   if (v.total <= -1) {
        //   } else {
        //     if ((parseInt(v.total) - parseInt(v.sale_volume)) == 0) {
        //       today[i].isOver = true;
        //     }
        //   }
        // })

        
        console.log(hots);

        this.setData({
          hot,
          today,
          hots,
          todays,
          hot_category,
          today_category
        })
        
        console.log(this.data.hot_category);
        console.log(this.data.today_category);
        wx.hideLoading();
      }else{
        wx.hideLoading();
        util.errorTips('请求失败');
      }
    }).catch(()=>{
      wx.hideLoading();
    })
  },
  //  获取默认地址
  getDefaultAddress(){
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
  bindscroll(e){
     //console.log(e.detail);
     //console.log('--------------------------');
    if (e.detail.scrollTop>=240){
      this.setData({
        isPullDown:true
      })
    }else{
      this.setData({
        isPullDown: false
      })
    }
    let height = Math.ceil(this.data.todays.length / 2) * 305;
    
    if (this.data.todays.length<=2){
      if (e.detail.scrollTop < 240) {
        this.setData({
          topNavIndex: 0,
        })
      }
    }else{
      if (e.detail.scrollTop < (height - 400)) {
        this.setData({
          topNavIndex: 0,
        })
      }
    }
    if (e.detail.scrollTop > height) {
      this.setData({
        topNavIndex: 1,
      })
    }
  },
  bindscrolltolower(){
    console.log('----------------------到底部了2----------------------');
    if(this.data.isLoadMore){
      if (this.data.saleList.length < this.data.total) {
        this.data.page++;
        this.getSalesList();
      }
    }
  },
  topNavClick(e){ 
    this.data.topNavIndex  = e.currentTarget.dataset.index;
    this.setData({
      topNavIndex: this.data.topNavIndex,
    })
    if (this.data.topNavIndex==0){
      this.setData({
        toView: 'advertising1',
      })
    }else{
      this.setData({
        toView: 'advertising2',
      })
    }
  },
  bottomNavClick(e){
   
    let bottomNavIndex = e.currentTarget.dataset.index,
        nav            = e.currentTarget.dataset.nav,   //  1 今日特惠  2 热卖爆款
        id             = e.currentTarget.dataset.id;     // 分类ID
  
    if (nav == 1){ 
      this.data.todays = [];
      if(id==0){
        this.data.todays = this.data.today;
      }else{
        this.data.today.forEach((v, i) => {

          if (v.cat_id == id) {
            this.data.todays.push(v);
          }
        })
      }
      
      this.setData({
        todays: this.data.todays,
        bottomNavIndex1: bottomNavIndex
      })
      console.log(this.data.todays);

    }else if(nav == 2){  
      this.data.hots = [];
      if(id==0){
        this.data.hots = this.data.hot;
      }else{
        this.data.hot.forEach((v, i) => {

          if (v.cat_id == id) {
            this.data.hots.push(v);
          }
        })
      }
      
      this.setData({
        hots: this.data.hots,
        bottomNavIndex2: bottomNavIndex
      })
      console.log(this.data.hots);
    }
   
  },
  // 列表立即抢购
  snapUp(e){
    let id= e.currentTarget.dataset.id;
    this.setData({
      id
    })
    let data = {
      id
    }
    api.getSalesCategoryDetail({
      data
    }).then((res)=>{ 
      console.log(res);
      if(res.code==0){ 
        if (res.data.total == -1 || (parseInt(res.data.total) - parseInt(res.data.sale_volume)) >0){
          this.setData({
            itemInfo: res.data,
            isShow: true
          })
        }else{
          this.setData({
            isSnapUp:true
          })
        }
      }
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

    let nowNum      = this.data.purchaseNum;
    // 存储量
    let stocks      = this.data.itemInfo.last_stock;
    let peopleLimit = this.data.itemInfo.people_limit;
    let unit_name   = this.data.itemInfo.detail.sku[0].unit_name;
    if (peopleLimit!=-1){
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
    let inputVal    = e.detail.value.replace(/\b(0+)/gi, "");
    if (parseInt(inputVal) <= 0){
      util.errorTips('购买数量必须大于等于1')
    }
    inputVal = parseInt(inputVal) <= 0 ? 1 : inputVal;
    let peopleLimit = this.data.itemInfo.people_limit;
    let unit_name   = this.data.itemInfo.detail.sku[0].unit_name;
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
        number       = this.data.purchaseNum,
        id           = this.data.id;

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
      method:'POST',
      data: {
        id,
        number,
        receiving_id,
        payment_id: '2'
      }
    }).then((res) => {
      wx.hideLoading();
      if(res.code==-1){
        util.errorTips(res.msg);
        return false
      }
      // 发起微信支付
      wx.requestPayment({
        ...res.data.pay,
        method: "POST",
        success: (res) => {

          // wx.reLaunch({
          //   url: `../index/index?redict=activecomplete`,
          // })

          wx.showModal({
            title: '支付成功',
            content: '可前往个人中心查看订单详情',
            confirmText: '前往',
            confirmColor: '#c81a29',
            success: (res) => {

              if (res.confirm) {
                wx.reLaunch({
                  url: `../index/index?redict=activecomplete`,
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
                
              }
              this.setData({
                purchaseNum: 1,
                isShow: false
              })
            }
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
      // this.updataInfo()

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
  goodsInfo(e) {
      let id = e.currentTarget.dataset.id;
      let data = {
        id
      }
      api.getSalesCategoryDetail({
        data
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          if (true) {
            this.setData({
              itemInfo: res.data,
            })

            let goodsData = this.data.itemInfo.detail,
              descstr = goodsData.binds_str,
              srcList = [];

            // 解析图片路径
            goodsData.goods_desc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
              srcList.push(capture);
            });

            console.log('解析到的图片路径', srcList);
            srcList = srcList.join(',');
            if (res.data.total == -1 || (parseInt(res.data.total) - parseInt(res.data.sale_volume)) > 0){
              wx.navigateTo({
                url: `../goodsInfo/goodsInfo?descimg=${srcList}&descstr=${descstr}&sales=1&id=${id}`,
              })
            }else{
              wx.navigateTo({
                url: `../goodsInfo/goodsInfo?descimg=${srcList}&descstr=${descstr}&sales=0&id=${id}`,
              })
            }
            
          }
        }
      })

      
     
     
  },
  // 更新数据
  updataInfo(cb) {

    api.activity({
      data: {
        id: this.data.id
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