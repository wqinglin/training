const {
  swiperModel,
  categoryModel,
  goodsModel,
  sequelize
} = require("../model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
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

  // 获得所有分类名称信息
  static async cates(ctx) {
    var results = await categoryModel.findAll({
      order: [["order", "DESC"]],
    });
    if (results.length > 0) {
      ctx.body = {
        code: 1,
        msg: "OK",
        data: results,
      };
    } else {
      ctx.body = {
        code: 800,
        msg: "没有查询分类内容",
        data: [],
      };
    }
  }

  // 推荐商品
  static async recommend(ctx) {
    let { currentPage } = ctx.query;
    currentPage = currentPage === undefined ? 1 : Number(currentPage); // 当前页码
    let pageSize = 10; // 每页条数

    let allResponse = await courseModel.findAll({});
    let total = allResponse.length; // 全部条数
    let totalPage = Math.ceil(total / pageSize); // 页数
    let results = await courseModel.findAll({
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      order: [["id", "DESC"]],
    });

    if (results.length > 0) {
      ctx.body = {
        code: 1,
        msg: "OK",
        data: results,
        totalPage: totalPage,
        currentPage: currentPage,
      };
    } else {
      ctx.body = {
        code: 1,
        msg: "没有查询到内容",
        data: [],
      };
    }
  }

  // 推荐商品
  static async recommend(ctx) {
    let { currentPage } = ctx.query;
    currentPage = currentPage === undefined ? 1 : Number(currentPage); // 当前页码
    let pageSize = 3; // 每页条数

    let allResponse = await goodsModel.findAll({});
    let total = allResponse.length; // 全部条数
    let totalPage = Math.ceil(total / pageSize); // 页数
    let results = await goodsModel.findAll({
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      order: [["id", "DESC"]],
    });

    if (results.length > 0) {
      ctx.body = {
        code: 1,
        msg: "OK",
        data: results,
        totalPage: totalPage,
        currentPage: currentPage,
      };
    } else {
      ctx.body = {
        code: 1,
        msg: "没有查询到内容",
        data: [],
      };
    }
  }
  
  //搜索商品接口
  static async search(ctx) {
    let keyword = ctx.query.keyword;
    let orderBy = ctx.query.sort_type;  // 排序  销量或价格排序
    let where = {};
    // 没有指定返回字段的情况下返回全部字段
    if (keyword) {
      where = {
        title: {
          [Op.like]: "%" + keyword + "%",
        },
      };
    }
    let { currentPage } = ctx.query;
    currentPage = currentPage === undefined ? 1 : Number(currentPage); // 当前页码
    let pageSize = 4; // 每页条数

    let allResponse = await goodsModel.findAll({});
    let total = allResponse.length; // 全部条数
    let totalPage = Math.ceil(total / pageSize); // 页数

    let order;
    if (orderBy == 2) {
      order = [["sales", "ASC"]];
    } else if (orderBy == 3) {
      order = [["price", "ASC"]];
    } else if (orderBy == 4) {

      order = [["price", "DESC"]];

    }
    let result = await goodsModel.findAll({
      where,
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      order
    });
    if (result.length > 0) {
      ctx.body = {
        code: 1,
        msg: "OK",
        data: result,
        totalPage: totalPage,
        currentPage: currentPage
      };
    } else {
      ctx.body = {
        code: 800,
        msg: "没有查询到具体商品",
        data: [],
      };
    }
  }

  // 所有分类对应的商品
  static async catesAndGoods(ctx) {
    let include = [{ model: goodsModel }];
    let results = await categoryModel.findAll({
      include,
      order: [["id", "DESC"]],
      //limit: 5,
    });
    //console.log(results);
    if (results.length > 0) {
      ctx.body = {
        code: 0,
        msg: "OK",
        data: results,
      };
    } else {
      ctx.body = {
        code: 800,
        msg: "没数据",
        data: [],
      };
    }
  }
}
module.exports = apiController;
