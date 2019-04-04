$('.betContainer').html('<center>' +
    '<input type="number" id="betAmount" placeholder="bet amount" style="text-align: center; width="30%; float: left;"> ' +
    '<input type="number" id="under_balance" placeholder="Under Balance" style="text-align: center; width="30%; float: left;"> ' +
    '<input type="number" placeholder="Target Profit %" id="target" value="100" style="text-align: center; width="30%; float: left;"><br> ' +
    '<button id="startBot" onclick="startBot();">Start BOT</button> ' +
    '<button id="stopBot" onclick="stopBot();">Stop BOT</button> ' +
    '<button id="resetBot" onclick="resetBot();">Reset BOT</button> ' +
    '<button id="viewStatic" onclick="viewStatic();">View Static</button> ' +
    '</center> ' +
    '<div style="margin-top: 10px;font-size: 18px;color: white;" id="static"> ' +
    '<div style="float: left;">Time = <span id="time">0:0:0:0</span></div> ' +
    '<div style="float: right;">Speed = <span id="speed">0.00</span></div><br> ' +
    '<div style="float: left;">Profit = <span id="profit">0.00000000</span></div> ' +
    '<div style="float: right;">Wagered = <span id="wagered">0.00000000</span></div><br> ' +
    '<center>Largest Bet = <span id="max_betAmount">0.00000000</span><br>' +
    ' Bet = <span id="bet">0</span> Win = <span id="win">0</span>  Lose = <span id="lose">0</span></center> ' +
    '<div style="float: left;">Win Streak = <span id="winStreak">0</span></div> ' +
    '<div style="float: right;">Lose Streak = <span id="loseStreak">0</span></div><br> ' +
    '<div style="float: left;">Max Win Streak = <span id="maxWinStreak">0</span></div> ' +
    '<div style="float: right;">Max Lose Streak = <span id="maxLoseStreak">0</span></div><br> ' +
    '<div style="float: left;">Highest Balance = <span id="largesBalance">0</span></div> </div>');
$('#content').css('background','none');
$('#frontText').remove();
$('#news').remove();
$('#footer').remove();
$('#listContainer').css('display', 'none');
$('#controlContainer').css('background','none');
$('#gameContainer').html('<div id="chart"></div><div id="log"></div>').css('margin-left', '60px');
$('#chart').width('70%');
$('#log').css('background', 'none');
$('#log').css('overflow', 'auto');
$('#log').css('width', '30%');
$('#log').css('height', '97%');
$('#log').css('text-align', 'center');
$('#log').css('float', 'right');
$('#log').css('color', '#fff');
$('#log').css('font-size', '18px');
$('#log').css('border', '1px solid grey');
$('#log').css('border-top-left-radius', '3px');
$('#log').css('border-bottom-left-radius', '3px');
log('BOT has applied!');
document.getElementById('static').hidden = true;
let r = false,
    startbalance = parseFloat($('#balance').val()),
    onBalance = startbalance,
    target = parseFloat($('#target').val()) * startbalance / 100,
    base_betAmount = $('#betAmount').val(),
    betAmount = base_betAmount,
    prediction = 0,
    direction = '',
    chance = 1,
    bet = 0,
    runLog = 0,
    max_betAmount = 0,
    win = 0,
    winStreak = 0,
    maxWinStreak = 0,
    lose = 0,
    loseStreak = 0,
    maxLoseStreak = 0,
    largesBalance = startbalance,
    under_balance = parseFloat($('#under_balance').val()),
    over_balance = 0,
    profit = 0,
    streak = 0,
    time = '0:0:0:0',
    startTime = 0,
    onTime = 0,
    playTime = 0,
    playDay = 0,
    playHour = 0,
    playMinute = 0,
    playSecond = 0;
wagered = 0;
mti = 1;
losebet = 5;
$.getScript('https://canvasjs.com/assets/script/canvasjs.min.js')
    .done(function (script, textStatus) {
        dps = [{
            x: 0,
            y: 0
        }
        ];
        chart = new CanvasJS.Chart('chart', {
            theme: 'dark2',
            zoomEnabled: true,
            title: {
                text: 'Lucky DICE BOT - Multi Chance'
            },
            data: [{
                type: 'line',
                dataPoints: dps,
            }
            ]
        });
        chart.render();
    });
