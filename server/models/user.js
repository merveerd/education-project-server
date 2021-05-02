("use strict");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    language: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },

    school: {
      type: DataTypes.STRING,
    },
    education_level: {
      type: DataTypes.STRING,
    },
    language_level: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    words: {
      //completed words
      type: DataTypes.INTEGER,
    },
    grammar: {
      //completed grammar
      type: DataTypes.INTEGER,
    },

    groupId: {
      type: DataTypes.STRING,
    },
  });

  user.associate = (models) => {
    user.belongsToMany(models.course, {
      through: "user_course",
      as: "courses",
      foreignKey: "course_id",
    });
    user.belongsTo(models.group, {
      targetKey: "id",
      foreignKey: "groupId",
      as: "group",
    });
  };

  return user;
};
