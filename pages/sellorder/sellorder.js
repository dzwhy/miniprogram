var config = require('../../common/js/config')
var fetch = require('../../common/js/fetch')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    hasMore: true,
    loading: false,
    page: 1,
    orderlist: [],
    ptype: 2,
    is_data: true
  },
  getlist: function () {
    var that = this
    if (that.data.hasMore && !that.data.loading) {
      that.setData({
        loading: true
      })
      if(that.data.from==2)
      {
        var url = config.apiList.sellorder
      }else
      {
        var url = config.apiList.buyorder
      }
      wx.request({
        url: app.getUrl(url),
        method: 'GET',
        data: {
          p: that.data.page,
          type: that.data.ptype
        },
        success: function (res) {
          that.setData({
            loading: false
          })
          if (!res.data.data) {
            that.setData({
              hasMore: false,
            })
            if (that.data.page == 1) {
              that.setData({
                is_data: false
              })
            }
          } else {
            that.setData({
              orderlist: that.data.orderlist.concat(res.data.data),
              page: that.data.page + 1
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from == 2) {
      wx.setNavigationBarTitle({
        title: '卖出订单',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '购买订单',
      })
    }
    this.setData({
      from:options.from
    })
  },

  onShow:function(){
    var that = this;
    that.setData({
      selected1: false,
      selected: true,
      hasMore: true,
      loading: false,
      page: 1,
      ptype: 2,
      orderlist: [],
      is_data: true
    })
    this.getlist()
  },

  selected: function () {
    var that = this;
    that.setData({
      selected1: false,
      selected: true,
      hasMore: true,
      loading: false,
      page: 1,
      ptype: 2,
      orderlist: [],
      is_data:true
    })
    this.getlist()
  },
  selected1: function () {
    var that = this;
    that.setData({
      selected1: true,
      selected: false,
      hasMore: true,
      loading: false,
      page: 1,
      ptype: 1,
      orderlist: [],
      is_data: true,
    })
    this.getlist()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getlist()
  },
  jump_checkorder: function (e) {
     var data = e.currentTarget.dataset
     var order_id = data.order_id
     var from_page=data.from
     var url = "../orderdetail/orderdetail?order_id=" + order_id
     var jd_url = "../checkupdeal/checkupdeal?order_id=" + order_id + "&from_page=" + from_page
     var kanjia = "../buyorder/buyorder?order_id=" + order_id + "&from_page=" + from_page
     var tuihuo = "../applyrefund/applyrefund?order_id=" + order_id + "&from_page=" + from_page
    var atype = data.atype
    var adstatus = data.adstatus
    if(adstatus==9){
      app.jump_check(kanjia, true)
    } else if (adstatus == 14 || adstatus == 15 || adstatus == 13) {
      app.jump_check(tuihuo, true)
    }else{
      if (atype == 1) {
        app.jump_check(jd_url, true)
      } else {
        app.jump_check(url, true)
      }
    }
    
  },
  choice: function (e) {
    var types = ['当面交易', '快递发货']
    var that = this
    var order = e.currentTarget.dataset.orderid
    wx.showActionSheet({
      itemList: types,
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.showModal({
              title: '确认当面交易？',
              content: '    建议在公共场合进行交易\r\n   1.双方协商一致为当面交易\r\n   2.当面交易属于用户自发行为，切记双方当面督促一手交货一手点击确认收货，否则钱财两空',
              success: function (res) {
                if (!res.cancel) {
                  wx.request({
                    url: app.getUrl(config.apiList.deal),
                    data: {
                      order_id: order
                    },
                    success: function (res) {
                      if (res.data.status == 1) {
                        var msg = '操作成功'
                        wx.showToast({
                          title: msg,
                        })
                        that.onShow();
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.data.msg,
                          showCancel: false,
                          confirmText: '知道了',
                        })
                      }
                    }
                  })
                }
              }
            })

          } if (res.tapIndex == 1) {
            app.jump_check('../writeexpre/writeexpre?order_id=' + order, true)
          }
        }
      }
    })
  },
  goPay: function () {
    var data = e.currentTarget.dataset
    app.goPay(data.orderid)
  },
  call: function () {
    wx.showModal({
      title: '提示',
      content: '请下载二货app进行后续操作',
      showCancel: false,
      confirmText: '知道了',
    })
  },
  jump_check:function(e){
    var data = e.currentTarget.dataset
    var url = data.url
    app.jump_check(url, true)
  },
  show_app: function () {
    wx.showModal({
      title: '提示',
      content: '请下载二货app进行后续操作',
      showCancel: false,
      confirmText: '知道了',
    })
  }

})