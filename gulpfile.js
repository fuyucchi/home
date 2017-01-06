var gulp = require("gulp");
var less = require('gulp-less');
var plumber = require('gulp-plumber');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var webserver = require('gulp-webserver');

var gzip = require('gulp-gzip');



//Webサーバー
gulp.task('webserver', function() {
  gulp.src('./') //Webサーバーで表示するサイトのルートディレクトリを指定
    .pipe(webserver({
      host: 'localhost',
      port: 8000,
      livereload: true, //ライブリロードを有効に
      //directoryListing: true //ディレクトリ一覧を表示するか。オプションもあり
    }));
});


/**
 * デフォルトタスク
 *
 * コマンド'gulp'で実行される
 */
gulp.task('default', ['webserver','watch_tools_css']);



gulp.task('watch_tools_css',function() {
  gulp.watch('tools/tools_css/*.less', ['csstools']);
});

gulp.task('csstools', function() {
    gulp.src('tools/tools_css/*.less')
      .pipe(plumber()) // lessのコンパイルでコケても終了しない
      .pipe(less())
      .pipe(gulp.dest('tools/tools_css/'))
});



gulp.task('css', function() {
    gulp.src('less/*.less')
      .pipe(plumber()) // lessのコンパイルでコケても終了しない
      .pipe(less())
      .pipe(gulp.dest('css/'))
});





gulp.task('jsmin', function(){
    console.log('--------- uglify task ----------');
    gulp.src('js/*.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gzip())
        .pipe(gulp.dest('js'));
});
