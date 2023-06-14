var WordView = cc.Node.extend({
    ctor: function (word) {
        this._super();

        this.word = word;
        this.isGuessed = false;

        this.cells = [];
        this.letters = [];

        word.split('').forEach(function (letter, index) {
            var cell = new ccui.Scale9Sprite(resources.cell_bg);
            cell.setPosition(index * (cell.width * LetterView.DEFAULT_SCALE + 5), 0);
            cell.setScale(LetterView.DEFAULT_SCALE * 0.9);
            var letterView = new LetterView(letter);
            letterView.setPosition(cell.getPosition());
            this.addChild(cell);
            this.addChild(letterView);
            this.cells.push(cell);
            this.letters.push(letterView);
        }.bind(this));
        this.hide();
    },

    show: function (fastMode) {
        this.isGuessed = true;
        this.letters.forEach(function (letter, i) {
            setTimeout(function () {
                letter.show();
            }, fastMode ? 0 : 150 * i);
        });
    },

    hide: function () {
        this.letters.forEach(function (letter) {
            letter.setVisible(false);
        });
    }
});