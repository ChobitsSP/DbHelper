const gulp = require("gulp");

const { CreateFtpGulp } = require("./utils.js");

gulp.task(
  "ftp",
  CreateFtpGulp(
    {
      host: "server3.hsort.com",
      user: "ftp_user",
      password: "123456",
      port: 21,
      parallel: 10
    },
    "/www/sql-helper"
  )
);
