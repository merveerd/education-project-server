"use strict";

module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define("group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING,
    },

    grade: {
      //9th grade etc
      type: DataTypes.STRING,
    },
  });

  group.associate = (models) => {
    group.hasMany(models.user, {
      as: "users",
      targetKey: "name",
    });
  };

  return group;
};
