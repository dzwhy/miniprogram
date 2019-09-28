// pages/pay/pay.js
config = require('../../common/js/config')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_success: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let payData = wx.getStorageSync('other_pay');
    if (payData) {
      // 未登录情况
      that.setData({
        pay_success: 0,
      })
    } else {
      // 第一次访问
      // options.appid = 1;
      // options.price = 1;
      // options.goods_name = '手机';
      // options.other_order = 'qw_25_dfde74878';

      if (options.appid) {
        that.setData({
          pay_success: 0,
        })
        if (!options.price) {
          app.confirm('缺少金额', function() {
            wx.navigateTo({
              url: '../../pages/payfail/payfail',
            })
          });
          return false;
        }
        if (!options.goods_name) {
          app.confirm('缺少商品名称', function() {
            wx.navigateTo({
              url: '../../pages/payfail/payfail',
            })
          });
          return false;
        }
        if (!options.other_order) {
          app.confirm('缺少订单号', function() {
            wx.navigateTo({
              url: '../../pages/payfail/payfail',
            })
          });
          return false;
        }
        payData = {
          url: config.apiList.gen_order,
          price: options.price,
          appid: options.appid,
          goods_name: options.goods_name,
          other_order: options.other_order
        };
        wx.setStorageSync('other_pay', payData)
      }
    }
    console.log('支付信息');
    console.log(payData);
    if (payData && (!payData.hasOwnProperty('is_pay') || payData.is_pay!=1)){
      
      app.newGoPay(payData);
    } else if(!payData){
      wx.navigateTo({
        url: '../../pages/payfail/payfail',
      })
    }else{
      that.setData({
        pay_success: payData.is_pay,
      })
      wx.removeStorageSync('other_pay');
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})