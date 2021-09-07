module.exports = (sequelize, DataTypes) => {
  const skuModel = sequelize.define("sku", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      comment: "编号",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "规格名称",
    },
    imgurl: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "规格商品图",
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
      defaultValue: 0,
      comment: "推荐课程",
    },
    is_on: {
      type: DataTypes.INTEGER(3),
      defaultValue: 1,
      comment: "上架或下架",
    },
  });
  // 关联
  // 关联
  skuModel.associate = (models) => {
    skuModel.belongsTo(models.goodsModel);
  };
  return skuModel;
};
