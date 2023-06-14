var GameScene = cc.Scene.extend({
    ctor: function (level) {
        this._super();

        var wordsList = level.words;
        var lettersList = level.letters;

        this.wordsAmount = wordsList.length;

        this.addBackground();
        this.wordsView = new WordsView(wordsList);
        this.wordsView.setPosition(this.width / 2, this.height - this.wordsView.height / 2 - 50);
        this.addChild(this.wordsView);

        this.letterCircleView = new LetterCircleView(lettersList);
        this.letterCircleView.setPosition(this.width / 2, 250);
        this.letterCircleView.onEnterWord = this.checkWord.bind(this);
        this.addChild(this.letterCircleView);

        this.balance = 150;
        this.addBalanceView();
        this.addHint();

        cc.audioEngine.playMusic(resources.game_music, true);
        cc.audioEngine.setMusicVolume(0.5);
    },

    addBackground: function () {
        var background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);
    },

    checkWord: function (word) {
        var isCorrect = false;
        var wordFound = false;
        this.wordsView.words.forEach(function (wordView) {
            if (wordView.word === word) {
                if (!wordView.isGuessed) {
                    this.wordsAmount--;
                    isCorrect = true;
                    wordView.show();
                } else {
                    wordFound = true;
                }
            }
        }.bind(this));
        if (!wordFound) {
            this.enteredWordResponse(isCorrect);
            cc.audioEngine.playEffect(isCorrect ? resources.word_correct : resources.word_wrong, false);
            if (isCorrect) {
                this.balance += 100;
                this.balanceText.string = this.balance;
            }
        } else {
            cc.audioEngine.playEffect(resources.word_found, false);
        }
        if (this.wordsAmount === 1) {
            cc.audioEngine.playEffect(resources.word_last, false);
        }
        if (this.wordsAmount === 0) {
            cc.audioEngine.playEffect(resources.win_sound, false);
            var fireworkAnimation = sp.SkeletonAnimation.create(resources.firework_json, resources.game_atlas);
            fireworkAnimation.setAnimation(0, "animation1", true);
            fireworkAnimation.setPosition(this.width / 2, this.height / 2);
            this.addChild(fireworkAnimation);
            var victoryAnimation = sp.SkeletonAnimation.create(resources.victory_json, resources.game_atlas);
            victoryAnimation.setAnimation(0, "open", );
            victoryAnimation.setPosition(this.width / 2, this.height / 2);
            this.addChild(victoryAnimation);
            victoryAnimation.setCompleteListener(function () {
                victoryAnimation.setAnimation(0, "idle", true);
            });
        }
    },

    enteredWordResponse: function (isCorrect) {
        var icon = new ccui.Scale9Sprite(resources[isCorrect ? "right_icon" : "wrong_icon"]);
        this.addChild(icon);
        icon.setPosition(this.width / 2, this.height / 1.5);
        icon.runAction(new cc.Sequence(
            new cc.ScaleTo(1.5, 5),
            new cc.RemoveSelf()
        ));
        icon.runAction(new cc.Sequence(
            new cc.FadeTo(1, 0)
        ));
    },

    addBalanceView: function () {
        var positionX = this.width;
        var positionY = this.height / 2;
        this.balanceText = new ccui.Text(this.balance, resources.marvin_round.name, 60);
        this.balanceText.enableShadow(cc.color(0, 0, 0, 255), cc.size(2, -3), 2.0);
        this.balanceText.setPosition(positionX - this.balanceText.width, positionY);
        this.addChild(this.balanceText);
        this.balanceIcon = new cc.Sprite(resources.coin);
        this.balanceIcon.setPosition(positionX - this.balanceText.width * 2, positionY);
        this.addChild(this.balanceIcon);
    },

    addHint: function () {
        var cost = 50;
        var positionX = this.width - 100;
        var positionY = this.height / 2 - 100;
        this.hintButton = new ccui.Button('#help_small.png', '#help_small_on.png', '', ccui.Widget.PLIST_TEXTURE);
        this.hintButton.setPosition(positionX, positionY);
        this.hintButton.addClickEventListener(function () {
            if (this.balance >= cost) {
                this.balance -= cost;
                this.balanceText.string = this.balance;
                this.hintLetter();
            }
        }.bind(this));
        this.addChild(this.hintButton);
    },

    hintLetter: function () {
        var isNew = false;
        var letterToOpen = null;
        var wordToOpen = null;
        while (!isNew) {
            var index = Math.floor(Math.random() * this.wordsView.words.length);
            var word = this.wordsView.words[index];
            if (!word.isGuessed) {
                index = Math.floor(Math.random() * word.word.length);
                var letter = word.letters[index];
                if (!letter.isShowed) {
                    isNew = true;
                    letterToOpen = letter;
                    wordToOpen = word;
                }
            }
        }
        var counter = 0;
        wordToOpen.letters.forEach(letter => {
            if (letter.isShowed) {
                counter++;
            }
        });
        if (counter === wordToOpen.word.length - 1) {
            this.checkWord(wordToOpen.word);
        } else {
            letterToOpen.show();
        }
    },
});