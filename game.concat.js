

/* ===== js/game/RKD.Games.RocketD.Boot.js ===== */

var RKD = {}; RKD.Games = {}; RKD.Games.RocketD = {};

RKD.Games.RocketD.Boot = function (game) {


}

RKD.Games.RocketD.Boot.prototype = {

    preload: function () {

    },

    create: function () {

        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 640;
            this.scale.minHeight = 360;
            this.scale.maxWidth = 1920;
            this.scale.maxHeight = 1080;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.refresh();
        }
        else {
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.refresh();
        }


        this.game.playGameAudio = function (marker, volume, fadeIn) {
            fadeIn = fadeIn || false;
            volume = volume || 1;
            var sound = this.gameAudio.get(marker);
            if (!sound.isPlaying) {
                if (fadeIn) {
                    sound.fadeTo(500, volume);
                } else {
                    this.gameAudio.play(marker, volume);
                }
            }
        };

        this.game.sound.stopGameAudio = function (marker, fadeOut) {
            if (this.sprite != null) {
                var i = this.sfx.indexOf(marker);
                if (i >= 0) {
                    this.sfx.splice(i, 1);
                    this.sprite.stop(marker);
                }
            }
        };

        this.game.sound.playMusic = function (marker, volume, callback) {
            if (this.sprite != null) {
                if (this.music.indexOf(marker) < 0) {
                    this.music.push(marker);
                    var music = this.sprite.play(marker, volume);
                    if (callback !== undefined) {
                        music.onMarkerComplete.addOnce(callback, this);
                    }
                }
            }
        };

        this.game.sound.stopMusic = function (marker, volume) {
            if (this.sprite != null) {
                var i = this.music.indexOf(marker);
                if (i >= 0) {
                    this.music.splice(i, 1);
                    this.sprite.stop(marker);
                }
            }
        };


        this.state.start('Preloader')

    },

    update: function () {

    },

    render: function () {

    }

}

/* ===== js/game/RKD.Games.RocketD.Preloader.js ===== */

RKD.Games.RocketD.Preloader = function (game) {
}

RKD.Games.RocketD.Preloader.prototype = {

    preload: function () {

        // Images
        this.game.load.image("rkd-logo", "assets/image/rkd-logo-white.png");
        this.game.load.image("rkd-logo-shadow", "assets/image/rkd-logo-shadow.png");
        this.game.load.image("rocket-large", "assets/image/rocketship-large.png");
        this.game.load.image("rocket", "assets/image/rocketship.png");
        this.game.load.image("exhaust-large", "assets/image/exhaust-large.png");
        this.game.load.image("exhaust", "assets/image/exhaust.png");
        this.game.load.image("cloud1", "assets/image/cloud-01.png");
        this.game.load.image("cloud2", "assets/image/cloud-02.png");
        this.game.load.image("cloud3", "assets/image/cloud-03.png");
        this.game.load.image("cloud4", "assets/image/cloud-04.png");
        this.game.load.image("mountain", "assets/image/mountain.png");
        this.game.load.image('fullscreen', 'assets/image/fullscreen.png');
        this.game.load.image("key-left", "assets/image/keyboard_key_left.png");
        this.game.load.image("key-right", "assets/image/keyboard_key_right.png");
        this.game.load.image("key-up", "assets/image/keyboard_key_up.png");
        this.game.load.image("key-down", "assets/image/keyboard_key_down.png");
        this.game.load.image("key-shadow", "assets/image/keyboard_key_shadow.png");
        this.game.load.image("key-empty", "assets/image/keyboard_key_empty.png");
        this.game.load.image("checkmark", "assets/image/checkmark.png");
        this.game.load.image("indicator", "assets/image/indicator.png");
        
        this.game.load.spritesheet( "checkbox", "assets/image/checkbox.png", 25, 25 );

        // AudioSprites
        if (this.game.device.firefox || this.game.device.chrome || this.game.device.chromeOS) {
            this.game.load.audiosprite('gameaudio', 'assets/audio/sprites/rocket-d-gameaudio.ogg', 'assets/audio/sprites/rocket-d-gameaudio.json');
        } else {
            this.game.load.audiosprite('gameaudio', 'assets/audio/sprites/rocket-d-gameaudio.mp3', 'assets/audio/sprites/rocket-d-gameaudio.json');
        }

    },

    create: function () {

        // AudioSprite - Add game Audio to game.sound (SoundManager) object
        this.game.gameAudio = this.add.audioSprite('gameaudio');
        this.game.gameAudio.allowMultiple = true;

        this.state.start('PreSplash')
    },

    update: function () {

    },

    render: function () {

    }

}

/* ===== js/game/RKD.Games.RocketD.Tutorial.js ===== */

RKD.Games.RocketD.Tutorial = function (game) {
    this.hideTutorial = localStorage.getItem('hideTutorial') == "true" || false;
    this.updateTime = 0;
    this.calibrated = false;
    this.cursors;

    this.KEY_SPACING = 125;
    this.KEY_SHADOW_OFFSET = 10;
    this.KEY_SIZE = 100;
    this.KEY_PRESSED_SHADOW_OFFSET = 7;
    this.KEY_PRESSED_OFFSET = 3;

}

