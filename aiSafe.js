requirejs([
    'https://canvasjs.com/assets/script/jquery.canvasjs.min.js',
    'https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js'
], function (
    Canvasjs, _
) {
    function randomNumberFromRange(min,max)
    {
        var rdChange = parseFloat(Math.random()*(max-min)+min).toFixed(2);
        if(rdChange == 0){
            return randomNumberFromRange(min, max);
        }else{
            return rdChange;
        }
    }
    const API_URL = '//dicegametool.com/api/';
    const NAME_AUTO = 'AI tactic fast v2.1.0';
    class PlayGame {
        basebet: number = 0;
        seedsClient: string = $('#seed-client-current').text();
        seedsHash: string = $('#seed-server-hashed-current').text();
        balanceLose: number = 0;
        coin: string = devise;
        game: string;
        profit: any = 0;
        startBalance: number = parseFloat($('#balance-'+devise).val());
        currentBalance: number = this.startBalance;
        target: number = 50;
        defaultBasebet: number = this.basebet;
        autoStart: boolean = false;
        stop: boolean = true;
        flagGo: boolean = false;
        totalBet: number = 0;
        win: number = 0;
        lose: number = 0;
        maxWin: number = 0;
        maxLose: number = 0;
        dataRoll: {};
        onRunRollNumber: number = 1;
        databet: Object;
        dataTotalRoll: Object;
        changeSeeds: number = 5000;
        defaultChangeSeeds: number = this.changeSeeds;
        notCare: boolean = false;
        constructor(){}
        callPrompt(text): void{
            return prompt(text);
        }
        loadData(): Promise<any>{
            $('.loader-page p.mar-top').text('Bot on loading please wait for minute');
            $(".loader-page").show();
            return $.ajax({
                url: API_URL+'load-index-roll/'+this.seedsHash,
                type: 'get',
                dataType: "json",
                context: this
            });
        }
        showError(text): void{
            showErrorNotification('ERROR', text);
        }
        showSuccess(text): void{
            showSuccessNotification('SUCCESS', text);
        }
        getPhanTramProfit (): void {
            return ((parseFloat(this.profit) / this.startBalance * 100) || 0).toFixed(2);
        };
        createTool (): void {
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
            block1.append($('<div/>', {class: 'row__game__options__pie game__options__pie__1'}).append('<input type="text" id="target" value="'+this.target+'" />'));
            var block2 = $('<div/>', {class: 'row__game__options__block border__right'}).append('<div class="title">Roll change seeds</div>');
            block2.append($('<div/>', {class: 'row__game__options__pie game__options__pie__2'}).append('<input type="text" id="changeseeds" value="'+this.changeSeeds+'" />'));
            fatherOptions.css('flex-wrap', 'wrap');
            fatherOptions.append(block1).append(block2);
            targetOptions.closest('.row__game').after($('<div/>', {class: 'row__game'}).append(fatherOptions));
            var buttonStart = $('#btn-bet-dice').clone();
            $('#btn-bet-dice').remove();
            var buttonStop = buttonStart.clone();
            var buttonClear = buttonStart.clone();
            var buttonLog = buttonStart.clone();
            buttonStart.attr('id', 'btn-start-bot').text('Start bot').css('width', 'calc(100% / 3)').css('background', '#87be4d');
            buttonStop.attr('id', 'btn-stop-bot').text('Stop bot').css('width', 'calc(100% / 3)').css('background', '#f76c51');
            buttonClear.attr('id', 'btn-clear-bot').text('Clear bot').css('width', 'calc(100% / 3)');
            buttonLog.attr('id', 'btn-log-bot').text('Log bot').css('width', 'calc(100%)');
            $('.game__left__content').append(buttonStart).append(buttonStop).append(buttonClear).append(buttonLog);
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
            div50profit.append($('<div/>', {id: 'my-current-profit', class: 'stats__div__infos', text: this.profit}));

            var div50profitPT = (div50.clone()).append('<h5>Phần trăm profit</h5>');
            div50profitPT.append($('<div/>', {id: 'current-pt-profit', class: 'stats__div__infos', text: this.getPhanTramProfit()}));

            var div100BalanceLose = (div100.clone()).append('<h5>Balance Lose</h5>');
            div100BalanceLose.append($('<div/>', {id: 'balance-lose', class: 'stats__div__infos', text: 0}));

            var flex1 = divflex.clone();
            var flex2 = divflex.clone();
            var flex3 = divflex.clone();
            var flex4 = divflex.clone();

            flex1.attr('id', 'flexrow1').append(div50won).append(div50lose);
            flex2.attr('id', 'flexrow2').append(div50maxWon).append(div50maxLose);
            flex3.attr('id', 'flexrow3').append(div100BalanceLose);
            flex4.attr('id', 'flexrow4').append(div50profit).append(div50profitPT);

            if($('#flexrow1').length == 0 && $('#flexrow2').length == 0 && $('#flexrow3').length == 0){
                $('.dice__stats__current').append(flex1).append(flex2).append(flex3).append(flex4);
            }

            $('.dice__stats').height(580);
            $('.dice__stats__content').height(500);

            $('.dice__stats__current.stats__div').width('calc(100% - 30px)');
        }
        dobet(): Promise<any> {
            if (!this.stop){
                return $.ajax({
                    type: "POST",
                    url: "/api/bet",
                    cache: false,
                    context: this,
                    data: {
                        access_token: access_token,
                        username: user_username,
                        type: "dice",
                        amount: this.basebet,
                        condition: this.databet.condition,
                        game: this.databet.game,
                        devise: this.coin
                    }
                });
            }else{
                var dfd = jQuery.Deferred();
                dfd.resolve(false);
                return dfd.promise();
            }
        }
        infoSeeds(id): Promise<any>{
            return $.ajax({
                type: 'post',
                url: '/api/check-bet.php',
                context: this,
                data: {
                    "id": id
                }
            });
        }
        insertBet(data): Promise<any>{
            return $.ajax({
                type:'post',
                data: data,
                url: API_URL+'insert',
                context: this,
                dataType: 'JSON',
            });
        }
        stopGame(): void{
            this.stop = true;
            this.autoStart = false;
            this.defaultBasebet = 0;
            alert('Bet stop');
        }
        startGame(): void{
            var self = this;
            this.dobet().then(this.updateBet, function () {
                self.startGame();
            });
        }
        getPayout(chance): void{
            let payout = (100/parseFloat(chance));
            payout = payout-(payout*(parseFloat(1)/100));
            let value = parseFloat(payout);
            if(value < 1000)
                value = value.toFixed(4);
            return value;
        }
        updateTilethang(roll_number): void{
            if(roll_number > 50.49){
                this.dataTotalRoll.hi += 1;
            }else if(roll_number < 49.5){
                this.dataTotalRoll.low += 1;
            }
            let key = roll_number.toFixed(2);
            this.dataRoll[key].slxh += 1;
            // this.dataRoll[key].list_stt.push(this.totalBet);
            this.dataRoll[key].roll_number = roll_number;
        }
        resetTilethang(): void{
            this.dataTotalRoll.hi = 0;
            this.dataTotalRoll.low = 0;
            var self = this;
            _.forEach(this.dataRoll, function (val, key) {
                self.dataRoll[key].slxh = 0;
            });
        }
        logData(): void{
            console.log(JSON.stringify(this.dataRoll), this.dataTotalRoll);
        }
        getRdSlxh(roll): void{
            let countSlxh = _.countBy(roll, function (o) {
                return o.slxh;
            });
            let key = Object.keys(countSlxh)[0];
            return Math.floor(Math.random() * countSlxh[key]) + 0;
        }
        loadDatabet():void {
            let rollHi = {};
            let rollLow = {};
            let rollNormal = {};
            if (!_.isEmpty(this.dataRoll)){
                _.forEach(this.dataRoll, function (val, key) {
                    if(parseFloat(key) > 50.49){
                        rollHi[key] = val;
                    }else if (parseFloat(key) < 49.5){
                        rollLow[key] = val;
                    }else{
                        rollNormal[key] = val;
                    }
                });
                let sortHi = _.orderBy(rollHi, ['slxh'], ['desc']);
                let sortLow = _.orderBy(rollLow, ['slxh'], ['desc']);
                let sortNormal = _.orderBy(rollNormal, ['slxh'], ['desc']);
                let roll = [];
                if(this.dataTotalRoll.hi > this.dataTotalRoll.low){
                    roll = _.concat(roll, sortLow, sortHi, sortNormal);
                }else{
                    roll = _.concat(roll, sortHi, sortLow, sortNormal);
                }
                let bet = roll[this.getRdSlxh(roll)];
                return this.updateToBet(bet);
            }
        }
        updateToBet(bet): void{
            if(this.dataTotalRoll.low < this.dataTotalRoll.hi){
                bet.condition = '<';
                if(bet.roll_number >= 98)
                    bet.roll_number = 97.99;
                bet.game = parseFloat(bet.roll_number) + 0.01;
                bet.chance = bet.game.toFixed(2);
            }else{
                bet.condition = '>';
                if(bet.roll_number <= 2)
                    bet.roll_number = 2;
                bet.game = parseFloat(bet.roll_number) - 0.01;
                bet.chance = (100 - bet.game - 0.01).toFixed(2);
            }
            let payout = this.getPayout(parseFloat(bet.chance));
            bet.onlose = 1 / (1 * payout - 1) * 100;
            return bet;
        }
        doScript(amount_return): void{
            this.basebet = parseFloat(this.basebet);
            this.databet = this.loadDatabet();
            if (amount_return >= 0){
                this.win++;
                if (this.win >= this.maxWin) {
                    this.maxWin = this.win;
                }
                this.basebet = this.defaultBasebet;
                this.lose = 0;
                if(this.balanceLose > 0){
                    this.balanceLose -= parseFloat(amount_return);
                }
                CreateChart.updateChart(this.totalBet, this.profit.toFixed(8), 'win');
            }else{
                this.lose++;
                if (this.lose >= this.maxLose) {
                    this.maxLose = this.lose;
                }
                this.win = 0;
                this.balanceLose += this.basebet;
                this.basebet = this.basebet + this.basebet * this.databet.onlose / 100;
                CreateChart.updateChart(this.totalBet, this.profit.toFixed(8), 'lose');
            }
            let payout = this.getPayout(this.databet.chance);
            if(this.balanceLose > 0){
                this.basebet = this.balanceLose / (payout - 0.5);
                this.basebet = this.basebet + this.basebet * this.databet.onlose / 100;
            }
            if(this.balanceLose <= 0){
                this.balanceLose = 0;
            }
            if(this.basebet > this.currentBalance){
                this.basebet = this.currentBalance / 2;
            }
            if(this.basebet < 0.00000001 && this.coin === 'btc'){
                this.basebet = 0.00000001;
            }else if(this.basebet < 0.000005 && this.coin === 'etc'){
                this.basebet = 0.000005;
            }else if(this.basebet < 0.0000005 && this.coin === 'ltc'){
                this.basebet = 0.0000005;
            }else if(this.basebet < 0.05 && this.coin === 'doge'){
                this.basebet = 0.05;
            }else if(this.basebet < 0.00000010 && (this.coin === 'eth')){
                this.basebet = 0.00000010;
            }else if(this.basebet < 0.00000005 && (this.coin === 'bch')){
                this.basebet = 0.00000005;
            } else if(this.basebet < 0.00000020 && (this.coin === 'xmr' || this.coin === 'dash')){
                this.basebet = 0.00000020;
            }else if (this.basebet < 0.00000025 && this.coin === 'zec'){
                this.basebet = 0.00000025;
            }else if(this.basebet < 0.01000000 && this.coin === 'burst'){
                this.basebet = 0.01000000;
            }else if (this.basebet < 0.00003000 && this.coin === 'strat'){
                this.basebet = 0.00003000;
            }
            $('#amount').val(parseFloat(this.basebet).toFixed(8));
            set_by_chance(this.databet.chance, true);
        }
        updateBet(text): void{
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
                // this.infoSeeds(id).then(resText => {
                //     var valSeeds = JSON.parse(resText);
                //     valSeeds = valSeeds.return;
                //     let dataPush = {
                //         'seed_client_nonced': valSeeds.seed_client_nonced,
                //         'seed_server': valSeeds.seed_server,
                //         'seed_server_old': $('#last_seed_server_hashed').text(),
                //         'seed_server_not_hash': $('#last_seed_server_revealed').text(),
                //         'seed_client_old': $('#last_seed_client').text(),
                //         'need_data': 1,
                //         'from': this.from,
                //         'to': this.to,
                //         'roll_number': valSeeds.roll_number,
                //         'username': valSeeds.username,
                //         'level': valSeeds.level,
                //         'chance': valSeeds.chance,
                //         'amount': valSeeds.amount,
                //         'devise': valSeeds.devise
                //     };
                //     this.insertBet(dataPush).then(gameData => {
                this.updateTilethang(roll_number);
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
                this.totalBet++;
                this.profit = (parseFloat(this.profit) + parseFloat(amount_return));
                this.currentBalance = parseFloat(new_balance);
                if(parseFloat(this.profit) >= this.target * this.startBalance / 100){
                    this.stopGame();
                }
                this.doScript(amount_return);
                $('#current-win').html(this.win);
                $('#current-lose').html(this.lose);

                $('#current-max-win').html(this.maxWin);
                $('#current-max-lose').html(this.maxLose);

                $('#my-current-profit').html(this.profit.toFixed(8));
                $('#current-pt-profit').html(this.getPhanTramProfit());

                $('#balance-lose').html(parseFloat(this.balanceLose).toFixed(8));
                if(amount_return >= 0){
                    if(this.totalBet >= this.changeSeeds){
                        this.changeSeeds = this.totalBet + this.defaultChangeSeeds;
                        modal_provably_fair();
                        var self = this;
                        setTimeout(function () {
                            change_seeds();
                            self.resetTilethang();
                            self.startGame();
                            setTimeout(function () {
                                $('html, body').animate({
                                    scrollTop: $(".game__container__content .game__left .bet__amount_options").offset().top + 10
                                }, 1000);
                            }, 3000)
                        }, 3000);
                    }else{
                        this.startGame();
                    }
                }else{
                    this.startGame();
                }
                //     });
                // });
            }else{
                this.showError(val.return.value);
                this.stopGame();
            }
        }
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
    let game = new PlayGame();
    game.loadData().then(respon => {
        setTimeout(function(){
            $(".loader-page").fadeOut("slow");
        }, 2000);
        if(respon.message){
            alert(respon.message);
        }
        if(respon.status === 'success'){
            game.dataRoll = respon.data;
            game.dataTotalRoll = respon.total_roll;
            game.databet = game.loadDatabet();
            game.createTool();
            let chart = new CreateChart();
            $('.game__left__content').on('click', '#btn-log-bot', function () {
                game.logData();
            });
            $('.game__left__content').on('click', '#btn-start-bot', function () {
                if(game.autoStart){
                    game.showError('Bot on running');
                    return;
                }
                game.stop = false;
                game.autoStart = true;
                game.coin = devise;
                game.changeSeeds = parseFloat($('#changeseeds').val());
                game.defaultChangeSeeds = game.changeSeeds;
                game.basebet = parseFloat($('#amount').val());
                game.startBalance = parseFloat($('#balance-'+devise).val());
                game.target = parseFloat($('#target').val());
                if(game.defaultBasebet === 0){
                    game.defaultBasebet = game.basebet;
                }
                if(game.basebet <= 0.00000000){
                    game.showError('Xin nhập base bet');
                    game.autoStart = false;
                    game.stop = true;
                }else{
                    game.startGame();
                }
            });
            $('.game__left__content').on('click', '#btn-stop-bot', function () {
                game.stopGame();
            });
        }
    });
});