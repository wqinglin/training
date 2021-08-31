const {
  swiperModel,
  sequelize
} = require("../model");
class apiController {
  // 轮播图接口
  static async getswiper(ctx) {
    // model 层数据库的调取
    let results = await swiperModel.findAll({});
    if (results.length > 0) {
      ctx.body = {
        code: 1, // 自定义状态吗
        msg: "OK", // 消息
        data: results, // 结果数据
      };
    } else {
      ctx.body = {
        code: 800,
        msg: "没有查询到轮播图",
        data: [],
      };
    }
  }
}
module.exports = apiController;
