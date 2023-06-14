var LetterCircleView = cc.Node.extend({
    ctor: function (lettersList) {
        this._super();

        this.state = 0;

        this.letters = lettersList;
        this.letterViews = lettersList.map(function (letter) {
            var letterView = new LetterView(letter);
            this.addChild(letterView);
            return letterView;
        }.bind(this));

        this.lastChosenLetters = [];
        this.word = "";
        this.currentWord = null;

        this.setViewsPositions();

        this.addSubmitAndDeclineButton();
        this.addShuffleButton();

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(event.getLocation());
                var rect = cc.rect(locationInNode.x - 50, locationInNode.y - 50, 75, 75);

                this.letterViews.forEach(function (letter, index) {
                    if (cc.rectContainsPoint(rect, letter.getPosition())) {
                        if (this.state === 0) {
                            this.changeState(1);
                        }

                        if (this.lastChosenLetters[this.lastChosenLetters.length - 1] === index ||
                            this.lastChosenLetters[this.lastChosenLetters.length - 2] === index) {
                            this.word = this.word.slice(0, -1);
                            this.letterViews[this.lastChosenLetters[this.lastChosenLetters.length - 1]].onClick();
                            if (this.word.length === 0) {
                                this.changeState(0);
                            }
                            this.lastChosenLetters.pop();
                        } else if (!this.lastChosenLetters.includes(index)) {
                            this.word += letter.letter;
                            letter.onClick();
                            this.lastChosenLetters.push(index);
                        } else {
                            return;
                        }
                        cc.audioEngine.playEffect(resources["click_" + this.word.length], false);
                        this.updateCurrentWord();
                    }
                }.bind(this));
            }.bind(this)
        }, this);

        this.onEnterWord = function () {};
    },

    setViewsPositions: function () {
        var angleStep = 360 / this.letters.length;
        this.letterViews.forEach((view, index) => {
            var dx = Math.cos(angleStep * index * Math.PI/180);
            var dy = Math.sin(angleStep * index * Math.PI/180);
            view.cleanup();
            view.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, new cc.Point(dx * LetterCircleView.RADIUS, dy * LetterCircleView.RADIUS))
            ));
        });
    },

    changeState: function (state) {
        switch (state) {
            case 0:
                this.shuffleButton.setVisible(true);
                this.submitButton.removeFromParent();
                this.cancelButton.removeFromParent();
                this.letterViews.forEach(letter => {
                    letter.deselect();
                })
                this.word = "";
                this.currentWord.removeFromParent();
                this.currentWord = null;
                this.lastChosenLetters = [];
                this.state = 0;
                break;
            case 1:
                this.shuffleButton.setVisible(false);
                this.addChild(this.submitButton);
                this.addChild(this.cancelButton);
                this.state = 1;
                break;
        }
    },

    updateCurrentWord: function () {
        if (this.currentWord) {
            this.currentWord.removeFromParent();
        }
        this.currentWord = new WordView(this.word);
        this.currentWord.setPosition(-30 * (this.word.length - 1), 350);
        this.currentWord.show(true);
        this.addChild(this.currentWord);
    },

    addSubmitAndDeclineButton: function () {
        var buttonSize = cc.spriteFrameCache.getSpriteFrame('menu_button.png').getOriginalSize();
        this.submitButton = new ccui.Button('#menu_button.png', '#menu_button_on.png', '', ccui.Widget.PLIST_TEXTURE);
        this.submitButton.setScale9Enabled(true);
        this.submitButton.setContentSize(75, 75);
        this.submitButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.submitButton.setPosition(200, -200);

        this.cancelButton = new ccui.Button('#back_button.png', '#back_button_on.png', '#button_off.png', ccui.Widget.PLIST_TEXTURE);
        this.cancelButton.setScale9Enabled(true);
        this.cancelButton.setContentSize(75, 75);
        this.cancelButton.setCapInsets(cc.rect(buttonSize.width / 2 - 1, buttonSize.height / 2 - 1, 2, 2));
        this.cancelButton.setPosition(-200, -200);

        this.submitButton.addClickEventListener(function () {
            this.onEnterWord(this.word);
            this.changeState(0);
        }.bind(this));

        this.cancelButton.addClickEventListener(function () {
            this.changeState(0);
        }.bind(this));
    },

    addShuffleButton: function () {
        this.shuffleButton = new ccui.Button('#shuffle.png', '#shuffle_on.png', '', ccui.Widget.PLIST_TEXTURE);
        this.shuffleButton.setScale(0.7);
        this.addChild(this.shuffleButton);

        this.shuffleButton.addClickEventListener(function () {
            this.shuffle();
        }.bind(this));
    },

    shuffle: function () {
        cc.audioEngine.playEffect(resources.letter_sound, false);
        var isDifferent = false;

        while (!isDifferent) {
            var oldViews = Array.from(this.letterViews);
            this.letterViews.sort(() => Math.random() - 0.5);
            for (var i = 0; i < this.letterViews.length; ++i) {
                if (this.letterViews[i] !== oldViews[i]) {
                    isDifferent = true;
                    break;
                }
            }
        }

        this.setViewsPositions();
    }
});

LetterCircleView.RADIUS = 100;