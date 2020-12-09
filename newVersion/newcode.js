const settings = JSON.parse(localStorage.getItem('settings'));

var GameCondition = {
    change: randomNumberFromRange(5, 40),
    hi: {},
    low: {},
    basebet: 0.00000500,
    defaultBasebet: 0,
    phantraman: 100,
    over: false,
    game: '',
    lostTang: 0,
    defaultHi: true,
    totalBet: 0,
    maxLose: 0,
    maxWin: 0,
    win: 0,
    lost: 0,
    auto: null,
    target: 1,
    profit: 0,
    banalanceLose: 0,
    defaultResetSeeds: 5000,
    opportunityChange: [],
    countChange: [],
    dataRoll: {},
    backprice: 5,
    deplay: 0,
    currentBet: 0,
    nextBet: 0,
    maxBet: 0,
    rollforreset: 0,
    runCountTime: null,
    init: function () {
        var self = this;
        self.createTool();
        self.createChange();
        self.updateChange();
        $('.game__left__content').on('click', '#btn-start-bot', function () {
            self.basebet = parseFloat($('#amount').val());
            self.backprice = parseFloat($('#backprice').val());
            self.deplay = $('#deplay').val() || 0;
            if(self.defaultBasebet === 0){
                self.defaultBasebet = parseFloat($('#amount').val());
            }
            self.defaultResetSeeds = $('#reset').val();
            if(self.basebet <= 0.00000000){
                alert('Xin nhập base bet');
                return;
            }else{
                self.target = parseFloat($('#target').val());
                self.auto = setInterval(function () {
                    self.play();
                }, self.deplay);
            }
        });
        $('.game__left__content').on('click', '#btn-stop-bot', function () {
            clearInterval(self.auto);
            clearInterval(self.runCountTime);
            self.runCountTime = null;
            self.defaultBasebet = 0;
        });
        self.win = 0;
        self.lose = 0;
        $('.game__left__content').on('click', '#btn-clear-bot', function () {
            $(".dice__stats__current i.fa-refresh").trigger('click');
            $('#current-win').html(0);
            $('#current-lose').html(0);

            $('#current-max-win').html(0);
            $('#current-max-lose').html(0);
            self.win = 0;
            self.lose = 0;
            self.maxLose = 0;
            self.maxWin = 0;
        });
        $('.game__left__content').on('click', '#btn-show-chart', function(){
            $('#full-site').show();
            $('body').css('position', 'fixed');
        });
    },
    updateTiLeThang: function (roll_number) {
        var self = this;
        self.opportunityChange.forEach(function (item, index) {
            if(roll_number < item.hi.game){
                item.hi.lose += 1;
            }else{
                item.hi.lose = 0;
            }
            if(roll_number > item.low.game){
                item.low.lose += 1;
            }else{
                item.low.lose = 0;
            }
            ['hi', 'low'].forEach(function (condition) {
                item[condition].tilethang = item[condition].lose / item[condition].risk * 100;
            });
        });
        self.goChange.forEach(function (item, index) {
            if(roll_number < item.hi.game){
                item.hi.lose += 1;
            }else{
                item.hi.lose = 0;
            }
            if(roll_number > item.low.game){
                item.low.lose += 1;
            }else{
                item.low.lose = 0;
            }
            ['hi', 'low'].forEach(function (condition) {
                item[condition].tilethang = item[condition].lose / item[condition].risk * 100;
            });
        });
    },
    resetTileThang: function () {
        var self = this;
        self.opportunityChange.forEach(function (item, index) {
            ['hi', 'low'].forEach(function (condition) {
                item[condition].tilethang = 0;
            });
        });
        self.goChange.forEach(function (item, index) {
            ['hi', 'low'].forEach(function (condition) {
                item[condition].tilethang = 0;
            });
        });
    },
    loadDatabet: function () {
        let rollHi = {};
        let rollLow = {};
        let rollNormal = {};
        if (!$.isEmptyObject(this.dataRoll)) {

        }
    },
    getGoChange: function () {
        var self = this;
        var infobet = {
            change: 0,
            defaultHi: true,
            onlose: 0
        };
        var phantram = 0;
        self.goChange.forEach(function (item) {
            ['hi', 'low'].forEach(function (condition) {
                if (item[condition].tilethang > 70){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.defaultHi = item[condition].defaultHi;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if((item[condition].tilethang >= 65 && item[condition].tilethang <= 70)){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.defaultHi = item[condition].defaultHi;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if((item[condition].tilethang >= 45 && item[condition].tilethang <= 55)){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.defaultHi = item[condition].defaultHi;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if ((item[condition].tilethang >= 25 && item[condition].tilethang <= 35)){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.defaultHi = item[condition].defaultHi;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if ((item[condition].tilethang >= 5 && item[condition].tilethang <= 15)){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.defaultHi = item[condition].defaultHi;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if (item[condition].tilethang >= phantram){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.defaultHi = item[condition].defaultHi;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }
            });
        });
        // if(infobet){
        //     infobet.change = 98 - infobet.change;
        //     infobet.defaultHi = !infobet.defaultHi;
        // }
        return infobet;
    },
    createChange: function () {
        var self = this;
        for (var i = self.changeInLose.start.min; i <= self.changeInLose.start.max; i += 0.01){
            var getPayoutForMulti = self.returnPayoutVal(i);
            self.opportunityChange.push({
                hi: {
                    game: parseFloat((100-i-0.01)).toFixed(2),
                    risk: getPayoutForMulti * 10 + 30,
                    change: i.toFixed(2),
                    lose: 0,
                    defaultHi: true,
                    tilethang: 0,
                    onlose: 1 / (1 * getPayoutForMulti - 1) * 100
                },
                low: {
                    game: parseFloat(i).toFixed(2),
                    risk: getPayoutForMulti * 10 + 30,
                    change: i.toFixed(2),
                    lose: 0,
                    defaultHi: false,
                    tilethang: 0,
                    onlose: 1 / (1 * getPayoutForMulti - 1) * 100
                }
            });
        }
        for (var i = self.changeInLose.go.min; i <= self.changeInLose.go.max; i += 0.01){
            var getPayoutForMulti = self.returnPayoutVal(i);
            self.goChange.push({
                hi: {
                    game: parseFloat((100-i-0.01)).toFixed(2),
                    risk: getPayoutForMulti * 10 + 30,
                    change: i.toFixed(2),
                    lose: 0,
                    defaultHi: true,
                    tilethang: 0,
                    onlose: 1 / (1 * getPayoutForMulti - 1) * 100
                },
                low: {
                    game: parseFloat(i).toFixed(2),
                    risk: getPayoutForMulti * 10 + 30,
                    change: i.toFixed(2),
                    lose: 0,
                    defaultHi: false,
                    tilethang: 0,
                    onlose: 1 / (1 * getPayoutForMulti - 1) * 100
                }
            });
        }
        self.changeInLose.count.forEach(function(item){
            self.countChange.push({
                hi: {
                    game: parseFloat((100-item.change-0.01)).toFixed(2),
                    change: item.change,
                    stop: item.stop,
                    defaultHi: true,
                    run: item.run,
                    lose: 0
                },
                low: {
                    game: parseFloat(item.change).toFixed(2),
                    change: item.change,
                    stop: item.stop,
                    defaultHi: false,
                    run: item.run,
                    lose: 0
                }
            });
        });
    },
    workingChange: function (roll_number) {
        var self = this;
        if(roll_number){
            self.updateTiLeThang(roll_number);
        }
        var smartChange = self.getOpportunityChange();
        var gochange = self.getGoChange();
        if(smartChange.tilethang >= 70 || doagin){
            firstTimePlay++;
            flagChange = true;
            self.change = smartChange.change;
            var getPayout = self.returnPayoutVal(self.change);
            if(firstTimePlay === 1 || firstTimePlay === 2){
                self.basebet = self.defaultBasebet / 100;
            }
            if(self.lose >= (parseFloat(getPayout) / 2)){
                self.basebet = parseFloat(self.basebet + self.basebet * smartChange.onlose / 100);
            }
            self.defaultHi = smartChange.defaultHi;
            flagNormal = false;
        }else if((gochange.tilethang >= 5 && self.banalanceLose > 0 && !flagGo)){
            self.change = gochange.change;
            var getPayout = self.returnPayoutVal(self.change);
            self.basebet = parseFloat(self.basebet);
            self.defaultHi = gochange.defaultHi;
            if(self.banalanceLose < self.defaultBasebet){
                self.basebet = parseFloat(self.banalanceLose / (getPayout - 1));
            }else if (gochange.tilethang >= 65 && gochange.tilethang <= 70){
                self.basebet = parseFloat((self.banalanceLose / 4) / (getPayout - 1));
            }else if (gochange.tilethang >= 45 && gochange.tilethang <= 50){
                self.basebet = parseFloat((self.banalanceLose / 3) / (getPayout - 1));
            }else if (gochange.tilethang >= 25 && gochange.tilethang <= 30){
                self.basebet = parseFloat((self.banalanceLose / 2) / (getPayout - 1));
            }else if (gochange.tilethang >= 5 && gochange.tilethang <= 10){
                self.basebet = parseFloat((self.banalanceLose / 1) / (getPayout - 1));
            }else {
                self.change = randomNumberFromRange(self.changeInLose.default.min, self.changeInLose.default.max);
                self.basebet = self.defaultBasebet;
                if((Math.floor(Math.random() * 100) + 1) % 2){
                    self.defaultHi = true;
                }else{
                    self.defaultHi = false;
                }
            }
            flagGo = false;
            flagChange = false;
            firstTimePlay = 0;
            flagNormal = false;
            // ['hi', 'low'].forEach(function (item) {
            //     self[item].loseTang = self.basebet / (self.basebet * getPayout - self.basebet) * self.phantraman;
            // });
        }else{
            flagChange = false;
            flagGo = false;
            firstTimePlay = 0;
            self.change = randomNumberFromRange(self.changeInLose.default.min, self.changeInLose.default.max);
            ['hi', 'low'].forEach(function (item) {
                self[item].loseTang = 0;
            });
            if((Math.floor(Math.random() * 100) + 1) % 2){
                self.defaultHi = true;
            }else{
                self.defaultHi = false;
            }
            self.basebet = self.defaultBasebet;
            flagNormal = true;
        }
        if(self.basebet >= parseFloat($('#balance-'+devise).val())){
            self.basebet = parseFloat($('#balance-'+devise).val()) / 2;
        }
        if(devise == 'zec' && self.basebet < 0.00000020){
            self.basebet = 0.00000020;
        }else if(devise == 'ltc' && self.basebet < 0.00000100){
            self.basebet = 0.00000100;
        }else if(devise == 'doge' && self.basebet < 0.05000000){
            self.basebet = 0.05000000;
        }else if(devise == 'btc' && self.basebet < 0.00000001){
            self.basebet = 0.00000001;
        }else if(devise == 'bch' && self.basebet < 0.00000010){
            self.basebet = 0.00000010;
        }else if(devise == 'etc' && self.basebet < 0.00000500){
            self.basebet = 0.00000500;
        }else if(devise == 'eth' && self.basebet < 0.00000010){
            self.basebet = 0.00000010;
        }
        self.countChange.forEach(function(item){
            if(roll_number < item.hi.game){
                item.hi.lose += 1;
            }else{
                item.hi.lose = 0;
            }
            if(roll_number > item.low.game){
                item.low.lose += 1;
            }else{
                item.low.lose = 0;
            }
            ['hi', 'low'].forEach(function (condi) {
                if(item[condi].lose >= item[condi].stop && item[condi].run){
                    alert('Đã đạt mục tiêu dừng '+item[condi].stop+' lose với change là '+condi+' game là '+(item[condi].defaultHi ? '>' : '<')+item[condi].game);
                    $('#btn-stop-bot').trigger('click');
                    return true;
                }
            });
        });
    },
    returnPayoutVal: function (change) {
        var payout = (100/parseFloat(change));
        payout = payout-(payout*(parseFloat(1)/100));
        var value = parseFloat(payout);
        if(value < 1000)
            value = value.toFixed(4);
        return value;
    },
    updateChange: function (roll_number) {
        var self = this;
        this.workingChange(roll_number);
        set_by_chance(this.change, true);
        if(this.change === 0){
            alert('Xin nhập change');
            return;
        }
        this.hi.game = parseFloat((100-this.change-0.01)).toFixed(2);
        this.low.game = parseFloat(this.change).toFixed(2);
        this.hi.over = true;
        this.low.over = false;
        if(this.defaultHi){
            this.over = this.hi.over;
            this.game = this.hi.game;
            this.lostTang = this.hi.loseTang;
        }else{
            this.over = this.low.over;
            this.game = this.low.game;
            this.lostTang = this.low.loseTang;
        }
    },
    getBet: function (id, callback) {
        $.ajax({
            url: "https://www.bitsler.com/api/bet",
            type: 'POST',
            data: {
                id: link.split('/')[2]
            },
            cache: false,
            success: function (result) {
                callback(result);
            }
        });
    },
    createTool: function () {
        var self = this;
        var script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
        script.onload = function () {
            $('body').css('position', 'fixed');
            $('<div></div>', {class: 'luan-dice'}).css({
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                'background-image': 'url("https://www.bitsler.com/static/img/dice.1c02a254.png")',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'cover',
                'z-index': 1060,
                overflow: "auto"
            })
                .append($('.navbar.nb').clone().css('top', 0))
                .append(
                    $('<div></div>', {id: 'luan-content'})
                        .css('margin-top', 52)
                        .append($('.di-results').clone().css('width', '100%'))
                        .append($('#game-controls').clone())
                        .append($('.bets-wrapper').clone())
                )
                .appendTo('body');
            var dice = $('.luan-dice');
            dice.find('.navbar.nb').find('.bal-wrapper').find('.bal-buttons').remove();
            dice.find('.bets-wrapper').find('li').not('.active').remove();
            dice.find('.bets-wrapper').find('li').removeClass('col-3').addClass('col-12');
            dice.find('.bets-wrapper').find('.share-bet').remove();
            dice.find('.di-results').on('click', 'a', function () {
                // var link = $(this).attr('href');
                // self.getBet(link.split('/')[2], function (data) {
                //     console.log(data);
                // });
                return false;
            });
            dice.find('bets-wrapper').find('tr td').on('click', 'a', function () {
               // var link = $(this).attr('href');
               // self.getBet(link.split('/')[2], function (data) {
               //     console.log(data);
               // });
               return false;
            });
        };
        document.head.appendChild(script);
    },
    updateMyBet: function () {

    },
    play: function () {
        if(check){
            var self = GameCondition;
            check = false;
            $.ajax({
                type: "POST",
                url: 'https://www.bitsler.com/api/bet-dice',
                cache: false,
                data: {
                    access_token: settings.user.token,
                    amount: self.basebet,
                    target: self.game,
                    over: self.over,
                    currency: settings.currency.currentCurrency
                },
                success: function (data) {

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    check = true;
                },
                timeout: function (xhr, ajaxOptions, thrownError) {
                    check = true;
                },
                abort: function (xhr, ajaxOptions, thrownError) {
                    check = true;
                }
            });
        }
    }
};

function startGame() {
    $.ajax({
        type: "POST",
        url: 'https://www.bitsler.com/api/bet-dice',
        cache: false,
        data: {
            access_token: settings.user.token,
            amount: GameCondition.basebet,
            target: GameCondition.game,
            over: GameCondition.over,
            currency: settings.currency.currentCurrency
        },
        success: function (data) {
            if (data.success) {

            }
            startGame();
        }
    })
}