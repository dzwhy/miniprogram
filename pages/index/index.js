//index.js
//获取应用实例
var config = require('../../common/js/config')
var fetch = require('../../common/js/fetch')
const app = getApp()
//首页
Page({
  data: {
    //大眼睛 设置
    pic_url: [],
    release: [],
    showLoading: true,
    page: 1,
    zerotype: 0,
    disabled: false,
    loading: false,
    indicatorDots: true,
    indicatorColor: "rgba(255,255,255,.5)",
    vertical: false,
    interval: 3000,
    duration: 900,
    autoplay: true,
    selected: true,
    selected1: false,
    circular: true,
    hasMore: true,
    clientHeight: '',
    syswidth: 0,
    sysheight: 0,
    imgheightpx: '',
    fix: false,
    msgNum: 0,
    jump: true,
    yp_sale:[],//优品特惠 
    yp:false,//优品特惠倒计时是否结束
    yp_ltime:[],//时 分 秒
    zq_list:[],// banner图下面专区数据
    cricle_list: [], // 圈子数据
    mtop:'',
  },
  scroll: function (e) {
    var scrollheight = e.detail.scrollTop
    if (scrollheight >= this.data.mtop && !this.data.fix) {
      var setfix = true
      var fix = true
    } else if (scrollheight < this.data.mtop && this.data.fix) {
      var setfix = true
      var fix = false
    }
    if (setfix) {
      this.setData({
        fix: fix
      })
    }
  },
  scrollTop: function (e) {
    this.setData({
      top: 0,
    })
  },
  imageload: function (e) {
    if (e.currentTarget.dataset.index == 0 && e.detail.height) {
      var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        ratio = imgwidth / imgheight;
      var imgheight = this.data.syswidth / ratio
      this.setData({
        imgheight: imgheight,
        imgheightpx: imgheight + 'px'
      })
    }
  },
  onShow() {
    var that = this
    that.setData({
      jump:true,
    })
    var interval = setInterval(function () {
      clearInterval(interval)
      that.setData({
        disabled: false,
      })
    }, 1000)
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          syswidth: res.windowWidth,
          sysheight: res.windowHeight + 'px'
        })
      }
    })
    fetch.eye.call(that, app.getUrl(config.apiList.eye))//大眼睛圖片
    fetch.fetchrelease.call(that, app.getUrl(config.apiList.release), that.data.page, that.data.zerotype, 0)

    //优品特惠 + 倒计时
    wx.request({
      url: app.getwebUrl(config.apiList.yp_sale + '/getAllYhGoods?'),
      data: {
        p:1,
      },
      success: function (res) {
        that.setData({
          yp_sale:res.data.data,
          //yp_time:res.data.data[0].yhOverTime,
        })
        that.yp_getlast(res.data.data[0].yhOverTime)
      }
    })

    wx.createSelectorQuery().select('.the-id').boundingClientRect(function (rect) {
      if(rect){
        that.setData({
          mtop: rect.top,
        })
      }
      
    }).exec()
  },
  // 页面渲染完成后 调用  
  yp_getlast(totalSecond) {
    var that=this
    var interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;
      // 小时位  
      var hr = Math.floor(second / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor((second - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = second - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      that.setData({
        yp_ltime:{
          hr: hrStr,
          min: minStr,
          sec: secStr,
        }
      });

      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval); 
        that.setData({
          yp:true,
        });
      }
    }.bind(this), 1000);
  },

  onReachBottom: function () {
    var that = this
    fetch.fetchrelease.call(that, app.getUrl(config.apiList.release), that.data.page, that.data.zerotype, 0)
  },
  selected: function () {
    var that = this;
    that.setData({
      selected1: false,
      selected: true,
      page: 1,
      zerotype: 0,
      //release: [],
      hasMore: true
    });
    fetch.fetchrelease.call(that, app.getUrl(config.apiList.release), that.data.page, that.data.zerotype, 0)
  },
  selected1: function () {
    var that = this;
    that.setData({
      selected: false,
      selected1: true,
      page: 1,
      zerotype: 4,
      //release: [],
      hasMore: true
    });
    fetch.fetchrelease.call(that, app.getUrl(config.apiList.release), that.data.page, that.data.zerotype, 0)
  },
  
  jump_check: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    var stu = data.stu
    var wxappid = data.wxappid
    //判断优品活动是否已经结束
    if (url == 0) {
      return;
    }
    if(this.data.jump){
      this.setData({
        jump: false,
      })
      app.jump_check(url, stu, wxappid)
    }
  },
  collect: function (e) {
    var that = this
    var data = e.currentTarget.dataset;
    var id = data.id;
    var index = data.index;
    var release = that.data.release;
    wx.request({
      url: app.getUrl(config.apiList.collect),
      method: 'GET',
      data: { publish_id: id },
      success: function (res) {
        if (res.data.status == 1) {
          release[index]["collect"] = 1;
          release[index]["coll_num"]++
          that.setData({
            release: release
          })
          wx.showToast({
            title: '收藏成功',
            mask: true
          })
        }
      }
    })
  },
  uncollect: function (e) {
    var that = this
    var data = e.currentTarget.dataset;
    var id = data.id;
    var index = data.index;
    var release = that.data.release;
    wx.request({
      url: app.getUrl(config.apiList.uncollect),
      method: 'GET',
      data: { publish_id: id },
      success: function (res) {
        if (res.data.status == 1) {
          release[index]["collect"] = 2;
          release[index]["coll_num"]--
          that.setData({
            release: release
          })
          wx.showToast({
            title: '取消收藏',
            mask: true
          })
        }
      }
    })
  },
  showbig: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var indexa = e.currentTarget.dataset.indexa
    wx.previewImage({
      current: that.data.release[index]['images_s'][indexa],
      urls: that.data.release[index]['images_s']
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      //title: this.data.shareinfo.title,
      path: '/pages/index/index',
      //imageUrl: this.data.shareinfo.s_img,
    }
  },

})

