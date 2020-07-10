const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const autoprefixer = require('autoprefixer')
const del = require('del')

const now = new Date()
const year = now.getFullYear()
const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
const hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
const time = `${year}${month}${day} ${hour}:${minutes}`
// 複製HTML 檔案到public
function copy_HTML() {
  return gulp.src('./src/**/*.html')
    .pipe($.plumber())
    .pipe(gulp.dest('./public/'))
}

// 移除public 整個資料夾
function remove() {
  // return del(['./public/**', '!./public/*.html'])
  return del('./public/')
}

// jade 轉成HTML 並複製檔案到public
function jade_HTML() {
  return gulp.src('./src/**/*.jade')
    .pipe($.plumber())
    .pipe($.jade())
    .pipe(gulp.dest('./public/'))
}

// sass 轉成CSS 並複製檔案到public
function sass_CSS() {
  return gulp.src('./src/sass/**/*.sass')
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe(gulp.dest('./public/css'))
}

// 把多支JavaScript 轉成ES5, 產生.map 檔並複製檔案到public
function babel_ES5() {
  return gulp.src('./src/js/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.concat('JavaScript.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
}

// gulp-git
function git_init() {
  console.log(argv.m)
}

function git_add() {
  console.log('adding...')
  return gulp.src('.')
    .pipe($.git.add())
}

function git_commit() {
  console.log('commiting')
  return gulp.src('.')
    .pipe($.git.commit(`${time}, gulp git test`))
}

function git_push(cb) {
  console.log('pushing...')
  $.git.push('origin', 'master', function (err) {
    if (err) throw err;
  }, cb)
}

// gulp-git
exports.git = gulp.series(git_add, git_commit, git_push)

// 編譯產生public
exports.public = gulp.series(copy_HTML, jade_HTML, sass_CSS, babel_ES5)

// 刪除public 資料夾
exports.remove = remove