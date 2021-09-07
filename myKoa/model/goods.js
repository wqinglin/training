module.exports = (sequelize, DataTypes) => {
  const goodsModel = sequelize.define("goods", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      comment: "编号",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "商品名称",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "商品内容",
    },
    imgurl: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "商品封面",
    },
    images: {
      type: DataTypes.STRING(800),
      allowNull: true,
      comment: "轮播图",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "打折价格",
    },
    ori_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "原价",
    },
    stock: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
      comment: "库存",
    },
    is_hot: {
      type: DataTypes.INTEGER(3),
      defaultValue: 1,
      comment: "推荐",
    },
    look_num: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
      comment: "浏览量",
    },
    sales: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
      comment: "销售量",
    },
    is_on: {
      type: DataTypes.INTEGER(3),
      defaultValue: 1,
      comment: "上架或下架",
    },
    order: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
      comment: "排序",
    },
  });
  // 关联
  goodsModel.associate = models => {
    goodsModel.belongsTo(models.categoryModel);
    goodsModel.hasMany(models.skuModel);
  };
  return goodsModel;
};
