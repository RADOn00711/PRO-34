const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var rope, fruit, ground;
var fruit_con;

//imagens (fundo, comida, coelho)
var bg_img, food, rabbit;

//coelho sprite e suas imagens
var bunny;
var blinkimg, eatimg, sadimg;

//PARA SONS -- aula 32 -- atividade prof
var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

//botões -- aula 32 -- atividade aluno
var CutBtn, BalBtn, MuteBtn;

function preload() {
  //IMAGENS 
  bg_img = loadImage('floresta.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  //SONS -- atividade prof -- aula 32
  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  //ANIMAÇÕES 
  blinkimg = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eatimg = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sadimg = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  //LIGAR, DESLIGAR ANIMAÇÕES 
  blinkimg.playing = true;
  eatimg.playing = true;
  sadimg.playing = true;
  sadimg.looping = false;
  eatimg.looping = false;
}

function setup() {
  createCanvas(700, 700);

  frameRate(80);

  //TOCANDO SOM DE FUNDO -- aula 32, aluno
  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //BOTÃO DE CORTAR 
  CutBtn = createImg('cut_btn.png');
  CutBtn.position(220, 30);
  CutBtn.size(60, 60);
  CutBtn.mouseClicked(drop);

  //BOTÃO DE AR -- aula 32, aluno
  blower = createImg('balloon.png');
  blower.position(10, 250);
  blower.size(150, 100);
  blower.mouseClicked(airblow);

  //BOTÃO DE MUTAR -- aula 32, aluno
  mute_btn = createImg('mute.png');
  mute_btn.position(420, 20);
  mute_btn.size(50, 50);
  mute_btn.mouseClicked(mute);

  //CORDA, CHÃO
  rope = new Rope(7, { x: 245, y: 30 });
  ground = new Ground(200, 690, 600, 20);

  //VELOCIDADE DA ANIMAÇÃO
  blinkimg.frameDelay = 20;
  eatimg.frameDelay = 20;

  //COELHO ATUALIZADO -- mexer na posição x, aluno, aula 32
  bunny = createSprite(420, 620, 100, 100);
  bunny.scale = 0.2;

  //ADC ANIMAÇÕES AO COELHO
  bunny.addAnimation('blinking', blinkimg);
  bunny.addAnimation('eating', eatimg);
  bunny.addAnimation('crying', sadimg);
  bunny.changeAnimation('blinking');

  //CORPO DA FRUTA
  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  //LINK, RESTRIÇÃO
  fruit_con = new Link(rope, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

}

function draw() {
  background(51);

  //IMAGEM DE FUNDO
  image(bg_img, 0, 0, 700, 700);

  //EXIBIÇÃO DA FRUTA
  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  //EXIBIÇÃO DA CORDA E DO GROUND
  rope.show();
  ground.show();

  Engine.update(engine);

  drawSprites();

  //COLISÃO DA FRUTA COM COELHO 
  //aluno colocar som, aula 32
  if (collide(fruit, bunny) == true) {
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  //COLISÃO DA FRUTA COM O CHÃO 
  //aluno parar o som do fundo, colocar o som de triste e anular a fruta
  if (fruit != null && fruit.position.y >= 650) {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit = null;
  }

}

//PARA EXCLUIR A CORDA E A FRUta
//aluno colocar o som de corte de corda, aula 32
function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

//função de aplicação de força horizontal para a direita
//som de ar do balão, aluno aula 32
function airblow() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0.01, y: 0 });
  air.play();
}



//função para mutar o som, nome: mute
//dentro dela, verificar se o som está tocando, se sim, parar o som, senão, tocá-lo
function mute() {
  if (bk_song.isPlaying()) {
    bk_song.stop();
  }
  else {
    bk_song.play();
  }
}


