var gulp = require("gulp");
var less = require('gulp-less');
var plumber = require('gulp-plumber');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var webserver = require('gulp-webserver');



//Webサーバー
gulp.task('webserver', function() {
  gulp.src('./') //Webサーバーで表示するサイトのルートディレクトリを指定
    .pipe(webserver({
      livereload: true, //ライブリロードを有効に
      //directoryListing: true //ディレクトリ一覧を表示するか。オプションもあり
    }));
});


/**
 * デフォルトタスク
 *
 * コマンド'gulp'で実行される
 */
gulp.task('default', ['webserver']);





gulp.task('css', function() {
    gulp.src('less/*.less')
      .pipe(plumber()) // lessのコンパイルでコケても終了しない
      .pipe(less())
      .pipe(gulp.dest('css/'))
});

gulp.task('watch', function() {
  gulp.watch('src/js/*.less', ['css']);
});



gulp.task('jsmin', function(){
    console.log('--------- uglify task ----------');
    gulp.src('js/*.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('js'));
});