RKD.Games.RocketD.Tutorial.prototype = {

    init: function () {
        if (this.hideTutorial) {
            this.state.start('Game');
            return;
        }
    },

    preload: function () {
    },

    create: function () {

        this.game.gameAudio.play("music-bg03-hard-loop", 0.5);
        this.game.camera.flash(0x000000);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // add background
        var backgroundBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        var gradient = backgroundBitmap.context.createLinearGradient(0, 0, 0, this.game.height);
        gradient.addColorStop(0, "#000");
        gradient.addColorStop(0.75, "#0551ca");
        gradient.addColorStop(1, "#007dc4");
        backgroundBitmap.context.fillStyle = gradient;
        backgroundBitmap.context.fillRect(0, 0, this.game.width, this.game.height);
        this.game.add.sprite(0, 0, backgroundBitmap);

        // add Test
        this.tutorialText = this.game.add.text(this.game.width / 2, this.game.height - 50, "Calibrating Thrusters...", { font: "Muli", fontSize: "36px", fill: "#FFF" });
        this.tutorialText.padding.set(10);
        this.tutorialText.anchor.setTo(0.5, 0.5);
        this.tutorialText.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);

        this.checkbox = this.game.add.checkbox(this.game.width - 300, 20, { text: "show next time", style: { font: "Muli", fontSize: "18px", fill: "#fff" } }, "checkbox", !this.hideTutorial);
        // adding click-event
        this.checkbox.events.onInputUp.add(function (elm, pointer) {
            localStorage.setItem('hideTutorial', !this.checkbox.state);
        }, this);

        this.rocket = new RKD.Games.RocketD.Rocket(this.game, this.game.width / 2 - 200, this.game.height / 2, "demo");
        this.rocket.cursors = this.cursors;
        this.game.world.add(this.rocket);

        this.rocketBlastOffTween = this.game.add.tween(this.rocket).to({ y: 0 - this.rocket.height }, 1000, Phaser.Easing.Cubic.In, false);
        this.rocketBlastOffTween.onComplete.add(this.blastOffComplete, this);

        // add Keyboard Buttons

        var keygroup = this.game.add.group();

        this.keyLeftContainer = this.game.add.sprite(this.rocket.right, this.rocket.y);
        this.keyDownContainer = this.game.add.sprite(this.rocket.right + this.KEY_SPACING, this.rocket.y);
        this.keyRightContainer = this.game.add.sprite(this.rocket.right + (this.KEY_SPACING * 2), this.rocket.y);
        this.keyUpContainer = this.game.add.sprite(this.rocket.right + this.KEY_SPACING, this.rocket.y - this.KEY_SPACING);

        this.keyLeft = this.game.add.sprite(0, 0, "key-left");
        this.keyLeftShadow = this.game.add.sprite(this.KEY_SHADOW_OFFSET, this.KEY_SHADOW_OFFSET, "key-shadow");
        this.keyLeftCheckmark = this.game.add.sprite(0, this.KEY_SIZE, "checkmark");
        this.keyLeftCheckmark.anchor.setTo(0, 1);
        this.keyLeftCheckmark.visible = false;
        this.keyLeftCheckmark.scale = new Phaser.Point(3,3);
        this.keyLeftCheckmarkTween = this.game.add.tween(this.keyLeftCheckmark.scale).to({x:1,y:1}, 150, Phaser.Easing.Linear.None, false);
        this.keyLeftContainer.addChild(this.keyLeftShadow);
        this.keyLeftContainer.addChild(this.keyLeft);
        this.keyLeftContainer.addChild(this.keyLeftCheckmark);

        this.keyDown = this.game.add.sprite(0, 0, "key-down");
        this.keyDownShadow = this.game.add.sprite(this.KEY_SHADOW_OFFSET, this.KEY_SHADOW_OFFSET, "key-shadow");
        this.keyDownCheckmark = this.game.add.sprite(0, this.KEY_SIZE, "checkmark");
        this.keyDownCheckmark.anchor.setTo(0, 1);
        this.keyDownCheckmark.visible = false;
        this.keyDownCheckmark.scale = new Phaser.Point(3,3);
        this.keyDownCheckmarkTween = this.game.add.tween(this.keyDownCheckmark.scale).to({x:1,y:1}, 150, Phaser.Easing.Linear.None, false);
        this.keyDownContainer.addChild(this.keyDownShadow);
        this.keyDownContainer.addChild(this.keyDown);
        this.keyDownContainer.addChild(this.keyDownCheckmark);

        this.keyRight = this.game.add.sprite(0, 0, "key-right");
        this.keyRightShadow = this.game.add.sprite(this.KEY_SHADOW_OFFSET, this.KEY_SHADOW_OFFSET, "key-shadow");
        this.keyRightCheckmark = this.game.add.sprite(0, this.KEY_SIZE, "checkmark");
        this.keyRightCheckmark.anchor.setTo(0, 1);
        this.keyRightCheckmark.visible = false;
        this.keyRightCheckmark.scale = new Phaser.Point(3,3);
        this.keyRightCheckmarkTween = this.game.add.tween(this.keyRightCheckmark.scale).to({x:1,y:1}, 150, Phaser.Easing.Linear.None, false);
        this.keyRightContainer.addChild(this.keyRightShadow);
        this.keyRightContainer.addChild(this.keyRight);
        this.keyRightContainer.addChild(this.keyRightCheckmark);

        this.keyUp = this.game.add.sprite(0, 0, "key-up");
        this.keyUpShadow = this.game.add.sprite(this.KEY_SHADOW_OFFSET, this.KEY_SHADOW_OFFSET, "key-shadow");
        this.keyUpCheckmark = this.game.add.sprite(0, this.KEY_SIZE, "checkmark");
        this.keyUpCheckmark.anchor.setTo(0, 1);
        this.keyUpCheckmark.visible = false;
        this.keyUpCheckmark.scale = new Phaser.Point(3,3);
        this.keyUpCheckmarkTween = this.game.add.tween(this.keyUpCheckmark.scale).to({x:1,y:1}, 150, Phaser.Easing.Linear.None, false);
        this.keyUpContainer.addChild(this.keyUpShadow);
        this.keyUpContainer.addChild(this.keyUp);
        this.keyUpContainer.addChild(this.keyUpCheckmark);

        keygroup.add(this.keyLeftContainer);
        keygroup.add(this.keyDownContainer);
        keygroup.add(this.keyRightContainer);
        keygroup.add(this.keyUpContainer);
        keygroup.x += 200;

    },

    startGame: function () {
        this.game.state.start('Game');
    },

    blastOff: function () {
        var bg = this.game.gameAudio.get("music-bg03-hard-loop");
        if (bg.isPlaying) {
            bg.fadeOut();
        }

        this.rocketBlastOffTween.start();

    },

    blastOffComplete: function () {
        this.rocket.destroy();
        this.game.camera.fade(0x000000);
        this.game.camera.onFadeComplete.add(this.startGame, this);
    },

    update: function () {
        this.updateKeySprites();

        if (this.keyLeftCheckmark.visible && this.keyDownCheckmark.visible & this.keyRightCheckmark.visible && this.keyUpCheckmark.visible && !this.calibrated) {
            this.calibrated = true;
            this.tutorialText.setText("All systems go!  Press enter to continue...")
        }

        if (this.calibrated && this.enterKey.isDown) {
            this.blastOff();
        }
    },

    updateKeySprites: function () {

        if (this.cursors.left.isDown) {
            this.keyLeft.x = this.KEY_PRESSED_OFFSET;
            this.keyLeft.y = this.KEY_PRESSED_OFFSET;
            this.keyLeftShadow.x = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyLeftShadow.y = this.KEY_PRESSED_SHADOW_OFFSET;
            if(!this.keyLeftCheckmarkTween.isPlaying) { this.keyLeftCheckmarkTween.start(); }
            this.keyLeftCheckmark.visible = true;
            var sound = this.game.gameAudio.get("sfx-feedback-correct");
            if(!this.keyLeftCheckedPlayed){
                 this.game.gameAudio.play("sfx-feedback-correct");
                 this.keyLeftCheckedPlayed = true;
            }
        } else {
            this.keyLeft.x = 0;
            this.keyLeft.y = 0;
            this.keyLeftShadow.x = this.KEY_SHADOW_OFFSET;
            this.keyLeftShadow.y = this.KEY_SHADOW_OFFSET;
        }

        if (this.cursors.down.isDown) {
            this.keyDown.x = this.KEY_PRESSED_OFFSET;
            this.keyDown.y = this.KEY_PRESSED_OFFSET;
            this.keyDownShadow.x = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyDownShadow.y = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyDownCheckmark.visible = true;
            if(!this.keyDownCheckmarkTween.isPlaying) { this.keyDownCheckmarkTween.start(); }
            this.keyDownCheckmark.visible = true;
            var sound = this.game.gameAudio.get("sfx-feedback-correct");
            if(!this.keyDownCheckedPlayed){
                 this.game.gameAudio.play("sfx-feedback-correct");
                 this.keyDownCheckedPlayed = true;
            }
        } else {
            this.keyDown.x = 0;
            this.keyDown.y = 0;
            this.keyDownShadow.x = this.KEY_SHADOW_OFFSET;
            this.keyDownShadow.y = this.KEY_SHADOW_OFFSET;
        }

        if (this.cursors.right.isDown) {
            this.keyRight.x = this.KEY_PRESSED_OFFSET;
            this.keyRight.y = this.KEY_PRESSED_OFFSET;
            this.keyRightShadow.x = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyRightShadow.y = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyRightCheckmark.visible = true;
            if(!this.keyRightCheckmarkTween.isPlaying) { this.keyRightCheckmarkTween.start(); }
            this.keyRightCheckmark.visible = true;
            var sound = this.game.gameAudio.get("sfx-feedback-correct");
            if(!this.keyRightCheckedPlayed){
                 this.game.gameAudio.play("sfx-feedback-correct");
                 this.keyRightCheckedPlayed = true;
            }
        } else {
            this.keyRight.x = 0;
            this.keyRight.y = 0;
            this.keyRightShadow.x = this.KEY_SHADOW_OFFSET;
            this.keyRightShadow.y = this.KEY_SHADOW_OFFSET;
        }

        if (this.cursors.up.isDown) {
            this.keyUp.x = this.KEY_PRESSED_OFFSET;
            this.keyUp.y = this.KEY_PRESSED_OFFSET;
            this.keyUpShadow.x = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyUpShadow.y = this.KEY_PRESSED_SHADOW_OFFSET;
            this.keyUpCheckmark.visible = true;
            if(!this.keyUpCheckmarkTween.isPlaying) { this.keyUpCheckmarkTween.start(); }
            this.keyUpCheckmark.visible = true;
            var sound = this.game.gameAudio.get("sfx-feedback-correct");
            if(!this.keyUpCheckedPlayed){
                 this.game.gameAudio.play("sfx-feedback-correct");
                 this.keyUpCheckedPlayed = true;
            }
        } else {
            this.keyUp.x = 0;
            this.keyUp.y = 0;
            this.keyUpShadow.x = this.KEY_SHADOW_OFFSET;
            this.keyUpShadow.y = this.KEY_SHADOW_OFFSET;
        }

    },

    render: function () {
    }

}

