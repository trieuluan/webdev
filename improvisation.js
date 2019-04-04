requirejs([
    'https://canvasjs.com/assets/script/jquery.canvasjs.min.js'
], function (CanvasJS) {
    $('#body').css('background-image', 'linear-gradient(292deg, #00c3ff 4%, rgba(136, 0, 255, 0.7)');
    $('#header').css('display', 'none');
    $('#news').css('display', 'none');
    $('#main').css('padding', '0px');
    $('#content').css('background', 'none');
    $('#gameContainer').html('<div id="chart"></div><div id="log"></div>');
    $('#gameContainer').css('width', '1050px');
    $('#gameContainer').css('height', '300px');
    $('#gameContainer').css('margin', 'auto');
    $('#gameContainer').css('padding', '10px');
    $('#chart').width('60%');
    $('#controlContainer').css('background', 'none');
    $('#controlContainer input[type=text]:read-only').css('color', '#ffffff');
    $('.btn.gray:hover').css('color', '#545454');
    $('.btn.gray').css('color', '#949494');
    $('.btn.gray').css('float', 'right');
    $('.inputBox input:read-only, .textBox textarea:read-only').css('color', '#ffffff');
    $('.inputBox .label, .textBox .label, .selectBox .label').css('color', '#ffffff');
    $('.inputBox input, .textBox .textarea, .textBox textarea, .radioBox input[type=text]').css('background', '#ffffff');
    $('.inputBox input, .textBox .textarea, .textBox textarea, .radioBox input[type=text]').css('border', '1px #ffffff solid');
    $('.inputBox .label, .textBox .label, .selectBox .label').css('color', '#ffffff');
    $('#controlContainer .coinContainer .coin span').css('color', '#ac7ff9');
    $('#controlContainer .coinContainer a.active .coin span, #controlContainer .coinContainer .coin:hover span').css('color', '#ffffff');
// $('.balanceContainer').css('border', 'none');
    $('.betContainer').html('<center><div class="inputBox">' +
        '<input type="number" id="betAmount" value="0.00000001" style="color: #fff; background: none; text-align: center; width="50%; float: left;"> ' +
        // '<input type="number" id="underBalance" style="color: #fff; background: none; text-align: center; width="50%; float: right;"><br> ' +
        '<button class="btn green" id="startBot">Start BOT</button> ' +
        '<button class="btn red" id="stopBot">Stop BOT</button> ' +
        '<button class="btn gray" id="resetBot">Reset BOT</button><br> ' +
        '<button class="btn gray" id="viewStatic">View Static</button> ' +
        '</center> ' +
        '<div style="margin-top: 10px;" id="static"> ' +
        '<div style="float: left;">Time = <span id="time">0:0:0:0</span></div> ' +
        '<div style="float: right;">Speed = <span id="speed">0.00</span></div><br> ' +
        '<div style="float: left;">Profit = <span id="profit">0.00000000</span></div> ' +
        '<div style="float: right;">Wagered = <span id="wagered">0.00000000</span></div><br> ' +
        '<center>Largest Bet = <span id="largestbetAmount">0.00000000</span><br>' +
        ' Bet = <span id="bet">0</span> Win = <span id="win">0</span>  Lose = <span id="lose">0</span></center> ' +
        '<div>Win Streak = <span id="winStreak">0</span></div> ' +
        '<div>Lose Streak = <span id="loseStreak">0</span></div><br> ' +
        '<div>Max Win Streak = <span id="maxWinStreak">0</span></div> ' +
        '<div>Max Lose Streak = <span id="maxLoseStreak">0</span></div><br> ' +
        '<div>Balance lose = <span id="balancelose">0</span></div> </div>');
    $('.betContainer').css('font-size', '16px');
    $('.betContainer').css('color', '#fff');
    $('.coin').css('background', 'none');
    $('.inputBox input').css('background', 'none');
    $('.inputBox input').css('border', '1px solid white');
    $('.inputBox input').css('-webkit-box-shadow', 'none');
    $('#coinSearch').css('background', 'none');
    $('#coinSearch').css('border', '1px solid white');
    $('#coinSearch').css('-webkit-box-shadow', 'none');
    $('#listContainer').css('display', 'none');
    $('#frontText').css('display', 'none');
    $('#footer').css('display', 'none');
    $('#log').css('background', 'none');
    $('#log').css('overflow', 'auto');
    $('#log').css('width', '38%');
    $('#log').css('height', '293px');
    $('#log').css('text-align', 'center');
    $('#log').css('float', 'right');
    $('#log').css('color', '#fff');
    $('#log').css('font-size', '14px');
    $('#log').css('border', '1px solid white');
    $('#log').css('border-top-left-radius', '3px');
    $('#log').css('border-bottom-left-radius', '3px');
    $('div[class="tab tab-show"]:nth-child(4)').css('display', 'none');
    log('BOT has applied!');
    document.getElementById('static').hidden = true;
    let startbalance = parseFloat($('#balance').val()),
        onBalance = 0,
        basebetAmount = parseFloat($('#betAmount').val()),
        betAmount = basebetAmount,
        largestbetAmount = 0,
        largesBalance = startbalance,
        direction = (Math.floor(Math.random() * 100) + 1) % 2===0 ? 'over' : 'under',
        prediction = defaultChange(),
        wagered = 0,
        profit = 0,
        largestProfit = 0,
        underBalance = 0,
        overBalance = 0,
        bet = 0,
        win = 0,
        winStreak = 0,
        maxWinStreak = 0,
        lose = 0,
        loseStreak = 0,
        maxLoseStreak = 0,
        run = false,
        runBet = 0,
        runLog = 0,
        dps = [],
        chart,
        color = '',
        time = '0:0:0:0',
        startTime = 0,
        onTime = 0,
        playTime = 0,
        playDay = 0,
        playHour = 0,
        playMinute = 0,
        playSecond = 0,
        chanceGo = {min: 10, max: 80},
        listGameGo = [],
        balancelose = 0,
        golandau = 0,
        flagGo = false,
        flagNormal = false,
        getBackPrice = 5,
        currentBackPrice = getBackPrice,
        speed = 0;
    function getPayout (chance) {
        let payout = (100/parseFloat(chance));
        payout = payout-(payout*(parseFloat(1)/100));
        let value = parseFloat(payout);
        if(value < 1000)
            value = value.toFixed(4);
        return value;
    }
    function createChange () {
        for (let i = chanceGo.min; i <= chanceGo.max; i += 1){
            let getPayoutForMulti = getPayout(i);
            listGameGo.push({
                hi: {
                    game: parseFloat((100-i-0.01)).toFixed(0),
                    risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                    change: i.toFixed(0),
                    lose: 0,
                    direction: 'over',
                    tilethang: 0,
                    onlose: 1 / (1 * getPayoutForMulti - 1) * 120
                },
                low: {
                    game: parseFloat(i).toFixed(2),
                    risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                    change: i.toFixed(0),
                    lose: 0,
                    direction: 'under',
                    tilethang: 0,
                    onlose: 1 / (1 * getPayoutForMulti - 1) * 120
                }
            });
        }
    }
    createChange ();
    function updateTiLeThang (roll_number) {
        listGameGo.forEach(function (item) {
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
    }
    function resetTileThang () {
        listGameGo.forEach(function (item) {
            ['hi', 'low'].forEach(function (condition) {
                item[condition].tilethang = 0;
            });
        });
    }
    function getGoChange(){
        let infobet = {};
        let phantram = 0;
        listGameGo.forEach(function (item) {
            ['hi', 'low'].forEach(function (condition) {
                if (item[condition].tilethang >= 20 && item[condition].tilethang <= 25){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.direction = item[condition].direction;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if(item[condition].tilethang >= 10 && item[condition].tilethang <= 20){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.direction = item[condition].direction;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }else if(item[condition].tilethang >= phantram){
                    phantram = item[condition].tilethang;
                    infobet.change = item[condition].change;
                    infobet.direction = item[condition].direction;
                    infobet.onlose = item[condition].onlose;
                    infobet.tilethang = item[condition].tilethang;
                }
            });
        });
        return infobet;
    }
    function updateChange(gameStatus, amount_return) {
        if(golandau <= 0){
            golandau = 1;
        }
        if (balancelose > 0){
            balancelose = 0;
        }
        if(gameStatus === 'win'){
            if(balancelose < 0 && flagGo){
                balancelose += parseFloat(amount_return);
                golandau++;
                if(golandau > 10){
                    golandau = 10;
                }
            }
        }else{
            balancelose += parseFloat(amount_return);
        }
        let goChance = getGoChange();
        if(balancelose < 0 && bet >= getBackPrice){
            flagGo = true;
            flagNormal = false;
            let getPayoutGo = getPayout(goChance.change);
            if (goChance.tilethang >= 20 && goChance.tilethang <= 25){
                if(Math.abs(balancelose) / largesBalance * 100 < 1){
                    betAmount = Math.abs(balancelose) / (getPayoutGo - 1);
                }else{
                    betAmount = Math.abs(balancelose) / 100 / (getPayoutGo - 1)
                }
                prediction = goChance.change;
                direction = goChance.direction;
            }else if(goChance.tilethang >= 10 && goChance.tilethang <= 20){
                getBackPrice = bet + currentBackPrice;
                betAmount = Math.abs(balancelose) / golandau / (getPayoutGo - 1);
                if(betAmount / onBalance * 100 > 10){
                    betAmount = 10 * onBalance / 100;
                }
                golandau--;
                prediction = 98 - goChance.change;
                direction = goChance.direction === 'over' ? 'under' : 'over';
            }else{
                betAmount = Math.abs(balancelose) / 100 / (getPayoutGo - 1);
                prediction = 98 - goChance.change;
                direction = goChance.direction === 'over' ? 'under' : 'over';
            }
        }else{
            flagGo = false;
            flagNormal = true;
            direction = (Math.floor(Math.random() * 100) + 1) % 2===0 ? 'over' : 'under';
            prediction = defaultChange();
            betAmount = basebetAmount;
        }
        if(betAmount < 0.00000001){
            betAmount = basebetAmount;
        }
        if(betAmount > onBalance){
            betAmount = onBalance / 2
        }
    }
    dps = [{ x: 0, y: 0 }];
    chart = new CanvasJS.Chart('chart', {
        theme: 'light2',
        zoomEnabled: true,
        height: 295,
        axisX:{
            title: "Bet",
            includeZero: false,
        },
        axisY:{
            title: "Profit",
            includeZero: false,
        },
        title: { text: 'Bot Luckygames by Trương Triệu Luân Base on code Mai hoàng quốc bảo improvisation Themes by Hữu Hà EtherFact', fontSize: 16 },
        data: [{ type: 'stepLine', dataPoints: dps }]
    });
    chart.render();

    function updateChart(bet, profit, color) {
        dps.push({ x: bet, y: profit, color: color });
        if (dps[dps.length - 2]) {
            dps[dps.length - 2].lineColor = color;
        }
        if (dps.length > 1e3) {
            dps.shift();
        }
        chart.render();
    }
    function viewStatic() {
        document.getElementById('static').hidden = false;
    }
    $('#viewStatic').on('click',function () {
        viewStatic();
    });
    function viewLog() {
        document.getElementById('static').hidden = true;
        document.getElementById('log').hidden = false;
    }
    function log(string) {
        $('<p style="text-align: center; margin: 0px;">' + string + '</p>').appendTo('#log');
    }
    function startBot() {
        run = true;
        startTime = new Date();
        if ($('#underBalance').val() === '') {
            underBalance = 0;
        } else {
            underBalance = $('#underBalance').val();
        }
        if ($('#overBalance').val() === '') {
            overBalance = 0;
        } else {
            overBalance = $('#overBalance').val();
        }
        basebetAmount = parseFloat($('#betAmount').val());
        betAmount = basebetAmount;
        startbalance = parseFloat($('#balance').val());
        largesBalance = startbalance;
        runBot();
    }
    $('#startBot').on('click',function () {
        startBot();
    });
    function stopBot() {
        run = false;
    }
    $('#stopBot').on('click', function () {
        stopBot();
    });
    function defaultChange() {
        return randomNumberFromRange(40, 66);
    }
    function randomNumberFromRange(min,max){
        let rdChange = parseFloat(Math.random()*(max-min)+min).toFixed(0);
        if(rdChange === 0){
            PlayGame.randomNumberFromRange(min, max);
        }else{
            return rdChange;
        }
    }
    function resetBot() {
        log('BOT has reset!');
        return;
    }
    $('#resetBot').on('click', function () {
        resetBot();
    });
    function runBot() {
        if (run === true) {
            jQuery.ajax({
                url: '/ajx/',
                type: 'POST',
                dataType: 'html',
                cache: false,
                timeout: 2e4,
                data: {
                    game: 'dice',
                    coin: $('#coin').val(),
                    betAmount: betAmount,
                    prediction: prediction,
                    direction: direction,
                    clientSeed: $('#clientSeed').val(),
                    serverSeedHash: $('#serverSeedHash').html(),
                    action: 'playBet',
                    hash: user.hash
                },
                success: function (data) {
                    let a = JSON.parse(data);
                    gameResult = a.gameResult;
                    if (a.result === true) {
                        $('#serverSeedHash').html(a.serverSeedHash);
                        $('#prevServerSeed').html(a.prevServerSeed);
                        $('#prevServerSeedHash').html(a.prevServerSeedHash);
                        $('#prevClientSeed').html(a.prevClientSeed);
                        $('#balance').animateBalance(a.balance);
                        // $('#balance').val(a.balance);
                        bet++;
                        wagered = parseFloat(wagered) + parseFloat(betAmount);
                        onBalance = parseFloat(a.balance);
                        if(onBalance > largesBalance){
                            largesBalance = onBalance;
                        }
                        profit = onBalance - startbalance;
                        onTime = new Date().getTime();
                        playTime = onTime - startTime;
                        playDay = Math.floor(playTime / (1e3 * 60 * 60 * 24));
                        playHour = Math.floor((playTime % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60));
                        playMinute = Math.floor((playTime % (1e3 * 60 * 60)) / (1e3 * 60));
                        playSecond = Math.floor((playTime % (1e3 * 60)) / 1e3);
                        time = '' + playDay + ':' + playHour + ':' + playMinute + ':' + playSecond + '';
                        speed = parseFloat((bet / playTime) * 1e3);
                        if (gameResult === 'win') {
                            win++;
                            winStreak++;
                            loseStreak = 0;
                            color = '#2eab5b';
                        } else {
                            lose++;
                            loseStreak++;
                            winStreak = 0;
                            color = '#ab2e40';
                        }
                        if (winStreak >= maxWinStreak) { maxWinStreak = winStreak; }
                        if (loseStreak >= maxLoseStreak) { maxLoseStreak = loseStreak; }
                        if (betAmount >= largestbetAmount) { largestbetAmount = betAmount; }
                        if (profit >= largestProfit) { largestProfit = profit; }
                        runLog++;
                        if (runLog > 1e2) {
                            runLog = 0;
                            $('#log p').remove();
                        }
                        log('<font style="color: ' + color + ';">' + betAmount.toFixed(8) + ' ' + direction + ' ' + prediction + ' -> ' + a.resultNumber + ' ' + a.gameResult + ' ' + parseFloat(a.profit).toFixed(8) + '</font>');
                        $('#log').stop().animate({ scrollTop: $('#log')[0].scrollHeight });
                        if (overBalance != 0 && onBalance >= overBalance) {
                            log('Over balance!');
                        } else if (underBalance != 0 && onBalance <= underBalance) {
                            log('Under balance!');
                        } else {
                            updateTiLeThang(a.resultNumber);
                            updateChange(gameResult, a.profit);
                        }
                        $('#time').html(time);
                        $('#speed').html(speed.toFixed(2));
                        $('#bet').html(bet);
                        $('#win').html(win);
                        $('#winStreak').html(winStreak);
                        $('#maxWinStreak').html(maxWinStreak);
                        $('#lose').html(lose);
                        $('#loseStreak').html(loseStreak);
                        $('#maxLoseStreak').html(maxLoseStreak);
                        $('#largestbetAmount').html(largestbetAmount.toFixed(8));
                        $('#profit').html(profit.toFixed(8));
                        $('#wagered').html(wagered.toFixed(8));
                        $('#balancelose').html(balancelose.toFixed(8));
                        updateChart(bet, profit, color);
                        runBot();
                    }
                },
                error: function (xhr, ajaxOptions, throwagerednError) {

                },
                timeout: function (xhr, ajaxOptions, throwagerednError) {
                    check = true;
                },
                abetort: function (xhr, ajaxOptions, throwagerednError) {
                    check = true;
                }
            });
        } else {
            log('BOT has stopped!');
            return;
        }
    }
});