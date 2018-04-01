//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: util.formatTime(new Date,'d'),
    textareaShow: false,
    doingList: [],
    doneList: [],
    textareaValue: ''
  },
  
  bindViewTap: function() {
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getStorage({
      key: 'todoList',
      success: (res) => {
        let data = res.data;
        data.forEach(v=>{
          if (v.date === this.data.date){
            this.setData({
              doingList: v.list.filter(m => m.state === 'doing'),
              doneList: v.list.filter(m => m.state === 'done')
            })
          }
        })
        console.log(this.data.doingList);
      }
    })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },

  today(){
    this.setData({
      date: util.formatTime(new Date, false)
    })
  },

  gettime(type){
    let time = type === 'n' ? new Date(this.data.date).getTime() + 24 * 60 * 60 * 1000 : new Date(this.data.date).getTime() - 24 * 60 * 60 * 1000;
    this.setData({
      date: util.formatTime(new Date(time), 'd')
    })
  },

  next(){
    this.gettime('n');
  },

  prev(){
    this.gettime('p');
  },

  settextareaShow(){
    this.setData({
      textareaShow: !this.data.textareaShow
    })
  },

  settextareaValue(e){
    this.setData({
      textareaValue: e.detail.value
    })
  },

  submit() {
    let time = util.formatTime(new Date(), 't');
    if(!wx.getStorageSync('todoList')){
      this.setData({
        doingList: this.data.doingList.push({
          time: time,
          text: this.data.textareaValue,
          state: 'doing'
        })
      })
      wx.setStorage({
        key: 'todoList',
        data: [{
          date:this.data.date,
          list:[{
            time: time,
            text: this.data.textareaValue,
            state: 'doing'
          }]
        }],
      })
    }
  }
})