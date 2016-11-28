var WIDTH = 100, HEIGHT = 100;

function resizeCalc(){
  WIDTH = $(window).width();
  HEIGHT = $(window).height();
}


$(function() {


  var stage = new PIXI.Container();
  resizeCalc();
  // create a renderer instance
  var renderer = new PIXI.WebGLRenderer(WIDTH, HEIGHT, {backgroundColor: 0xf4f4f4, resize:true});

  // add the renderer view element to the DOM
  $("#webgltarget").append(renderer.view);



  var imgs = [
    "img/ball_0.png",
    "img/ball_1.png",
    "img/ball_2.png",
    "img/ball_3.png"];
  var textureArr = [];

  var spritesArr = [];

  for(var cnt=0;cnt < imgs.length;cnt ++){
    textureArr.push(PIXI.Texture.fromImage(imgs[cnt]) );
  }



  for(var z=0;z < 10;z ++){
    for(var x= 0;x < 38;x ++){
      var _tx = z - 6;
      _tx = (_tx < 0)? 0:_tx;
      if(z==0){
        _tx = 3;
      }else if(z==1){
        _tx = 2;
      }

      var _t = new PIXI.Sprite(textureArr[_tx]);
      _t.anchor.x = 0.5;
      _t.anchor.y = 0.5;
      _t.position.x = WIDTH/2;
      _t.position.y = 0;
      _t.scale.x = 1;
      _t.scale.y = 1;

      var _al = (z < 3)? 0.14 + (z+1)*0.21: 1;
      _t.alpha = _al;
      stage.addChild(_t);
      spritesArr.push(_t);
    }
  }

  var mc = 2.7;
  var speed = -0.2;
  requestAnimationFrame(animate);


  function animate() {

      requestAnimationFrame( animate );

      // just for fun, lets rotate mr rabbit a little
      for(var z=0;z < 10;z ++){
        var _zz =(z+1)*(z+1)/9;
        for(var x= 0;x < 38;x ++){
          var _tt = spritesArr[x + (z*38)];

            _tt.scale.x = _tt.scale.y = (_zz)*(0.35 + Math.cos(mc/5)*0.033) + 0.17;
            _tt.position.x = (x - 19)* (45 + ((_zz)*88)) + (Math.sin(mc/9)*((z+1)*80))+(Math.cos(mc/5)*(z+1)*35) + (((z+2)*0.2)*120) + WIDTH/2;
            _tt.position.y = Math.sin(mc + (x * 0.43)+((z+1)*0.3) ) * (11 + (z+1)*(3 + (Math.sin(mc/6)+0.2)*42)) + ((_zz) * (40+Math.cos(mc/9)*122)) + HEIGHT * 0.34;
          }
        }

      mc+=0.0023 + (Math.sin(speed)+1)* 0.025;
      speed +=0.007;
      // render the stage
      renderer.render(stage);
  }




  var timer = false;
  $(window).resize(function() {
      if (timer !== false) {
          clearTimeout(timer);
      }
      timer = setTimeout(function() {
          resizeCalc();
          renderer.resize(WIDTH, HEIGHT);
      }, 200);
  });

});