function update_chart(bet, profit, color) {
    dps.push({
        x: bet,
        y: profit,
        color: color
    });
    if (dps[dps.length - 2]) {
        dps[dps.length - 2].lineColor = color;
    }
    if (dps.length > 222) {
        dps.shift();
    }
    chart.render();
}
function viewStatic() {
    document.getElementById('static').hidden = false;
}
function viewLog() {
    document.getElementById('static').hidden = true;
    document.getElementById('log').hidden = false;
}
function log(string) {
    $('<p style="text-align: center; margin: 0px;">' + string + '</p>').appendTo('#log');
}
function startBot() {
    r = true;
    startTime = new Date().getTime();
    if ($('#under_balance').val() === '') {
        under_balance = 0;
    } else {
        under_balance = $('#under_balance').val();
    }
    if ($('#over_balance').val() === '') {
        over_balance = 0;
    } else {
        over_balance = $('#over_balance').val();
    }
    base_betAmount = parseFloat($('#betAmount').val());
    betAmount = base_betAmount;
    startbalance = parseFloat($('#balance').val());
    largesBalance = startbalance;
    target = parseFloat($('#target').val()) * startbalance / 100;
    prediction = 89;
    direction = 'under';
    dobet();
}
function stopBot() {
    r = false;
}

function dobet() {
    if (r === true) {
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
                    bet++;
                    onBalance = parseFloat(a.balance);
                    if(onBalance > largesBalance){
                        largesBalance = onBalance;
                    }
                    onTime = new Date().getTime();
                    playTime = onTime - startTime;
                    playDay= Math.floor(playTime / (1000 * 60 * 60 * 24));
                    playHour = Math.floor((playTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    playMinute = Math.floor((playTime % (1000 * 60 * 60)) / (1000 * 60));
                    playSecond = Math.floor((playTime % (1000 * 60)) / 1000);
                    time = '' + playDay + ':' + playHour + ':' + playMinute + ':' + playSecond + '';
                    speed = parseFloat((bet / playTime) * 1000);
                    profit += parseFloat(a.profit);
                    wagered = parseFloat(wagered) + parseFloat(betAmount);


                    if (gameResult === "win") {
                        win++;
                        winStreak++;
                        loseStreak = 0;
                        color = 'yellow';
                    } else {
                        lose++;
                        loseStreak++;
                        winStreak = 0;
                        color = 'aqua';
                        if (loseStreak == 1){
                            mti = 1;
                            chance = Math.floor(Math.random()*10)+20;
                        }

                        if (loseStreak == 2){
                            mti = 1;
                            chance = Math.floor(Math.random()*9)+1;
                        }

                        if (loseStreak == 3){
                            mti = 1;
                            chance = Math.floor(Math.random()*5)+10;
                        }

                        if (loseStreak == 4){
                            mti = 1;
                            chance = Math.floor(Math.random()*7)+1;
                        }

                        if (loseStreak == 5){
                            mti = 3.5;
                            chance = Math.floor(Math.random()*10)+30;
                        }

                        if (loseStreak == 6){
                            mti = 1.3;
                            chance = Math.floor(Math.random()*10)+25;
                        }

                        if (loseStreak == 7){
                            mti = 0.6;
                            chance = Math.floor(Math.random()*5)+10;
                        }

                        if (loseStreak == 8){
                            mti = 1.2;
                            chance = Math.floor(Math.random()*5)+5;
                        }

                        if (loseStreak == 9){
                            mti = 1.2;
                            chance = Math.floor(Math.random()*5)+10;
                        }

                        if (loseStreak == 10){
                            mti = 3.3;
                            chance = Math.floor(Math.random()*10)+25;
                        }

                        if (loseStreak == 11){
                            mti = 0.6;
                            chance = Math.floor(Math.random()*4)+8;
                        }

                        if (loseStreak == 12){
                            mti = 4.3;
                            chance = Math.floor(Math.random()*10)+35;
                        }

                        if (loseStreak == 13){
                            mti = 1.2;
                            chance = Math.floor(Math.random()*4)+28;
                        }

                        if (loseStreak == 14){
                            mti = 1.7;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 15){
                            mti = 1.1;
                            chance = Math.floor(Math.random()*6)+28;
                        }

                        if (loseStreak == 16){
                            mti = 2.1;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 17){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*2)+30;
                        }

                        if (loseStreak == 18){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*5)+29;
                        }

                        if (loseStreak == 19){
                            mti = 0.5;
                            chance = Math.floor(Math.random()*9)+1;
                        }

                        if (loseStreak == 20){
                            mti = 1.4;
                            chance = Math.floor(Math.random()*5)+5;
                        }

                        if (loseStreak == 21){
                            mti = 1.2;
                            chance = Math.floor(Math.random()*5)+10;
                        }

                        if (loseStreak == 22){
                            mti = 4;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 23){
                            mti = 1.22;
                            chance = Math.floor(Math.random()*5)+25;
                        }

                        if (loseStreak == 24){
                            mti = 1.7;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 25){
                            mti = 1.1;
                            chance = Math.floor(Math.random()*7)+28;
                        }

                        if (loseStreak == 26){
                            mti = 2.1;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 27){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*3)+27;
                        }

                        if (loseStreak == 28){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*5)+29;
                        }

                        if (loseStreak == 29){
                            mti = 0.5;
                            chance = Math.floor(Math.random()*7)+1;
                        }

                        if (loseStreak == 30){
                            mti = 1.4;
                            chance = Math.floor(Math.random()*5)+5;
                        }

                        if (loseStreak == 31){
                            mti = 1.2;
                            chance = Math.floor(Math.random()*5)+10;
                        }

                        if (loseStreak == 32){
                            mti = 4;
                            chance = Math.floor(Math.random()*4)+31;
                        }

                        if (loseStreak == 33){
                            mti = 1.22;
                            chance = Math.floor(Math.random()*3)+27;
                        }

                        if (loseStreak == 34){
                            mti = 1.7;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 35){
                            mti = 1.1;
                            chance = Math.floor(Math.random()*6)+28;
                        }

                        if (loseStreak == 36){
                            mti = 2.1;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 37){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*2)+30;
                        }

                        if (loseStreak == 38){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 39){
                            mti = 0.5;
                            chance = Math.floor(Math.random()*9)+1;
                        }

                        if (loseStreak == 40){
                            mti = 1.4;
                            chance = Math.floor(Math.random()*9)+1;
                        }

                        if (loseStreak == 41){
                            mti = 1.2;
                            chance = Math.floor(Math.random()*5)+10;
                        }

                        if (loseStreak == 42){
                            mti = 4;
                            chance = Math.floor(Math.random()*3)+33;
                        }

                        if (loseStreak == 43){
                            mti = 1.22;
                            chance = Math.floor(Math.random()*3)+27;
                        }

                        if (loseStreak == 44){
                            mti = 1.7;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 45){
                            mti = 1.1;
                            chance = Math.floor(Math.random()*6)+28;
                        }

                        if (loseStreak == 46){
                            mti = 2.1;
                            chance = Math.floor(Math.random()*5)+30;
                        }

                        if (loseStreak == 47){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*2)+30;
                        }

                        if (loseStreak == 48){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*5)+29;
                        }

                        if (loseStreak == 49){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*5)+29;
                        }

                        if (loseStreak == 50){
                            mti = 1.65;
                            chance = Math.floor(Math.random()*5)+29;
                        }

                        if (loseStreak != 0 && loseStreak > 50){
                            mti = 1.55;
                            chance = Math.floor(Math.random()*10)+30;
                        }
                    }
                    direction = (Math.floor(Math.random() * 100) + 1) % 2===0 ? 'over' : 'under';

                    if (direction == 'under'){
                        prediction = chance;
                    } else if (direction == 'over'){
                        prediction = 99 - chance;
                    }


                    betAmount >= max_betAmount ? max_betAmount = betAmount : max_betAmount = max_betAmount;
                    winStreak >= maxWinStreak ? maxWinStreak = winStreak : maxWinStreak = maxWinStreak;
                    loseStreak >= maxLoseStreak ? maxLoseStreak = loseStreak : maxLoseStreak = maxLoseStreak;
                    runLog++;
                    if (runLog > 15) {
                        runLog = 0;
                        $('#log p').remove();
                    }
                    log('<font style="color: ' + color + ';">' + betAmount.toFixed(8) + '-' + direction + '-' + prediction + '->' + a.resultNumber + '-' + a.gameResult + '-' + parseFloat(a.profit).toFixed(8) + '</font>');
                    $('#log').stop().animate({ scrollTop: $('#log')[0].scrollHeight });


                    if (betAmount >= onBalance) {
                        log("Lose");
                    } else if (over_balance != 0 && onBalance >= over_balance) {
                        log("Over balance");
                    } else if (under_balance != 0 && onBalance <= under_balance) {
                        log("Under balance");
                    } else {
                        if (gameResult === "win") {
                            betAmount = base_betAmount ;
                            chance = Math.floor(Math.random()*40)+1;
                        } else {
                            betAmount *= mti;
                        }
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
                    $('#max_betAmount').html(max_betAmount.toFixed(8));
                    $('#profit').html(profit.toFixed(8));
                    $('#wagered').html(wagered.toFixed(8));
                    $('#largesBalance').html(largesBalance.toFixed(8));
                    update_chart(bet, profit, color);
                    if(profit >= target){
                        stopBot();
                    }
                    if(onBalance <= under_balance){
                        log("Under balance");
                        stopBot();
                    }
                    dobet();
                } else {
                    // setInterval(dobet(), 1);
                    dobet();
                }
            }
        });
    } else {
        log("BOT IS STOPPED !!!");
        return;
    }
}

$('.online').html('<button id="tagchatbtn" onclick="tag();">GET TAG</button>');


function tag (){
    $('.icon.quote').click();
}