//获取应用实例
var config = require('../../common/js/config')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addr_id: '',
    publish_id: '',
    remark: '',
    detail: [],
    address: [],
    a_type: '1',   //1支持验机  0不知道验机
    jd_money: '',
    total_money: '',
    jd_money: '',
    price: '',
    isyp:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      publish_id: options.publish_id,
      isyp: options.isyp?1:0,//0是普通  1是优品
    })

    if (options.isyp){  //如果是优品,获取优品信息
      wx.request({
        url: app.getwebUrl(config.apiList.yp_sale +'/publishDetail?'),
        data: {
          publish_id: options.publish_id,
          isYh: options.isYh,
        },
        success: function (res) {
          var data = res.data.data.goods
          var detail={
            id:data.id,
            avater: data.seller_avater,
            username: '优品',
            publish_id: data.id,
            image: data.icon,
            title: data.name,
            price: data.zhprice,
            desc: data.detailed,
            jd_info: [],
            isyh:data.is_youhui,

          }
          that.setData({
            detail: detail,
            total_money: detail.price,
            jd_money: 0,
            price: detail.price,
          })
        }
      })
      return;
    }
    


    //普通商品
    // wx.request({
    //   url: app.getUrl(config.apiList.get_info),
    //   data: {
    //     publish_id: options.publish_id
    //   },
    //   success: function (res) {
    //     //console.log(res.data.data)

    //     if (res.data.data) {
    //       if (res.data.data.zone_10 == 1) {
    //         if (res.data.data.jd_info.tg_open == 1) {
    //           that.setData({
    //             detail: res.data.data,
    //             total_money: res.data.data.price + res.data.data.jd_info.tg_money,
    //             jd_money: res.data.data.jd_info.tg_money,
    //             price: res.data.data.price,
    //           })
    //         } else {
    //           that.setData({
    //             detail: res.data.data,
    //             total_money: res.data.data.price + res.data.data.jd_info.jd_money,
    //             jd_money: res.data.data.jd_info.jd_money,
    //             price: res.data.data.price,
    //           })
    //         }
    //       } else {
    //         that.setData({
    //           detail: res.data.data,
    //           total_money: res.data.data.price,
    //           jd_money: 0,
    //           price: res.data.data.price,
    //           a_type: '0',
    //         })
    //       }
    //     }
    //   }
    // })

  },
  onShow: function () {
  },
  change: function (e) {
    var remark = e.detail.value
    this.setData({
      remark: remark
    })
  },
  select_check: function (e) {
    var that = this
    var data = e.currentTarget.dataset;
    var a_type = data.a_type;
    var total_money = that.data.total_money;
    var jd_money = that.data.jd_money;
    if (a_type == '1') {
      that.setData({
        a_type: '0',
        total_money: (total_money * 100 - jd_money * 100)/100,
      })
    } else {
      that.setData({
        a_type: '1',
        total_money: (total_money * 100 + jd_money * 100)/ 100,
      })
    }
  },
  gen_order: function () {
    var that = this


    // if (that.data.address == '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '无收货地址',
    //     showCancel: false,
    //     confirmText: '立即添加',
    //     success: function (res) {
    //       if (res.confirm) {
    //         var url = '../addaddr/addaddr'
    //         app.jump_check(url, true)
    //       }
    //     }
    //   })
    //   return false;
    // }

    if(that.data.isyp){  //下单
      var address = that.data.address
      let goodsInfo = that.data.detail;
      let payData={
        appid:0,
        url:config.apiList.gen_order,
        publish_id: goodsInfo.publish_id,
        goods_name: goodsInfo.title,
        price: goodsInfo.price*100,
      }
      app.newGoPay(payData);
      console.log(that.data.detail)
      // wx.request({
      //   url: app.getwebUrl(config.apiList.ypgen_order), //仅为示例，并非真实的接口地址
      //   data: {
      //     phone: '',
      //     price: that.data.detail.price*100,
      //     publish_id: that.data.detail.id,
      //     remark: that.data.remark,
      //     type: that.data.detail.isyh,
      //     umstat: '0',
      //     username: '',
      //     address: ''
      //   },
      //   success: function (res) {
      //     console.log(res)
      //     app.goPay(res.data.data.order_id, '../orderdetail/orderdetail')
      //   }
      // })
      return;
    }

    //普通商品下单
    wx.request({
      url: app.getUrl(config.apiList.gen_order),
      data: {
        publish_id: that.data.publish_id,
        addr_id: that.data.addr_id,
        remark: that.data.remark,
        price: that.data.detail.price,
        a_type: that.data.a_type,
        jd_money: that.data.jd_money,
      },

      success: function (res) {
        if (that.data.a_type != '1') {
          app.goPay(res.data.data.order_id, '../orderdetail/orderdetail')
        } else {
          if (res.data.status == 1) {
            wx.showModal({
              title: '提示',
              content: '您选择的鉴定服务后,二货将为您提供30天质保服务,鉴定服务需要卖家将手机寄往二货平台进行鉴定,鉴定完毕后您可查看鉴定结果后决定是否购买,鉴定订单请勿脱离平台交易,以保障您的合法权益',
              confirmText: '确定',
              showCancel: false,
              success: function (res1) {
                if (res1.confirm) {
                  app.goPay(res.data.data.order_id, '../checkupdeal/checkupdeal')
                }
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg
            })
            // wx.showModal({
            //   title: '提示',
            //   content: res.data.msg,
            //   showCancel: false,
            //   confirmText: '立即添加',
            //   success: function (res) {
            //     if (res.confirm) {
            //       var url = '../addaddr/addaddr'
            //       app.jump_check(url, true)
            //     }
            //   }
            // })
          }
        }
      },
    })
  },
  jump_check: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.jump_check(url, true)
  },
  jump_goods: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.jump_check(url, true)
  },
  show_app:function(){
    wx.showModal({
      title: '提示',
      content: '请下载二货app进行后续操作',
      showCancel: false,
      confirmText: '知道了',
    })
  }

})