/* ===== js/game/RKD.Games.RocketD.Rocket.js ===== */


RKD.Games.RocketD.Rocket = function (game, x, y, mode) {

    this.initialX = x;
    this.initialY = y;
    this.ROCKET_SCALE_DEMO = .5;
    this.ROCKET_SCALE_GAME = .20;
    this.ROCKET_ROTATION_RADIANS = 5;
    this.SIDE_THRUST_FUELCONSUMPTION = 1;
    this.HIGH_THRUST_FUELCONSUMPTION = 5;
    this.LOW_THRUST_FUELCONSUMPTION = 2;
    this.EXHAUST_LOW_SCALE = .75;
    this.EXHAUST_SIDE_SCALE = .50;
    this.EXHAUST_HIGH_SCALE = 1;
    this.SPEED_WARNING_AMOUNT = 400;
    this.FUEL_WARNING_AMOUNT = 750;

    this.isDemo = (mode === "demo");
    this.alive = true;

    // need this
    this.game = game;

    // create Rocket
    Phaser.Sprite.call(this, game, 0, 0, 'rocket-large', 0);

    this.build();

    return this;
};

RKD.Games.RocketD.Rocket.prototype = Object.create(Phaser.Sprite.prototype);
RKD.Games.RocketD.Rocket.prototype.constructor = RKD.Games.RocketD.Rocket;

RKD.Games.RocketD.Rocket.prototype.build = function () {

    this.events.onKilled.add(this.onKilledHandler, this);

    this.game.camera.follow(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5, 0.5);

    this.exhaust = this.game.add.sprite(0, 0, 'exhaust-large');
    this.exhaust.anchor.setTo(0.5, 0);
    this.exhaust.x = this.left + 135 + (this.exhaust.width / 2);
    this.exhaust.y = this.top + 535;
    this.addChild(this.exhaust);

    if (this.isDemo) {
        this.scale = new Phaser.Point(this.ROCKET_SCALE_DEMO, this.ROCKET_SCALE_DEMO);
    } else {
        this.scale = new Phaser.Point(this.ROCKET_SCALE_GAME, this.ROCKET_SCALE_GAME);

        this.maxHealth = 7000;
        this.maxFuel = 2000;
        this.setHealth(this.maxHealth);

        this.body.gravity.y = 400;
        this.ExhaustHigh = this.body.gravity.y * 1.75;
        this.ExhaustLow = this.ExhaustHigh * .70;
        this.SideExhaust = this.ExhaustLow * .50;
        this.body.collideWorldBounds = true;
        this.body.maxVelocity = this.body.gravity.y;
        this.body.drag.x = this.body.gravity.y * .50;
        this.body.drag.y = this.body.gravity.y * .25;
        this.body.mass = 10;
        this.body.bounce.y = 0.5;
    }

    this.reset();

};

