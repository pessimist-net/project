var WordsView = cc.Node.extend({
    ctor: function (wordsList) {
        this._super();
 
        var background = new cc.Scale9Sprite(resources.board_bg);
        background.setContentSize(2000, 400);
        this.setContentSize(background.getContentSize());
        this.addChild(background);

        this.words = wordsList.map(function (word, index) {
            var wordView = new WordView(word);
            var dx = (index % 2) * 400;
            var dy = (Math.floor(index/2)) * (-75);
            wordView.setPosition(-400 + dx, 75 + dy);

            return wordView;
        });
        this.words.forEach(function (word) {
            this.addChild(word);
        }.bind(this));
    }
});