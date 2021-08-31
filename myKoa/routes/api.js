// 前端接口
const router = require('koa-router')()

router.prefix('/api')

const apiController = require("../controller/api");

// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

// 轮播图接口
router.get("/getswiper", apiController.getswiper);

module.exports = router
