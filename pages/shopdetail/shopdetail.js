// pages/youpin/shopdetail/shopdetail.js
//获取应用实例
var config = require('../../common/js/config')
var fetch = require('../../common/js/fetch')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],
    others:[],
    is_collect:0,
    isYh:1, //0普通 1优惠
    id:0,
  },

  /**
   * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that=this
    var id = options.id ? options.id : options.publish_id
    var isYh = options.isYh ? 0 : 1 //不带有isYh参数 就是优惠 普通商品跳转，切记带上isYh参数
    that.setData({
      id:id,
      isYh: isYh,
    })
    that.getypdetail()
    //mta
    mta.Page.init()
  },
  //收藏、取消收藏
  collect:function(){
    var that=this;
    var collect_url = that.data.is_collect ? config.apiList.uncollect : config.apiList.collect;
    var data={
      publish_type:1,
      publish_id:that.data.id
    }
    wx.request({
      url: app.getUrl(collect_url), //仅为示例，并非真实的接口地址
      data: data,
      success: function (res) {
        let response=res.data;
        console.log(res)
        if (response.status==1){
          that.setData({
            is_collect: that.data.is_collect ? 0 : 1,
          })
        }else{
          wx.showModal({
            title: '异常提示',
            content: response.msg,
          })
        }
        
      }
    })

  },
  //获取页面数据
  getypdetail:function () {
    var that = this
    var data = {
      publish_id: that.data.id,
      isYh: that.data.isYh
    }
    wx.request({
      url:app.getwebUrl(config.apiList.yp_sale +'/publishDetail?'),
      data: data,
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          detail: res.data.data.goods,
          others: res.data.data.other,
          is_collect: res.data.data.goods.is_collect,
        })
      }
    })
  },
  //获取普通商品详情
  getother:function(e){
    var that = this
    var data = e.currentTarget.dataset
    var id=data.id
    var isYh = data.isYh
    that.setData({
      id:id,
      isYh:0,
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    that.getypdetail(id)
  },
  //链接客服
  gettitle:function(){
    wx.showModal({
      title: '温馨提示',
      content: '请到应用商店下载'+app.data.app_name+'进行操作',
    })
  },
  //去购买
  gobuy:async function(){
    let that=this;
    let isLogin=await app.isLogin();
    if(!isLogin){
      return false;
    }
    var detail = that.data.detail
    if (!detail.auth_buy || detail.num <= 0) {
      wx.showModal({
        title: '温馨提示',
        content: '该商品暂时无法购买，敬请期待！',
      })
      return;
    }
    var url = "../sureorder/sureorder?isyp=1&publish_id=" + detail.id + "&isYh=" + that.data.isYh;
    app.jump_check(url,false);
  },
  //图片预览
  showimg(e){
    var that=this
    var urls = that.data.detail.pics
    var current =urls[e.target.dataset.id]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "闲宝",
      path: '/pages/shopdetail/shopdetail?id=' + this.data.id,
      imageUrl: this.data.detail.icon,
    }
  },
  
})