var LetterView = cc.Node.extend({
    ctor: function (letter) {
        this._super();

        this.letter = letter;

        this.isSelected = false;
        this.isShowed = false;

        var background = new cc.Sprite(resources.letter_bg);
        background.setPosition(this.width / 2, this.height / 2);
        this.addChild(background);

        var letterImage = new cc.Sprite(LetterView.ICONS[this.letter]);
        this.addChild(letterImage);

        this.setScale(LetterView.DEFAULT_SCALE);
    },

    show: function () {
        cc.audioEngine.playEffect(resources.letter_sound, false);
        this.isShowed = true;
        this.setVisible(true);
        this.runAction(new cc.Sequence(
            new cc.ScaleTo(0, LetterView.DEFAULT_SCALE + 0.1),
            new cc.ScaleTo(0.5, LetterView.DEFAULT_SCALE)
        ));
    },

    select: function () {
        this.isSelected = true;
        this.setScale(LetterView.DEFAULT_SCALE + 0.1);
    },

    deselect: function () {
        this.isSelected = false;
        this.setScale(LetterView.DEFAULT_SCALE);
    },

    onClick: function () {
        if (this.isSelected) {
            this.deselect();
        } else {
            this.select();
        }
    }
});

LetterView.DEFAULT_SCALE = 0.7;
LetterView.ICONS = {
    'а': 'res/letters/rus/a.png',
    'б': 'res/letters/rus/b.png',
    'в': 'res/letters/rus/v.png',
    'г': 'res/letters/rus/g.png',
    'д': 'res/letters/rus/d.png',
    'е': 'res/letters/rus/e.png',
    'ё': 'res/letters/rus/yo.png',
    'ж': 'res/letters/rus/zh.png',
    'з': 'res/letters/rus/z.png',
    'и': 'res/letters/rus/i.png',
    'й': 'res/letters/rus/j.png',
    'к': 'res/letters/rus/k.png',
    'л': 'res/letters/rus/l.png',
    'м': 'res/letters/rus/m.png',
    'н': 'res/letters/rus/n.png',
    'о': 'res/letters/rus/o.png',
    'п': 'res/letters/rus/p.png',
    'р': 'res/letters/rus/r.png',
    'с': 'res/letters/rus/s.png',
    'т': 'res/letters/rus/t.png',
    'у': 'res/letters/rus/u.png',
    'ф': 'res/letters/rus/f.png',
    'х': 'res/letters/rus/x.png',
    'ц': 'res/letters/rus/cz.png',
    'ч': 'res/letters/rus/ch.png',
    'ш': 'res/letters/rus/sh.png',
    'щ': 'res/letters/rus/shh.png',
    'ъ': 'res/letters/rus/tz.png',
    'ы': 'res/letters/rus/y.png',
    'ь': 'res/letters/rus/mz.png',
    'э': 'res/letters/rus/eh.png',
    'ю': 'res/letters/rus/yu.png',
    'я': 'res/letters/rus/ya.png',
}