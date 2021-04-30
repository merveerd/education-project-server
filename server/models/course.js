"use strict";

module.exports = (sequelize, DataTypes) => {
  const course = sequelize.define("course", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      //word, grammar etc
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      //speaking, listening etc
      type: DataTypes.STRING,
      allowNull: true,
    },
    topic: {
      //tech, leisure etc
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      //A1 etc
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  course.associate = (models) => {
    course.belongsToMany(models.user, {
      through: "user_course",
      as: "users",
      foreignKey: "course_id",
    });
  };

  return course;
};
