import Sequelize from "sequelize";

export default (sequelize) => {
  const Broadcast = sequelize.define(
    "Broadcast",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_type: {
        type: Sequelize.ENUM("all", "specific"),
        allowNull: false,
      },
      selected_users: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "broadcasts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Broadcast;
};
