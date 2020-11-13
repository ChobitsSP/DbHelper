const gulp = require("gulp");
const ftp = require("vinyl-ftp");
const logger = require("gulplog");

/**
 *
 * @param {any} config
 * @param {string} remotePath
 */
function CreateFtpGulp(config, remotePath, hasStatic = true) {
  config.log = logger.info.bind(logger);
  const task2 = Task2(config, remotePath);
  if (!hasStatic) {
    return task2;
  }
  const task1 = Task1(config, remotePath);
  return gulp.series(task1, task2);
}

function Task1(config, remotePath) {
  return function() {
    const conn = ftp.create(config);
    const globs = ["dist/static/**/*"];

    return gulp
      .src(globs, {
        base: "dist",
        buffer: false
      })
      .pipe(conn.differentSize(remotePath))
      .pipe(conn.dest(remotePath));
  };
}

function Task2(config, remotePath) {
  return function() {
    const conn = ftp.create(config);
    const globs = ["dist/index.html"];

    return (
      gulp
        .src(globs, {
          base: "dist",
          buffer: false
        })
        //.pipe(conn.newer(remotePath))
        .pipe(conn.dest(remotePath))
    );
  };
}

module.exports = {
  CreateFtpGulp
};
