const fs = require('fs')
const path = require('path')
const util = require('util')
const Koa = require('koa2')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
router
.get('/', (ctx, next) => {
  ctx.body = 'index'
})
.options('/static/pic', (ctx, next) => {
  let reqMethod = ctx.headers['access-control-request-method']
  let origin = ctx.headers['origin'] || '*'
  // 打印预检请求头
  console.log(util.inspect(ctx.headers))

  if (/get/i.test(reqMethod)) {
    ctx.set({
      // 只支持GET方法
      'Access-Control-Allow-Method': 'GET',
      // 支持额外的X-Pong头部字段
      'Access-Control-Allow-Headers': 'X-Pong',
      'Access-Control-Allow-Origin': origin,
      // 预检有效缓存10分钟
      'Access-Control-Max-Age': '600'
    })
    ctx.status = 204
  } else {
    ctx.status = 405
    ctx.body = '<p>This resource can only be preflight by GET.</p>'
  }
})
.get('/static/pic', (ctx, next) => {
  // 这是正常的跨域CORS发送文件
  let origin = ctx.headers['origin'] || '*'
  let filePath = path.join(__dirname, './auto-title.png')
  console.log(filePath)
  ctx.set('Access-Control-Allow-Origin', origin)
  ctx.type = path.extname(filePath)
  ctx.body = fs.createReadStream(filePath)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3003, function () {
  console.log('server running on port 3003...')
})