class MainScene extends Phaser.Scene {
    player;
    cursors;
    stars;
    platforms;
    score = 0;
    scoreText;
    bombs;
    gameOver = false;
    sounds: any = {};

    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload() {
        this.load.setBaseURL('/assets/');
        this.load.image('sky', 'backgrounds/sky.png');
        this.load.image('ground', 'objects/platform.png');
        this.load.image('star', 'sprites/star.png');
        this.load.image('bomb', 'sprites/bomb.png');
        this.load.spritesheet('dude', 'sprites/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.audio('jump', 'sounds/effects/jump.ogg');
        this.load.audio('success', 'sounds/effects/success.ogg');
        this.load.audio('hit', 'sounds/effects/hit.ogg');
        this.load.audio('collected', 'sounds/effects/collected.ogg');
        this.load.audio('bgmusic', 'sounds/music/bg-music.ogg');
    }

    create() {
        this.sounds['jump'] = this.sound.add('jump');
        this.sounds['hit'] = this.sound.add('hit');
        this.sounds['success'] = this.sound.add('success');
        this.sounds['collected'] = this.sound.add('collected');
        (this.sounds['bgmusic'] = this.sound.add('bgmusic')).play();
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms
            .create(400, 568, 'ground')
            .setScale(2)
            .refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(300);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms, null, null, null);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(this.stars, this.platforms, null, null, null);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms, null, null, null);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update(time: number, delta: number) {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.sounds.jump.play();
            this.player.setVelocityY(-530);
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');
        this.sounds.hit.play();
        this.gameOver = true;
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.sounds.collected.play();
        this.scoreText.setText('Score: ' + this.score);
        if (this.stars.countActive(true) === 0) {
            this.sounds.success.play();
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true);
            });

            let x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            let bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }
}

export default MainScene;
