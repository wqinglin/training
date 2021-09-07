// 前端接口
const router = require('koa-router')()

router.prefix('/api')

const apiController = require("../controller/api");

// 轮播图接口
router.get("/getswiper", apiController.getswiper);
// 分类接口
router.get("/cates", apiController.cates);

// 商品推荐接口
router.get("/recommend", apiController.recommend);

// 搜索接口
router.get("/search", apiController.search);

// 查询所有分类下对应的数据 catesAndGoods
router.get("/catesAndGoods", apiController.catesAndGoods);


module.exports = router