RKD.Games.RocketD.Rocket.prototype.onKilledHandler = function () {
    this.game.gameAudio.play("sfx-explosion");
    this.handleTelemetrySounds();
},

    RKD.Games.RocketD.Rocket.prototype.pause = function () {
        this.body.immovable = true;
        this.body.enable = false;
    }

RKD.Games.RocketD.Rocket.prototype.unpause = function () {
    this.body.immovable = false;
    this.body.enable = true;
}

RKD.Games.RocketD.Rocket.prototype.reset = function () {
    if (this.isDemo) {
        this.x = this.initialX;
        this.y = this.initialY;
        this.rocketBounceTween = this.game.add.tween(this).to({ y: this.y + 3 }, 200, Phaser.Easing.Bounce.InOut, true, 0, -1, true);
    } else {
        this.body.velocity = new Phaser.Point(0, 0);
        this.revive(this.maxHealth);
        this.x = this.game.math.between(200, this.game.width - 200);
        this.y = 200;
        this.data.fuel = this.maxFuel; // set default
        this.data.landed = false;
    }
}

RKD.Games.RocketD.Rocket.prototype.handleTelemetrySounds = function () {

    this.tooFast = this.game.gameAudio.get("sfx-telemetry-too-fast-loop");
    this.lowFuel = this.game.gameAudio.get("sfx-telemetry-low-fuel-loop");

    if (this.alive) {

        if (this.body.speed > this.SPEED_WARNING_AMOUNT && !this.data.landed) {
            if (!this.tooFast.isPlaying) {
                this.game.gameAudio.play("sfx-telemetry-too-fast-loop");
            }
        } else {
            if (this.tooFast.isPlaying) this.tooFast.stop();
        }


        if (this.data.fuel < this.FUEL_WARNING_AMOUNT && !this.data.landed) {
            if (!this.lowFuel.isPlaying) {
                this.data.lowFuel = true;
                this.game.gameAudio.play("sfx-telemetry-low-fuel-loop");
            }
        } else {
            this.data.lowFuel = false;
            if (this.lowFuel.isPlaying) this.lowFuel.stop();
        }

    } else {
        if (this.lowFuel.isPlaying) this.lowFuel.stop();
        if (this.tooFast.isPlaying) this.tooFast.stop();
    }


}

RKD.Games.RocketD.Rocket.prototype.handleExhaustSound = function () {
    if (this.exhaust.visible) {
        if (this.exhaust.scale.x === this.EXHAUST_HIGH_SCALE) {

            var sound = this.game.gameAudio.get("sfx-exhaust-high-loop");
            if (!sound.isPlaying) {
                this.game.gameAudio.play("sfx-exhaust-high-loop", 1);
            }
            this.game.gameAudio.stop("sfx-exhaust-side-loop");
            this.game.gameAudio.stop("sfx-exhaust-low-loop");

        } else if (this.exhaust.scale.x === this.EXHAUST_SIDE_SCALE) {
            var sound = this.game.gameAudio.get("sfx-exhaust-side-loop");
            if (!sound.isPlaying) {
                this.game.gameAudio.play("sfx-exhaust-side-loop", 1);
            }
            this.game.gameAudio.stop("sfx-exhaust-high-loop");
            this.game.gameAudio.stop("sfx-exhaust-low-loop");
        } else {
            var sound = this.game.gameAudio.get("sfx-exhaust-low-loop");
            if (!sound.isPlaying) {
                this.game.gameAudio.play("sfx-exhaust-low-loop", 1);
            }
            this.game.gameAudio.stop("sfx-exhaust-side-loop");
            this.game.gameAudio.stop("sfx-exhaust-high-loop");
        }
    } else {
        this.game.gameAudio.stop("sfx-exhaust-side-loop");
        this.game.gameAudio.stop("sfx-exhaust-low-loop");
        this.game.gameAudio.stop("sfx-exhaust-high-loop");
    }
}

RKD.Games.RocketD.Rocket.prototype.thrustLeft = function () {
    this.exhaust.scale = new Phaser.Point(this.EXHAUST_SIDE_SCALE, this.EXHAUST_SIDE_SCALE);
    this.body.rotation = -this.ROCKET_ROTATION_RADIANS;
    if (!this.exhaust.visible) this.exhaust.visible = true;

    if (this.isDemo) {
    } else {
        this.body.acceleration.x -= this.SideExhaust;
        this.data.fuel -= this.SIDE_THRUST_FUELCONSUMPTION;
    }
}

RKD.Games.RocketD.Rocket.prototype.thrustRight = function () {
    this.exhaust.scale = new Phaser.Point(this.EXHAUST_SIDE_SCALE, this.EXHAUST_SIDE_SCALE);
    this.body.rotation = this.ROCKET_ROTATION_RADIANS;
    if (!this.exhaust.visible) this.exhaust.visible = true;

    if (this.isDemo) {
    } else {
        this.body.acceleration.x += this.SideExhaust;
        this.data.fuel -= this.SIDE_THRUST_FUELCONSUMPTION;
    }
}

RKD.Games.RocketD.Rocket.prototype.thrustHigh = function () {
    this.exhaust.scale = new Phaser.Point(this.EXHAUST_HIGH_SCALE, this.EXHAUST_HIGH_SCALE);
    if (!this.exhaust.visible) this.exhaust.visible = true;

    if (this.isDemo) {
    } else {
        this.body.acceleration.y -= this.ExhaustHigh;
        this.data.fuel -= this.HIGH_THRUST_FUELCONSUMPTION;
    }
}

RKD.Games.RocketD.Rocket.prototype.thrustLow = function () {

    this.exhaust.scale = new Phaser.Point(this.EXHAUST_LOW_SCALE, this.EXHAUST_LOW_SCALE);
    if (!this.exhaust.visible) this.exhaust.visible = true;

    if (this.isDemo) {
    } else {
        this.body.acceleration.y -= this.ExhaustLow;
        this.data.fuel -= this.LOW_THRUST_FUELCONSUMPTION;
    }
}

