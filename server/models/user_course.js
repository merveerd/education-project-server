("use strict");
module.exports = (sequelize, DataTypes) => {
  const user_course = sequelize.define(
    "user_course",
    {
      user_id: DataTypes.INTEGER,
      course_id: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      completion: DataTypes.INTEGER,
      finish_time: DataTypes.INTEGER, //sn
    },
    {}
  );

  user_course.associate = function (models) {
    user_course.hasMany(models.user, {
      foreignKey: "id",
      sourceKey: "user_id",
    });
    user_course.hasMany(models.course, {
      foreignKey: "id",
      sourceKey: "course_id",
    });
  };
  return user_course;
};
