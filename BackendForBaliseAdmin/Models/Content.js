import Sequelize from "sequelize";

export default (sequelize) => {
  const Content = sequelize.define(
    "Content",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        comment: "0=about us, 1=privacy policy, 2=terms, 3=ios, 4=android",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "contents",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Content;
};