RKD.Games.RocketD.Rocket.prototype.update = function () {


    // hide the exhaust unless a key is pressed
    this.exhaust.visible = false;

    // reset the rotation unless a key is pressed
    this.body.rotation = 0;

    if (!this.isDemo) {

        this.data.hasFuel = (this.data.fuel > 0);

        //  Reset the acceleration
        this.body.acceleration.x = 0;
        this.body.acceleration.y = 0;

        // check fuel
        if (this.data.fuel < 0) this.data.fuel = 0;

    }

    if (this.alive && !this.data.landed && (this.isDemo || this.data.hasFuel)) {

        if (this.cursors.left.isDown) {
            this.thrustLeft();
        } else if (this.cursors.right.isDown) {
            this.thrustRight();
        }

        if (this.cursors.up.isDown) {
            this.thrustHigh();
        } else if (this.cursors.down.isDown) {
            this.thrustLow();
        }


    }

    // handle exhaust sounds after final exhaust scaling is known
    this.handleExhaustSound();
    this.handleTelemetrySounds();

};

/* ===== js/game/RKD.Games.RocketD.PreSplash.js ===== */

RKD.Games.RocketD.PreSplash = function (game) {
    this.updateTime = 0;
}

RKD.Games.RocketD.PreSplash.prototype = {

    init: function () {
    },

    preload: function () {
    },

    toggleFullScreen: function () {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen();
        }
    },

    create: function () {

        if (this.game.device.touch && !this.game.device.desktop) {
            // Button: add fullscreen toggle
            var fullScreenButton = this.game.add.button(this.game.width - 180, this.game.height - 110, 'fullscreen', this.toggleFullScreen, this);
            fullScreenButton.fixedToCamera = true;
        }

        // Create Splash Screen Objects ***********************************************************************

        // Bitmap: Background Gradient
        var backgroundBitmapData = this.game.add.bitmapData(this.game.width, this.game.height);
        var gradient = backgroundBitmapData.context.createLinearGradient(0, 0, 0, this.game.height);
        gradient.addColorStop(0, "#000");
        gradient.addColorStop(0.75, "#0551ca");
        gradient.addColorStop(1, "#007dc4");
        backgroundBitmapData.context.fillStyle = gradient;
        backgroundBitmapData.context.fillRect(0, 0, this.game.width, this.game.height);
        this.game.add.sprite(0, 0, backgroundBitmapData);

        var hCenter = this.game.width / 2;
        var vCenter = this.game.height / 2;

        // Text: add start instructions
        var startText = (this.game.device.desktop) ? "press enter or click to start..." : "touch screen...";
        var startTitle = this.game.add.text(hCenter, vCenter, startText, { font: "Muli", fontSize: '36px', fill: '#eee' });
        startTitle.padding.set(10);
        startTitle.anchor.setTo(0.5, 0.5);
        startTitle.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);

        // Group: add to game logo and titles
        var GameLogoGroup = this.game.add.group();
        GameLogoGroup.add(startTitle);

        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.addOnce(this.nextStage, this);
        this.game.input.onDown.addOnce(this.nextStage, this);
        
    },
    
    fadeComplete: function () {
        this.state.start('Splash');
    },

    nextStage: function () {
        
var sound = this.game.sound;
        var ctx = sound && sound.usingWebAudio ? sound.context : null;
        if (ctx && ctx.state === "suspended") {
            try {
                var p = ctx.resume();
                if (p && p.then) {
                p.then(this._fadeToSplash.bind(this)).catch(this._fadeToSplash.bind(this));
                return;
                }
            } catch (e) {
                // ignore and continue transition
            }
        }

        this.game.camera.fade();
        this.game.camera.onFadeComplete.addOnce(this.fadeComplete, this);
    },

    update: function () {
        if (typeof this.enterKey !== "undefined" && this.enterKey.isDown) {
            this.nextStage();
        }
    },

    render: function () {
    }

}

/* ===== js/game/RKD.Games.RocketD.Splash.js ===== */

RKD.Games.RocketD.Splash = function (game) {
    this.sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.5;
    this.musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.5;
    this.hideTutorial = localStorage.getItem('hideTutorial') == "true" || false;
    this.updateTime = 0;
}

