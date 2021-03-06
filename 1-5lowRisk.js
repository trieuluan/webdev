requirejs([
    'https://canvasjs.com/assets/script/jquery.canvasjs.min.js',
    'https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js'
], function (
    Canvasjs, _
) {
    const API_URL = '//dicegametool.com/api/';
    const NAME_AUTO = 'Chance 1-5 low risk v2.4';
    class PlayGame {
        static defaultChange = ()=>{
            return PlayGame.randomNumberFromRange(1, 5);
        };
        static chance = PlayGame.defaultChange();
        static stop = false;
        static server_front_name = "";
        static totalBet = 0;
        static profit = 0;
        static win = 0;
        static lose = 0;
        static maxWin = 0;
        static maxLose = 0;
        static basebet = 0.00000001;
        static defaultBasebet = 0;
        static defaultHi = (Math.floor(Math.random() * 100) + 1) % 2===0;
        static condition = PlayGame.defaultHi ? '>' : '<';
        static game = PlayGame.defaultHi ? parseFloat((100-PlayGame.chance-0.01)).toFixed(2) : parseFloat(PlayGame.chance).toFixed(2);
        static balanceLose = 0;
        static chanceGo = {min: 10, max: 98};
        static chanceLow = {min: 0.05, max: 1};
        static startBalance = parseFloat($('#balance-'+devise).val());
        static currentBalance = PlayGame.startBalance;
        static bigBalance = PlayGame.currentBalance;
        static listGameGo = [];
        static listGameLow = [];
        static currentRound = 0;
        static checkRollInRound = 0;
        static target = 50;
        static startChangeSeeds = false;
        static rollChangeSeeds = 1000;
        static lastBigProfit = 0;
        static listConditionRound = [
            {lose: 1, roll: 5, defaultHi: true},
            {lose: 2, roll: 10, defaultHi: false},
            {lose: 4, roll: 20, defaultHi: true},
            {lose: 8, roll: 40, defaultHi: false}
        ];
        static maxRound = PlayGame.listConditionRound.length - 1;
        static storeRound = {};
        static golandau = 30;
        static defaultGolandau = PlayGame.golandau;
        static flagLow = false;
        static flagGo = false;
        static flagGoRisk = false;
        static flagNormal = true;
        static firstTimePlay = 0;
        static getBackPrice = 5;
        static currentBackPrice = 5;
        static smartChangeSeeds = false;
        constructor(){
            this.createChange();
            this.createTool();
            if(_.isEmpty(PlayGame.storeRound)){
                PlayGame.updateStoreRound();
            }
            $('.game__left__content').on('click', '#btn-start-bot', function () {
                PlayGame.basebet = parseFloat($('#amount').val());
                PlayGame.startBalance = parseFloat($('#balance-'+devise).val());
                PlayGame.target = parseFloat($('#target').val());
                PlayGame.smartChangeSeeds = $('#onoffseeds').is(':checked');
                if(PlayGame.defaultBasebet === 0){
                    PlayGame.defaultBasebet = PlayGame.basebet;
                }
                if(PlayGame.basebet <= 0.00000000){
                    alert('Xin nhập base bet');
                }else{
                    PlayGame.startGame();
                }
            });
            $('.game__left__content').on('click', '#btn-stop-bot', function () {
                PlayGame.stopGame();
                PlayGame.defaultBasebet = 0;
            });
        }
        static updateTiLeThang = (roll_number) => {
            PlayGame.listGameGo.forEach(function (item) {
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
            PlayGame.listGameLow.forEach(function (item) {
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
        };
        static resetTileThang = () => {
            PlayGame.listGameGo.forEach(function (item) {
                ['hi', 'low'].forEach(function (condition) {
                    item[condition].tilethang = 0;
                });
            });
            PlayGame.listGameLow.forEach(function (item) {
                ['hi', 'low'].forEach(function (condition) {
                    item[condition].tilethang = 0;
                });
            });
        };
        static getPhanTramProfit = () => {
            return ((parseFloat(PlayGame.profit) / PlayGame.startBalance * 100) || 0).toFixed(2);
        };
        createChange = () => {
            for (let i = PlayGame.chanceGo.min; i <= PlayGame.chanceGo.max; i += 0.01){
                let getPayoutForMulti = PlayGame.getPayout(i);
                PlayGame.listGameGo.push({
                    hi: {
                        game: parseFloat((100-i-0.01)).toFixed(2),
                        risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                        change: i.toFixed(2),
                        lose: 0,
                        defaultHi: true,
                        tilethang: 0,
                        onlose: 1 / (1 * getPayoutForMulti - 1) * 120
                    },
                    low: {
                        game: parseFloat(i).toFixed(2),
                        risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                        change: i.toFixed(2),
                        lose: 0,
                        defaultHi: false,
                        tilethang: 0,
                        onlose: 1 / (1 * getPayoutForMulti - 1) * 120
                    }
                });
            }
            for (let i = PlayGame.chanceLow.min; i <= PlayGame.chanceLow.max; i += 0.01){
                let getPayoutForMulti = PlayGame.getPayout(i);
                PlayGame.listGameLow.push({
                    hi: {
                        game: parseFloat((100-i-0.01)).toFixed(2),
                        risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                        change: i.toFixed(2),
                        lose: 0,
                        defaultHi: true,
                        tilethang: 0,
                        onlose: 1 / (1 * getPayoutForMulti - 1) * 120
                    },
                    low: {
                        game: parseFloat(i).toFixed(2),
                        risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                        change: i.toFixed(2),
                        lose: 0,
                        defaultHi: false,
                        tilethang: 0,
                        onlose: 1 / (1 * getPayoutForMulti - 1) * 120
                    }
                });
            }
        };
        createTool = () => {
            var infoBot = $('<div/>', {class: 'info-luan-bot', style: 'width: 100%;padding: 10px 0;text-align: center'});
            var headNameBot = $('<h1/>', {text: 'Super Bot Dice', style: 'color: white;'}).append('<br/>').append($('<small/>', {text: NAME_AUTO, style: 'color: white;'}));
            var infoBox = $('<p style="color: white;font-weight: bold;">Strategy by <a style="color: greenyellow;" href="https://www.facebook.com/ttluan" target="_blank">Trương Triệu Luân</a></p>' +
                '<p style="color: white;font-weight: bold;">Algorithm by <a style="color: greenyellow;" href="https://www.facebook.com/ttluan" target="_blank">Trương Triệu Luân</a></p>' +
                '<p style="color: white;font-weight: bold;">Developer by <a style="color: greenyellow;" href="https://www.facebook.com/ttluan" target="_blank">Trương Triệu Luân</a></p>' +
                '<p style="color: white;font-weight: bold;">Donate to developer via wallet:</p>' +
                '<ul style="color: white;width: 500px;text-align: left;margin: 0 auto;">' +
                '<li>DTQUKPAtskAnri5dKKVT4n5VaWz3DDovqw - Doge</li>' +
                '<li>0x64b447117d3493e2cfb7b10dc4d76345de34057f - Ethereum</li>' +
                '<li>LXm8xFQmShkXVPj9PwCRGwyn92gShDz9qU - Litecoin</li>' +
                '<li>qqxluxclfu8awmqkmakpylqnznp9dsmklvl3f6nfmt - Bitcoin cash</li>' +
                '<li>382uQjc3wrBpsz1GRo5967gpicAfqycHL2 - Bitcoin</li>' +
                '</ul>');
            infoBot.append(headNameBot).append(infoBox);
            $('.game__container__content').width('90%');
            $('.game__container__content .game__left').width('70%');
            $('.game__container__content .game__right').width('30%');
            $('.game__container__index').prepend(infoBot);
            $('.game__left__menu').remove();
            var targetOptions = $('.row__game.text-semibold').next().next().find('.row__game__options');
            var fatherOptions = targetOptions.clone();
            fatherOptions.empty();
            var block1 = $('<div/>', {class: 'row__game__options__block border__right'}).append('<div class="title">Profit target %</div>');
            block1.append($('<div/>', {class: 'row__game__options__pie game__options__pie__1'}).append('<input type="text" id="target" value="'+PlayGame.target+'" />'));
            var block2 = $('<div/>', {class: 'row__game__options__block border__right'}).append('<div class="title">Smart change seeds</div>');
            block2.append($('<div/>', {class: 'row__game__options__pie game__options__pie__2'}).append('<input type="checkbox" id="onoffseeds" />'));
            fatherOptions.css('flex-wrap', 'wrap');
            fatherOptions.append(block1).append(block2);
            targetOptions.closest('.row__game').after($('<div/>', {class: 'row__game'}).append(fatherOptions));
            var buttonStart = $('#btn-bet-dice').clone();
            $('#btn-bet-dice').remove();
            var buttonStop = buttonStart.clone();
            var buttonClear = buttonStart.clone();
            buttonStart.attr('id', 'btn-start-bot').text('Start bot').css('width', 'calc(100% / 3)').css('background', '#87be4d');
            buttonStop.attr('id', 'btn-stop-bot').text('Stop bot').css('width', 'calc(100% / 3)').css('background', '#f76c51');
            buttonClear.attr('id', 'btn-clear-bot').text('Clear bot').css('width', 'calc(100% / 3)');
            $('.game__left__content').append(buttonStart).append(buttonStop).append(buttonClear);
            $('.dice__stats__menu').find('[data-type="overall"]').remove();
            $(".options__stats").trigger('click');
            var div50 = $('<div/>', {style: 'width:50%;margin-right:2px'});
            var div100 = $('<div/>', {style: 'width:100%;margin-right:2px'});
            var divflex = $('<div/>', {style: 'display:flex;width:100%;margin-top:10px'});

            var div50won = (div50.clone()).append('<h5>Current win</h5>');
            div50won.append($('<div/>', {id: 'current-win', class: 'stats__div__infos', text: 0}));

            var div50lose = (div50.clone()).append('<h5>Current lose</h5>');
            div50lose.append($('<div/>', {id: 'current-lose', class: 'stats__div__infos', text: 0}));

            var div50maxWon = (div50.clone()).append('<h5>Max win</h5>');
            div50maxWon.append($('<div/>', {id: 'current-max-win', class: 'stats__div__infos', text: 0}));

            var div50maxLose = (div50.clone()).append('<h5>Max lose</h5>');
            div50maxLose.append($('<div/>', {id: 'current-max-lose', class: 'stats__div__infos', text: 0}));

            var div50profit = (div50.clone()).append('<h5>Profit</h5>');
            div50profit.append($('<div/>', {id: 'my-current-profit', class: 'stats__div__infos', text: PlayGame.profit}));

            var div50profitPT = (div50.clone()).append('<h5>Phần trăm profit</h5>');
            div50profitPT.append($('<div/>', {id: 'current-pt-profit', class: 'stats__div__infos', text: PlayGame.getPhanTramProfit()}));

            var div50round = (div50.clone()).append('<h5>Round</h5>');
            div50round.append($('<div/>', {id: 'my-round', class: 'stats__div__infos', text: PlayGame.currentRound}));

            var div50CheckRollInRound = (div50.clone()).append('<h5>Roll in round</h5>');
            div50CheckRollInRound.append($('<div/>', {id: 'check-in-round', class: 'stats__div__infos', text: PlayGame.checkRollInRound}));

            var div100BalanceLose = (div100.clone()).append('<h5>Balance Lose</h5>');
            div100BalanceLose.append($('<div/>', {id: 'balance-lose', class: 'stats__div__infos', text: 0}));

            var flex1 = divflex.clone();
            var flex2 = divflex.clone();
            var flex3 = divflex.clone();
            var flex4 = divflex.clone();
            var flex5 = divflex.clone();

            flex1.attr('id', 'flexrow1').append(div50won).append(div50lose);
            flex2.attr('id', 'flexrow2').append(div50maxWon).append(div50maxLose);
            flex3.attr('id', 'flexrow3').append(div100BalanceLose);
            flex4.attr('id', 'flexrow4').append(div50profit).append(div50profitPT);
            flex5.attr('id', 'flexrow5').append(div50round).append(div50CheckRollInRound);


            if($('#flexrow1').length == 0 && $('#flexrow2').length == 0 && $('#flexrow3').length == 0){
                $('.dice__stats__current').append(flex1).append(flex2).append(flex3).append(flex4).append(flex5);
            }

            $('.dice__stats').height(580);
            $('.dice__stats__content').height(500);

            $('.dice__stats__current.stats__div').width('calc(100% - 30px)');
        };
        static randomNumberFromRange(min,max){
            let rdChange = parseFloat(Math.random()*(max-min)+min).toFixed(2);
            if(rdChange === 0){
                PlayGame.randomNumberFromRange(min, max);
            }else{
                return rdChange;
            }
        }
        static getLowChance(){
            let infobet = {};
            let phantram = 0;
            PlayGame.listGameLow.forEach(function (item) {
                ['hi', 'low'].forEach(function (condition) {
                    if (item[condition].tilethang >= 70){
                        phantram = item[condition].tilethang;
                        infobet.change = item[condition].change;
                        infobet.defaultHi = item[condition].defaultHi;
                        infobet.onlose = item[condition].onlose;
                        infobet.tilethang = item[condition].tilethang;
                    }
                });
            });
            return infobet;
        }
        static getGoChange(){
            let infobet = {};
            let phantram = 0;
            PlayGame.listGameGo.forEach(function (item) {
                ['hi', 'low'].forEach(function (condition) {
                    if (item[condition].tilethang >= 20 && item[condition].tilethang <= 23){
                        phantram = item[condition].tilethang;
                        infobet.change = item[condition].change;
                        infobet.defaultHi = item[condition].defaultHi;
                        infobet.onlose = item[condition].onlose;
                        infobet.tilethang = item[condition].tilethang;
                    }else if (item[condition].tilethang >= 7 && item[condition].tilethang <= 10){
                        phantram = item[condition].tilethang;
                        infobet.change = item[condition].change;
                        infobet.defaultHi = item[condition].defaultHi;
                        infobet.onlose = item[condition].onlose;
                        infobet.tilethang = item[condition].tilethang;
                    }else if(item[condition].tilethang >= phantram){
                        phantram = item[condition].tilethang;
                        infobet.change = item[condition].change;
                        infobet.defaultHi = item[condition].defaultHi;
                        infobet.onlose = item[condition].onlose;
                        infobet.tilethang = item[condition].tilethang;
                    }
                });
            });
            return infobet;
        };
        static getSeedInfo(id, cb){
            $.ajax({
                type: 'post',
                url: '/api/check-bet.php',
                data: {
                    "id": id
                },
                success: function (text) {
                    var val = JSON.parse(text);
                    if (val.return.success == "true"){
                        var type = val.return.type;
                        if(type != "roulette"){
                            return cb(val.return);
                        }
                    }
                }
            })
        }
        static updateStoreRound = () => {
            PlayGame.storeRound.round = PlayGame.currentRound;
            PlayGame.storeRound.win = 0;
            PlayGame.storeRound.lose = 0;
        };
        static updateChance = (amount_return)=>{
            // let go = PlayGame.getGoChange();
            // if(go && go.tilethang >= 30 && go.tilethang <= 50 && PlayGame.balanceLose > 0){
            //     let getPayout = PlayGame.getPayout(go.change);
            //     PlayGame.basebet = parseFloat(PlayGame.balanceLose / (getPayout - 1));
            //     PlayGame.basebet = PlayGame.basebet + PlayGame.basebet * go.onlose / 100;
            //     PlayGame.chance = go.change;
            //     PlayGame.defaultHi = go.defaultHi;
            // }else{
            //     PlayGame.defaultHi = (Math.floor(Math.random() * 100) + 1) % 2===0;
            //     PlayGame.chance = PlayGame.randomNumberFromRange(40, 49.5);
            // }
            PlayGame.basebet = parseFloat(PlayGame.basebet);
            if(PlayGame.balanceLose < 0){
                PlayGame.balanceLose = 0;
            }
            if (amount_return >= 0){
                PlayGame.win++;
                if (PlayGame.win >= PlayGame.maxWin) {
                    PlayGame.maxWin = PlayGame.win;
                }
                PlayGame.chance = PlayGame.defaultChange();
                PlayGame.defaultHi = (Math.floor(Math.random() * 100) + 1) % 2===0;
                PlayGame.basebet = PlayGame.defaultBasebet;
                PlayGame.lose = 0;
                if(PlayGame.balanceLose > 0 && PlayGame.flagGo){
                    if(PlayGame.flagGoRisk){
                        PlayGame.golandau = PlayGame.defaultGolandau;
                        PlayGame.getBackPrice = PlayGame.totalBet + PlayGame.currentBackPrice;
                    }
                    if(PlayGame.golandau > PlayGame.defaultGolandau){
                        PlayGame.golandau = PlayGame.defaultGolandau;
                    }
                    PlayGame.balanceLose -= parseFloat(amount_return);
                }
                CreateChart.updateChart(PlayGame.totalBet, PlayGame.profit, 'win');
            }else{
                PlayGame.lose++;
                if (PlayGame.lose >= PlayGame.maxLose) {
                    PlayGame.maxLose = PlayGame.lose;
                }
                PlayGame.win = 0;
                if(!PlayGame.flagLow){
                    PlayGame.balanceLose += PlayGame.basebet;
                }
                // let lostTang = PlayGame.basebet / (PlayGame.basebet * parseFloat(PlayGame.getPayout(PlayGame.chance)) - PlayGame.basebet) * 50;
                // PlayGame.basebet = PlayGame.basebet + PlayGame.basebet * lostTang / 100;
                CreateChart.updateChart(PlayGame.totalBet, PlayGame.profit, 'lose');
            }
            let lowChance = PlayGame.getLowChance();
            let goChance = PlayGame.getGoChange();
            if(!_.isEmpty(lowChance) && lowChance.tilethang >= 70){
                PlayGame.firstTimePlay ++;
                PlayGame.flagLow = true;
                PlayGame.flagNormal = false;
                PlayGame.flagGo = false;
                PlayGame.chance = lowChance.change;
                let getPayout = PlayGame.getPayout(PlayGame.chance);
                if(PlayGame.firstTimePlay === 1){
                    PlayGame.basebet = PlayGame.defaultBasebet / 10;
                }
                if (PlayGame.lose >= (parseFloat(getPayout) / 2)){
                    PlayGame.basebet = PlayGame.basebet + PlayGame.basebet * lowChance.onlose / 100;
                }
                PlayGame.defaultHi = lowChance.defaultHi;
            }else if (!_.isEmpty(goChance) && PlayGame.balanceLose > 0 && PlayGame.totalBet >= PlayGame.getBackPrice){
                PlayGame.flagLow = false;
                PlayGame.flagNormal = false;
                PlayGame.flagGo = true;
                PlayGame.flagGoRisk = false;
                let getPayoutGo = PlayGame.getPayout(goChance.change);
                if(goChance.tilethang >= 20 && goChance.tilethang <= 23){
                    PlayGame.flagGoRisk = false;
                    if(PlayGame.balanceLose / PlayGame.bigBalance * 100 < 1){
                        PlayGame.basebet = PlayGame.balanceLose / (getPayoutGo - 1);
                    }else{
                        PlayGame.basebet = PlayGame.balanceLose / 4 / (getPayoutGo - 1);
                    }
                    PlayGame.chance = goChance.change;
                    PlayGame.defaultHi = goChance.defaultHi;
                }else if(goChance.tilethang >= 7 && goChance.tilethang <= 10){
                    PlayGame.flagGoRisk = true;
                    PlayGame.basebet = (PlayGame.balanceLose / PlayGame.golandau) / (getPayoutGo - 1);
                    PlayGame.golandau--;
                    if(PlayGame.golandau <= 0){
                        PlayGame.golandau = 1;
                    }
                    PlayGame.chance = (98 - goChance.change) + 35;
                    PlayGame.defaultHi = !goChance.defaultHi;
                }else{
                    PlayGame.flagGoRisk = false;
                    PlayGame.basebet = PlayGame.defaultBasebet;
                    PlayGame.chance = 98 - goChance.change;
                    PlayGame.defaultHi = !goChance.defaultHi;
                }
            }else {
                PlayGame.flagLow = false;
                PlayGame.flagNormal = true;
                PlayGame.flagGo = false;
                PlayGame.chance = PlayGame.defaultChange();
                PlayGame.defaultHi = (Math.floor(Math.random() * 100) + 1) % 2===0;
                PlayGame.basebet = PlayGame.defaultBasebet;
            }

            PlayGame.condition = PlayGame.defaultHi ? '>' : '<';
            PlayGame.game = PlayGame.defaultHi ? parseFloat((100-PlayGame.chance-0.01)).toFixed(2) : parseFloat(PlayGame.chance).toFixed(2);
            if(PlayGame.basebet > PlayGame.currentBalance){
                PlayGame.basebet = PlayGame.currentBalance / 2;
            }
            if(PlayGame.basebet < 0.00000001 && devise === 'btc'){
                PlayGame.basebet = 0.00000001;
            }else if(PlayGame.basebet < 0.000005 && devise === 'etc'){
                PlayGame.basebet = 0.000005;
            }else if(PlayGame.basebet < 0.0000005 && devise === 'ltc'){
                PlayGame.basebet = 0.0000005;
            }else if(PlayGame.basebet < 0.05 && devise === 'doge'){
                PlayGame.basebet = 0.05;
            }else if(PlayGame.basebet < 0.00000010 && (devise === 'eth' || devise === 'bch')){
                PlayGame.basebet = 0.00000010;
            }else if(PlayGame.basebet < 0.00000020 && (devise === 'xmr' || devise === 'dash' || devise === 'zec')){
                PlayGame.basebet = 0.00000020;
            }else if(PlayGame.basebet < 0.01000000 && devise === 'burst'){
                PlayGame.basebet = 0.01000000;
            }else if (PlayGame.basebet < 0.00003000 && devise === 'strat'){
                PlayGame.basebet = 0.00003000;
            }
            $('#amount').val(parseFloat(PlayGame.basebet).toFixed(8));
            set_by_chance(PlayGame.chance, true);
        };
        static changeSeeds = (amount_return) => {
            if(PlayGame.startChangeSeeds && amount_return >= 0){
                modal_provably_fair();
                setTimeout(function () {
                    change_seeds();
                    PlayGame.startChangeSeeds = false;
                    PlayGame.dobet();
                    PlayGame.resetTileThang();
                }, 3000);
                return true;
            }else{
                return false;
            }
        };
        static dobet = () => {
            if (!PlayGame.stop){
                $.ajax({
                    type: "POST",
                    url: PlayGame.server_front_name + "/api/bet",
                    cache: false,
                    data: {
                        access_token: access_token,
                        username: user_username,
                        type: "dice",
                        amount: PlayGame.basebet,
                        condition: PlayGame.condition,
                        game: PlayGame.game,
                        devise: devise
                    },
                    success: function (text){
                        let val = JSON.parse(text);
                        if (val.return.success === 'true'){
                            let username = val.return.username;
                            let id = val.return.id;
                            let type = val.return.type;
                            let devise = val.return.devise;
                            let ts = val.return.ts;
                            let time = val.return.time;
                            let winning_chance = val.return.winning_chance;
                            let roll_number = val.return.roll_number;
                            let amount_return = val.return.amount_return;
                            let new_balance = val.return.new_balance;
                            let show = val.return.show;
                            let amount = val.return.amount;
                            let condition = val.return.condition;
                            let game = val.return.game;
                            let payout = val.return.payout;
                            PlayGame.updateTiLeThang(roll_number);
                            PlayGame.getSeedInfo(id, function (data) {
                                $.ajax({
                                    type:'post',
                                    data: data,
                                    url: API_URL+'insert',
                                    dataType: 'JSON',
                                    success: function (mygame){
                                        $("#balance-"+devise).val(round_float(new_balance, 12));
                                        $(".b__text").html(round_float(new_balance, 8));
                                        $("#currency-menu-top-"+devise+"-content").html(round_float(new_balance, 8));
                                        let roll_history = null;
                                        if (amount_return >= 0){
                                            roll_history = '<div class="last__results__block green" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\'' + id + '\'); return false;">' + parseFloat(roll_number).toFixed(2) + '</div>';
                                        } else{
                                            roll_history = '<div class="last__results__block red" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\'' + id + '\'); return false;">' + parseFloat(roll_number).toFixed(2) + '</div>';
                                        }

                                        $(".last__results__content").prepend(roll_history);

                                        $('.last__results__content div:first').animate({'marginLeft': '5px'}, 100, function () {
                                            let number_elements = $(".last__results__content div").size();
                                            if (number_elements == 6)
                                                $(".last__results__content div").get(5).remove();
                                        });

                                        addBetHistory("my-bets", type, id, username, time, amount, devise, winning_chance, roll_number, amount_return, condition, game, payout);

                                        datas_overall_session.number_bets++;
                                        datas_current_session.number_bets++;

                                        if (amount_return >= 0) {
                                            datas_overall_session.number_bets_wins++;
                                            datas_current_session.number_bets_wins++;

                                            var chanceCalcul = (100 / (parseFloat(winning_chance)) * 100);
                                            datas_overall_session.lucky_total = parseFloat(datas_overall_session.lucky_total) + parseFloat(chanceCalcul);
                                            datas_current_session.lucky_total = parseFloat(datas_current_session.lucky_total) + parseFloat(chanceCalcul);
                                        }
                                        else {
                                            datas_overall_session.number_bets_losses++;
                                            datas_current_session.number_bets_losses++;
                                        }

                                        datas_overall_session.lucky = (parseFloat(datas_overall_session.lucky_total / datas_overall_session.number_bets)).toFixed(2);
                                        datas_current_session.lucky = (parseFloat(datas_current_session.lucky_total / datas_current_session.number_bets)).toFixed(2);

                                        datas_overall_session.wagered = (parseFloat(datas_overall_session.wagered) + parseFloat(amount)).toFixed(8);
                                        datas_current_session.wagered = (parseFloat(datas_current_session.wagered) + parseFloat(amount)).toFixed(8);

                                        datas_overall_session.profit = (parseFloat(datas_overall_session.profit) + parseFloat(amount_return)).toFixed(8);
                                        datas_current_session.profit = (parseFloat(datas_current_session.profit) + parseFloat(amount_return)).toFixed(8);

                                        $("#current-bets-number").html(number_format(datas_current_session.number_bets));
                                        $("#current-wagered").html(datas_current_session.wagered);
                                        $("#current-profit").html(datas_current_session.profit);
                                        $("#current-bets-wins").html(number_format(datas_current_session.number_bets_wins));
                                        $("#current-bets-losses").html(number_format(datas_current_session.number_bets_losses));
                                        $("#current-lucky").html(datas_current_session.lucky + "%");

                                        var notifications = val.return.notifications;
                                        for (var prop in notifications) {
                                            if (notifications[prop].name == "rcvJackpotDice")
                                                rcvJackpotDice(notifications[prop]);
                                            else {
                                                rcvnotificationbet(notifications[prop]);
                                            }
                                        }

                                        if (amount_return >= 0)	{
                                            // $("#result__bet").addClass("green");
                                            $("#result__bet").html("+"+number_format(round_float(amount_return, 8), 8));

                                            $(".b__text").addClass("green");
                                        }
                                        else {
                                            // $("#result__bet").addClass("red");
                                            $("#result__bet").html(number_format(round_float(amount_return, 8), 8));

                                            $(".b__text").addClass("red");
                                        }

                                        setTimeout(function() {
                                            $(".b__text").removeClass("red green");
                                        }, 200);

                                        show_result();

                                        PlayGame.totalBet++;
                                        PlayGame.profit = (parseFloat(PlayGame.profit) + parseFloat(amount_return)).toFixed(8);
                                        if(PlayGame.profit >= PlayGame.lastBigProfit){
                                            PlayGame.lastBigProfit = PlayGame.profit;
                                        }
                                        PlayGame.currentBalance = parseFloat(new_balance);
                                        if(PlayGame.currentBalance > PlayGame.bigBalance){
                                            PlayGame.bigBalance = PlayGame.currentBalance;
                                        }
                                        if(parseFloat(PlayGame.profit) >= PlayGame.target * PlayGame.startBalance / 100){
                                            PlayGame.stopGame();
                                        }
                                        PlayGame.updateChance(amount_return);
                                        $('#current-win').html(PlayGame.win);
                                        $('#current-lose').html(PlayGame.lose);

                                        $('#current-max-win').html(PlayGame.maxWin);
                                        $('#current-max-lose').html(PlayGame.maxLose);

                                        $('#my-current-profit').html(PlayGame.profit);
                                        $('#current-pt-profit').html(PlayGame.getPhanTramProfit());

                                        $('#my-round').html(PlayGame.currentRound);
                                        $('#check-in-round').html(PlayGame.checkRollInRound);

                                        $('#balance-lose').html(parseFloat(PlayGame.balanceLose).toFixed(8));
                                        if(PlayGame.smartChangeSeeds){
                                            if(PlayGame.totalBet > PlayGame.rollChangeSeeds){
                                                if(PlayGame.profit / PlayGame.lastBigProfit * 100 < 10 || PlayGame.getPhanTramProfit() < -20){
                                                    PlayGame.rollChangeSeeds = PlayGame.totalBet + 1000;
                                                    PlayGame.startChangeSeeds = true;
                                                }
                                            }
                                        }

                                        if(!PlayGame.changeSeeds(amount_return)){
                                            PlayGame.dobet();
                                        }
                                    }
                                })
                            });
                        }
                    },
                    error: function () {
                        PlayGame.dobet();
                    }
                })
            }
        };
        static getPayout = (chance) => {
            let payout = (100/parseFloat(chance));
            payout = payout-(payout*(parseFloat(1)/100));
            let value = parseFloat(payout);
            if(value < 1000)
                value = value.toFixed(4);
            return value;
        };
        static startGame = () => {
            PlayGame.stop = false;
            PlayGame.dobet();
        };
        static stopGame = () => {
            PlayGame.stop = true;
            alert('Bet Stop');
        };
    }

    class CreateChart {
        createFullChart = null;
        static dps = [];
        static chart = null;
        static lengthChart = 1000;
        constructor(){
            this.createFullChart = $('<div/>', {id: 'full-site', class: 'game__container', style: 'width: 100%;height: '+$('.game__left__content').height() +'px'});
            this.addHtml();
            this.addChart();
        }
        addHtml(){
            $('.game__container__content .game__left').append(this.createFullChart);
        }
        addChart(){
            CreateChart.chart = new Canvasjs.Chart('full-site', {
                theme: 'light2',
                title :{
                    text: "Bitsler Chart Betting",
                    fontSize: 12
                },
                legend: {
                    verticalAlign: "center"  // "top" , "bottom"
                },
                axisY: {
                    labelFontSize: 11,
                    title: 'Profit',
                    includeZero: false,
                    valueFormatString: "#,##0.########",
                    titleFontSize: '12'
                },
                axisX: {
                    labelFontSize: 11,
                    title: 'Bet',
                    titleFontSize: '12'
                },
                data: [{
                    type: "line",
                    dataPoints: CreateChart.dps,
                    animationEnabled: true,
                    animationDuration: 2000
                }],
            });
            CreateChart.chart.render();
        }
        static updateChart(x, y, type){
            y = parseFloat(y);
            let color = null;
            if(type === 'win'){
                color = '#00695C';
            }else{
                color = '#FF1744';
            }
            CreateChart.dps.push({
                x: x,
                y: y,
                color: color
            });
            if(CreateChart.dps[CreateChart.dps.length - 2]){
                CreateChart.dps[CreateChart.dps.length - 2].lineColor = color;
            }
            if (CreateChart.dps.length > CreateChart.lengthChart) {
                CreateChart.dps.shift();
            }
            CreateChart.chart.render();
        }
    }

    let chart = new CreateChart();
    let game = new PlayGame();
});