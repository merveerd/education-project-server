"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("courses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        //word, grammar etc
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        //speaking, listening etc
        type: Sequelize.STRING,
        allowNull: true,
      },
      topic: {
        //tech, leisure etc
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        //A1 etc
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("courses");
  },
};