RKD.Games.RocketD.Splash.prototype = {

    init: function () {
        //this.state.start('Game');
    },

    preload: function () {
    },

    toggleFullScreen: function () {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen();
        }
    },

    create: function () {

        if (this.game.device.touch && !this.game.device.desktop) {
            // Button: add fullscreen toggle
            var fullScreenButton = this.game.add.button(this.game.width - 180, this.game.height - 110, 'fullscreen', this.toggleFullScreen, this);
            fullScreenButton.fixedToCamera = true;
        }

        // Create Splash Screen Objects ***********************************************************************

        // Bitmap: Background Gradient
        var backgroundBitmapData = this.game.add.bitmapData(this.game.width, this.game.height);
        var gradient = backgroundBitmapData.context.createLinearGradient(0, 0, 0, this.game.height);
        gradient.addColorStop(0, "#000");
        gradient.addColorStop(0.75, "#0551ca");
        gradient.addColorStop(1, "#007dc4");
        backgroundBitmapData.context.fillStyle = gradient;
        backgroundBitmapData.context.fillRect(0, 0, this.game.width, this.game.height);
        this.game.add.sprite(0, 0, backgroundBitmapData);

        // Sprite: RKD Logo
        var RKDLogo = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'rkd-logo');
        RKDLogo.anchor.setTo(0.5, 0.5);
        RKDLogo.scale = new Phaser.Point(.5, .5);
        RKDLogo.alpha = 0;

        // Text: Presents...
        var presentsTitle = this.game.add.text(this.game.width / 2, RKDLogo.bottom + 50, 'presents...', { font: "Muli", fontSize: '36px', fill: '#FFF' });
        presentsTitle.anchor.setTo(0.5, 0.5);
        presentsTitle.alpha = 0;

        // Group: RocketD Logo
        var RKDLogoGroup = this.game.add.group();
        RKDLogoGroup.add(RKDLogo);
        RKDLogoGroup.add(presentsTitle);

        // Sprite: add the rocket
        var rocket = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 100, 'rocket-large');
        rocket.anchor.setTo(0.5, 0.5);
        rocket.scale = new Phaser.Point(.75, .75);
        rocket.rotation = .75;

        // Sprite: add the exhaust
        this.exhaust = this.game.add.sprite(0, 315, 'exhaust-large');
        this.exhaust.anchor.setTo(0.5, 0.5);
        this.exhaust.scale = new Phaser.Point(.75, .75);
        rocket.addChild(this.exhaust);
        this.animateExhaust = true;

        // Text: add the game title
        var gameTitle = this.game.add.text(rocket.x, rocket.bottom + 75, 'ROCKET DESCENT', { font: "Muli", fontWeight: "bold", fontSize: '75px', fill: '#FFF' });
        gameTitle.padding.set(10);
        gameTitle.anchor.setTo(0.5, 0.5);
        gameTitle.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);

        // Text: add start instructions
        var startText = (this.game.device.desktop) ? "press enter to start" : "touch screen to start";
        var startTitle = this.game.add.text(rocket.x, rocket.bottom + 150, startText, { font: "Muli", fontSize: '36px', fill: '#eee' });
        startTitle.padding.set(10);
        startTitle.anchor.setTo(0.5, 0.5);
        startTitle.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);

        // Group: add to game logo and titles
        var GameLogoGroup = this.game.add.group();
        GameLogoGroup.add(rocket);
        GameLogoGroup.add(gameTitle);
        GameLogoGroup.add(startTitle);

        // initialize scale
        GameLogoGroup.scale = new Phaser.Point(0, 0);

        // Create Tweens ***********************************************************************
        var fadeInRKDLogoSprite = this.game.add.tween(RKDLogo).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.In, false, 1000);
        var fadeInPresentsText = this.game.add.tween(presentsTitle).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.In);
        var fadeOutRKDLogoGroup = this.game.add.tween(RKDLogoGroup).to({ alpha: 0 }, 2000, Phaser.Easing.Exponential.In);
        var scaleInGameLogoGroup = this.game.add.tween(GameLogoGroup.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Exponential.In, false, 0, 0, false);
        scaleInGameLogoGroup.onComplete.addOnce(this.flashScreen, this);
        var bounceRocket = this.game.add.tween(rocket).to({ y: rocket.y + 3 }, 200, Phaser.Easing.Bounce.InOut, true, 0, -1, true);
        var rotateBackAndForthRocket = this.game.add.tween(rocket).to({ rotation: rocket.rotation + .112 }, 1000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
        var scaleInAndOutstartTitle = this.game.add.tween(startTitle.scale).to({ x: 0.95, y: 0.95 }, 200, Phaser.Easing.Bounce.InOut, true, 0, -1, true);

        // Chain Tweens ***********************************************************************
        fadeInRKDLogoSprite.chain(fadeInPresentsText);
        fadeInPresentsText.chain(fadeOutRKDLogoGroup);
        fadeOutRKDLogoGroup.chain(scaleInGameLogoGroup);

        // Entry Point ***********************************************************************
        //this.game.camera.flash(0xeeeeee, 1000);
        this.game.camera.flash(0x000000);
        this.game.camera.onFlashComplete.addOnce(function () { this.playDanteSound(); fadeInRKDLogoSprite.start(); }, this);
    },

    playDanteSound: function(){
        var sound = this.game.gameAudio.get("sfx-dante-intro");
        if (!sound.isPlaying) {
            this.game.gameAudio.play("sfx-dante-intro");
        }
    },

    flashScreen: function () {
        var sound = this.game.gameAudio.get("music-bg-hard-loop");
        if (!sound.isPlaying) {
            this.game.gameAudio.play("music-bg-hard-loop");
        }
        this.game.camera.flash(0xffffff);
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    fadeComplete: function () {
        this.state.start('Tutorial');
    },

    nextStage: function () {
        var sound = this.game.gameAudio.get("music-bg-hard-loop");
        if (sound.isPlaying) {
            sound.fadeOut(450);
        }
        this.game.camera.fade();
        this.game.camera.onFadeComplete.addOnce(this.fadeComplete, this);
    },

    update: function () {
        if (typeof this.enterKey !== "undefined" && this.enterKey.isDown) {
            this.nextStage();
        }

        // randomly flash the exhaust
        if (this.animateExhaust === true && this.game.time.now > this.updateTime) {
            this.exhaust.visible = Math.random() > 0.5;
            this.updateTime = this.game.time.now + 150;
        }
    },

    render: function () {
    }

}

/* ===== js/game/RKD.Games.RocketD.Cloud.js ===== */

RKD.Games.RocketD.Cloud = function (game, cloudType, x, y, speed) {
    this.initialPositionX = x;
    this.initialPositionY = ((y < 300) ? y = 300 : (y > parseInt(game.world.height / 1.5)) ? parseInt(game.world.height / 1.5) : y);
    this.alive = true;
    this.speed = speed;

    // need this
    this.game = game;

    // create cloud
    Phaser.Sprite.call(this, game, this.initialPositionX, this.initialPositionY, cloudType, 0);

    this.build();

    return this;
};

RKD.Games.RocketD.Cloud.prototype = Object.create(Phaser.Sprite.prototype);
RKD.Games.RocketD.Cloud.prototype.constructor = RKD.Games.RocketD.Cloud;

RKD.Games.RocketD.Cloud.prototype.build = function () {
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.x = this.speed;
};

RKD.Games.RocketD.Cloud.prototype.pause = function () {
    this.body.immovable = true;
    this.body.enable = false;
}

RKD.Games.RocketD.Cloud.prototype.unpause = function () {
    this.body.immovable = false;
    this.body.enable = true;
}

RKD.Games.RocketD.Cloud.prototype.update = function () {
    if (this.body.x > this.game.world.width) {
        this.body.x = -this.width;
    }
};

/* ===== js/game/RKD.Games.RocketD.Game.js ===== */

RKD.Games.RocketD.Game = function (game) {
    this.cursors;
    this.clouds;
    this.damageThreshold = 700;
    this.gameStop;
    this.applausePlayed = false;
    this.gaspPlayed = false;
    this.fuel;
    this.player;
    this.exhaust;
    this.exhaustLowTween;
    this.exhaustHighTween;
    this.exhauster;
    this.playerSideExhaust;
    this.playerExhaustHigh;
    this.playerExhaustLow;
    this.platforms;
    this.hitPlatform;
    this.restartText;
    this.debugActive = window.location.href.indexOf("debug") >= 0;
    this.gameAudio;
    this.sfxPlaying = [];
    this.musicPlaying = [];
    this.gameWidth;
    this.worldHeight;
    this.gameHeight;
    this.updateTime = 0;

}

