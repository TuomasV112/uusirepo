window.onload = function () {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  var player;
  var platforms;
  var stars;
  var level = 1; // Level 1
  var remainingStars; // remainingStars variable
  var startTime;
  var timer;
  var score = 0; // Initialize score
  var scoreText; // Variable for score text

  var game = new Phaser.Game(config);

  function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('star', 'assets/star.png');
  }

  function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // remainingStars variable
    remainingStars = stars.getChildren().length;

    // Set the starting time
    startTime = Date.now();

    // Create the timer Game Object
    timer = this.add.text(10, 10, 'Time: 0s', { font: '24px Arial', fill: '#ffffff' });

    // Reset the score to 0 when the level restarts
    score = 0;

    // Create the score Game Object
    scoreText = this.add.text(10, 50, 'Score: 0', { font: '24px Arial', fill: '#ffffff' });
  }

  function update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }

    // Check if stars have been collected
    if (stars.countActive(true) === 0) {
      // Increment the level
      level++;
      // Restart the game 
      this.scene.restart({ level: level });
    }

    // Calculate the elapsed time and update the timer
    var elapsedTime = Date.now() - startTime;
    var seconds = Math.floor(elapsedTime / 1000);
    timer.text = 'Time: ' + seconds + 's';
  }

  function collectStar(player, star) {
    star.disableBody(true, true);
    remainingStars--;
    score += 1000; // Increment the score by 1000
    scoreText.text = 'Score: ' + score; // Update the score text
  }
};