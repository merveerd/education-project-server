const ROLE = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  INDIVIDUAL: "individiual",
};

module.exports = {
  ROLE: ROLE,
  privilegedUsers: [
    { id: 1, username: "test", email: "test@test.com", role: ROLE.ADMIN },
  ],
};