RKD.Games.RocketD.Game.prototype = {

    preload: function () {
    },

    create: function () {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.game.camera.flash(0x000000);

        this.createWorld();
        this.createFrontClouds();
        this.createLandingPad();
        this.createPlayer();
        this.createHUD();
        this.createBackgroundMusic();

        this.cursors = this.input.keyboard.createCursorKeys();

        if (this.game.device.touch && !this.game.device.desktop) {
            var fullScreenButton = this.game.add.button(this.game.width - 180, this.game.height - 110, 'fullscreen', this.toggleFullScreen, this);
            fullScreenButton.fixedToCamera = true;
        }

        this.resetGame();
    },

    toggleFullScreen: function () {
        if (this.scale.isFullScreen) {
            this.scale.stopFullScreen();
        } else {
            this.scale.startFullScreen();
        }
    },

    createBackgroundMusic: function () {
        this.mainLoop = this.game.gameAudio.get("music-bg02-main-loop");
        this.winLoop = this.game.gameAudio.get("music-bg02-hard-loop");
        this.loseLoop = this.game.gameAudio.get("music-bg02-soft-loop");
        this.game.gameAudio.play("music-bg02-main-loop");
        this.game.gameAudio.play("music-bg02-hard-loop");
        this.game.gameAudio.play("music-bg02-soft-loop");
    },

    playBGMLoop: function (state) {
        switch (state) {
            case "game":
                if (this.mainLoop && this.mainLoop.mute === true) { this.mainLoop.mute = false; }
                if (this.loseLoop && this.loseLoop.mute === false) { this.loseLoop.mute = true; }
                if (this.winLoop && this.winLoop.mute === false) { this.winLoop.mute = true; }
                break;
            case "win":
                if (this.mainLoop && this.mainLoop.mute === false) { this.mainLoop.mute = true; }
                if (this.loseLoop && this.loseLoop.mute === false) { this.loseLoop.mute = true; }
                if (this.winLoop && this.winLoop.mute === true) { this.winLoop.mute = false; }
                break;
            case "lose":
                if (this.mainLoop && this.mainLoop.mute === false) { this.mainLoop.mute = true; }
                if (this.loseLoop && this.loseLoop.mute === true) { this.loseLoop.mute = false; }
                if (this.winLoop && this.winLoop.mute === false) { this.winLoop.mute = true; }
                break;
            case "":
                if (this.mainLoop && this.mainLoop.mute === false) { this.mainLoop.mute = true; }
                if (this.loseLoop && this.loseLoop.mute === false) { this.loseLoop.mute = true; }
                if (this.winLoop && this.winLoop.mute === false) { this.winLoop.mute = true; }
                break;
        }
    },

    createHUD: function () {
        this.healthText = this.add.text(50, 16, 'health: ' + this.player.health, {
            font: "32px Muli",
            fill: "#FFF"
        });
        this.healthText.padding.set(10);
        this.healthText.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);

        this.fuelText = this.add.text(this.game.width - 200, 16, 'fuel: ' + this.player.data.fuel, {
            font: "32px Muli",
            fill: "#FFF"
        });
        this.fuelText.padding.set(10);
        this.fuelText.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);

        this.createLowFuelFlashingTween();

        var finishedBitmapData = this.game.add.bitmapData(this.game.width - 100, this.game.height - 100);
        finishedBitmapData.context.fillStyle = "rgba(0,0,0,.5)";
        finishedBitmapData.context.fillRect(0, 0, this.game.width - 100, this.game.height - 100);
        this.finishedBackground = this.game.add.sprite(this.game.width / 2, this.game.height / 2, finishedBitmapData);
        this.finishedBackground.scale = new Phaser.Point(0, 0);
        this.finishedBackground.anchor.setTo(.5, .5);
        this.finishedBackground.fixedToCamera = true;
        this.finishedBackgroundTweenIn = this.game.add.tween(this.finishedBackground.scale).to({ x: 1, y: 1 }, 250, Phaser.Easing.Cubic.In, false);
        this.finishedBackgroundTweenOut = this.game.add.tween(this.finishedBackground.scale).to({ x: 0, y: 0 }, 250, Phaser.Easing.Cubic.In, false);
        this.finishedBackgroundTweenOut.onComplete.add(this.resetGame, this);

        this.restartText = this.add.text(0, 0, 'Press enter to try again', {
            font: "Muli",
            boundsAlignV: "middle",
            boundsAlignH: "center",
            fontSize: '5.25em',
            fill: '#FFF'
        });
        this.restartText.anchor.setTo(.5, .5);
        this.restartText.padding.set(10);
        this.restartText.setShadow(5, 5, 'rgba(0,0,0,0.50)', 5);
        this.healthText.fixedToCamera = true;
        this.fuelText.fixedToCamera = true;
        this.finishedBackground.addChild(this.restartText);
    },

    createLowFuelFlashingTween: function () {
        this.lowFuelFlashingTween = this.game.add.tween(this.fuelText).to({ alpha: .25 }, 150, Phaser.Easing.Exponential.InOut, false, 0, -1, true);
    },

    createLandingPad: function () {

        var LandingPadBitmap = this.add.bitmapData(this.math.between(100, 200), 15);
        LandingPadBitmap.context.fillStyle = "#000";
        LandingPadBitmap.context.fillRect(0, 0, LandingPadBitmap.width, LandingPadBitmap.height);

        if (this.landingPad) this.landingPad.destroy();
        this.landingPad = this.platforms.create(this.math.between(0, this.world.width - LandingPadBitmap.width), this.math.between(this.world.height - 400, this.world.height - 100), LandingPadBitmap);
        this.landingPad.body.immovable = true;
        this.landingPad.anchor.setTo(0.5, 0);
    },

    createPlayer: function () {
        this.player = new RKD.Games.RocketD.Rocket(this.game, this.game.width / 2 - 200, this.game.height / 2, "game");
        this.indicator = this.game.add.sprite(0, 0, "indicator");
        this.indicator.alpha = 1;
        this.game.add.tween(this.indicator).to({ alpha: 0.5 }, 150, Phaser.Easing.Exponential.InOut, true, 0, -1, true);
        this.indicator.anchor.setTo(0.5, 0.5);
        this.indicator.pivot = new PIXI.Point(500, 0);
        this.player.addChild(this.indicator);
        this.player.cursors = this.cursors;
        this.game.world.add(this.player);
    },

    createFrontClouds: function () {
        this.frontClouds = this.game.add.group();
        for (var i = 1; i <= 15; i++) {
            this.frontClouds.add(new RKD.Games.RocketD.Cloud(this.game, 'cloud' + this.game.math.between(1, 4).toString(), this.game.world.randomX, this.game.math.between(parseInt(this.game.world.height / 10), parseInt(this.game.world.height / 1.5)), this.game.math.between(50, 150)));
        }
    },

    createWorld: function () {
        this.game.stage.backgroundColor = "#eee";
        this.world.setBounds(0, 0, 1280 * 2, 720 * 2);
        var myBitmap = this.add.bitmapData(this.world.width, this.world.height);
        var grd = myBitmap.context.createLinearGradient(0, 0, 0, this.world.height);
        grd.addColorStop(0, "#000");
        grd.addColorStop(0.75, "#0551ca");
        grd.addColorStop(1, "#007dc4");
        myBitmap.context.fillStyle = grd;
        myBitmap.context.fillRect(0, 0, this.world.width, this.world.height);
        this.add.sprite(0, 0, myBitmap);
        this.physics.startSystem(Phaser.Physics.ARCADE);

        var mountain = this.add.image(-150, this.world.height - 526, "mountain");

        this.platforms = this.add.group();
        this.platforms.enableBody = true;

        var myGroundBitmap = this.add.bitmapData(this.world.width, 25);
        myGroundBitmap.context.fillStyle = "#090";
        myGroundBitmap.context.fillRect(0, 0, myGroundBitmap.width, myGroundBitmap.height);

        var ground = this.platforms.create(0, this.world.height - 25, myGroundBitmap);
        ground.body.immovable = true;

        this.clouds = this.game.add.group();
        for (var i = 1; i <= 15; i++) {
            this.clouds.add(new RKD.Games.RocketD.Cloud(this.game, 'cloud' + parseInt(Math.random() * 4 + 1).toString(), this.game.world.randomX, this.game.math.between(parseInt(this.game.world.height / 10), parseInt(this.game.world.height / 1.5)), this.game.math.between(50, 150)));
        }
    },

    updateCollisions: function () {
        this.hitPlatform = this.physics.arcade.collide(this.player, this.platforms, this.playerHitPlatform, null, this);
    },


    playerHitPlatform: function (player, platforms) {
        if (player.alive && !player.data.landed) {
            if (player.body.speed > 75) {
                this.game.gameAudio.play("sfx-crash");
            }

            var damage = player.body.speed * player.body.mass;
            if (damage > this.damageThreshold) {
                player.damage(damage);
                if (player.health < 0) {
                    player.setHealth(0);
                }
            }
            player.data.landed = (player.alive && player.body.speed <= 10);
            this.camera.shake(damage / 500000, 150, false, Phaser.Camera.SHAKE_VERTICAL, true);
        }
    },

    update: function () {

        this.updateCollisions();
        this.updateScoreboard();

        if (!this.player.alive | this.player.data.landed) {

            if (!this.player.alive) {
                this.playBGMLoop("lose");
                this.gasp = this.game.gameAudio.get("sfx-crowd-gasp");
                if (!this.gasp.isPlaying && !this.gaspPlayed) {
                    this.gaspPlayed = true;
                    this.game.gameAudio.play("sfx-crowd-gasp")
                };
            } else if (this.player.data.landed) {
                this.playBGMLoop("win");
                this.applause = this.game.gameAudio.get("sfx-crowd-applause");
                if (!this.applause.isPlaying && !this.applausePlayed) {
                    this.applausePlayed = true;
                    this.game.gameAudio.play("sfx-crowd-applause");
                };
            }

            if (!this.finishedBackground.scale.x == 1) {
                this.finishedBackgroundTweenIn.start();
            } else {

                var enter = this.input.keyboard.isDown(Phaser.KeyCode.ENTER) || this.input.activePointer.isDown;
                if (enter) {
                    if (!this.finishedBackgroundTweenOut.isRunning) {
                        this.finishedBackgroundTweenOut.start();
                    }
                }

            }

        } else {

            this.indicator.visible = this.game.physics.arcade.distanceBetween(this.landingPad, this.player, this.world) > 400;
            this.indicator.rotation = this.game.physics.arcade.angleBetween(this.landingPad, this.indicator, this.world);

            if (this.player.data.lowFuel & !this.lowFuelFlashingTween.isPlaying) {
                this.lowFuelFlashingTween.start();
            }

        }
    },

    render: function () {
        if (this.debugActive) {
            //this.game.debug.spriteInfo(this.finishedBackground, 10, 50);
            // this.game.debug.spriteInfo(this.indicator, 10, 150);
            // this.game.debug.spriteInfo(this.landingPad, 10, 250);
            //this.game.debug.spriteBounds(this.finishedBackground, "#F00", false);
            // this.game.debug.spriteBounds(this.player, "#0F0", false);
            this.game.debug.text("Distance From Platform: " + this.game.physics.arcade.distanceBetween(this.landingPad, this.player, this.world), 50, 50);
        }
    },

    postUpdate : function(){
    },

    resetGame: function () {

        this.fuelText.alpha = 1;
        this.lowFuelFlashingTween.stop(); // deletes tween
        this.createLowFuelFlashingTween();
        this.createLandingPad();

        if (this.gasp !== undefined && this.gasp.isPlaying) this.gasp.stop();
        if (this.applause !== undefined && this.applause.isPlaying) this.applause.stop();
        this.applausePlayed = false;
        this.gaspPlayed = false;
        this.playBGMLoop("game");
        this.player.reset();

        this.player.data.needToResetFuel = true;
    },

    updateScoreboard: function () {
        this.fuelText.text = "Fuel: " + parseInt(this.player.data.fuel / this.player.maxFuel * 100);
        this.healthText.text = "Health: " + parseInt(this.player.health / this.player.maxHealth * 100);
    },

}