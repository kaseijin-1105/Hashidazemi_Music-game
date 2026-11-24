let song;
let fft;

let notes = [];

let score = 0;

function preload() {
  soundFormats('mp3');
  song = loadSound('assets/song.mp3');
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  fft = new p5.FFT();

  textFont('sans-serif');

}

function draw() {

  background(0, 25);

  if (!song.isPlaying()) {

    fill(255);

    textAlign(CENTER, CENTER);

    textSize(32);

    text("クリックで再生", width/2, height/2);

    return;

  }

  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  //--------------------------------
  // BASS
  //--------------------------------

  noStroke();

  fill(100, 100, 255, 120);

  let bassSize = map(bass, 0, 255, 100, 600);

  circle(
    width / 2,
    height / 2,
    bassSize
  );

  //--------------------------------
  // MID
  //--------------------------------

  stroke(255, 120, 120, 150);

  strokeWeight(2);

  let lines = floor(map(mid, 0, 255, 5, 50));

  for(let i=0;i<lines;i++){

      let angle =
      map(i,0,lines,0,TWO_PI);

      let r =
      map(mid,0,255,100,500);

      line(
        width/2,
        height/2,
        width/2 + cos(angle)*r,
        height/2 + sin(angle)*r
      );
  }

  //--------------------------------
  // TREBLE
  //--------------------------------

  if(treble > 160 && frameCount % 5 === 0){

      notes.push(
          new Note()
      );
  }

  //--------------------------------
  // NOTE
  //--------------------------------

  for(let i=notes.length-1;i>=0;i--){

      notes[i].update();

      notes[i].display();

      if(notes[i].y > height+100){

          notes.splice(i,1);
      }
  }

  //--------------------------------
  // UI
  //--------------------------------

  noStroke();

  fill(255);

  textAlign(LEFT);

  textSize(30);

  text("SCORE : " + score ,20,40);

}

function mousePressed(){

    userStartAudio();

    if(!song.isPlaying()){

        song.play();
    }

    for(let i=notes.length-1;i>=0;i--){

        if(notes[i].hit(mouseX,mouseY)){

            score += 100;

            notes.splice(i,1);
        }
    }
}

class Note{

    constructor(){

        this.x = random(50,width-50);

        this.y = -30;

        this.size = random(30,50);

        this.speed = random(3,8);

    }

    update(){

        this.y += this.speed;

    }

    display(){

        noStroke();

        fill(
            random(150,255),
            random(150,255),
            0
        );

        ellipse(
            this.x,
            this.y,
            this.size
        );

    }

    hit(mx,my){

        let d = dist(
            mx,my,
            this.x,this.y
        );

        return d < this.size/2;

    }

}

function windowResized(){

    resizeCanvas(
        windowWidth,
        windowHeight
    );

}
