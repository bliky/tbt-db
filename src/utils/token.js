// 导出用户uid和ticket
// import Cookie from 'js-cookie'
// 已放入beforeRouter钩子  该文件仅剩上传路径

let getUserToken = {
  data() {
    let uid = this.$route.query.uid
    let ticket = this.$route.query.tickets
    return {
      myUploadUrl: `https://scmgw.to8to.com/?action=file&uid=${uid}&ticket=${ticket}`,
    }
  },
  // methods: {
  //   userToken() {
  //     // 设置用户cookie
  //     if (this.$route.query.ticket && this.$route.query.uid) {
  //       Cookie.set('t8t-it-ticket', this.$route.query.ticket)
  //       Cookie.set('t8t-it-uid', this.$route.query.uid)
  //     }
  //   },
  // },
  // created() {
  //   this.userToken()
  // },
}

export default getUserToken
