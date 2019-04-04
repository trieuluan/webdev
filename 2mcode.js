var check = true;
var chart = null;
var chartPie = null;
var dps = [];
var dpsPie = [];
var flagChange = false;
var flagGo = false;
var firstTimePlay = 0;
var flagNormal = true;
var rollGo = 0;
var langodau = 10;
function randomNumberFromRange(min,max)
{
    var rdChange = parseFloat(Math.random()*(max-min)+min).toFixed(2);
    if(rdChange == 0){
        return randomNumberFromRange(min, max);
    }else{
        return rdChange;
    }
}
var GameCondition = {
    change: randomNumberFromRange(5, 40),
    hi: {},
    low: {},
    basebet: 0.00000500,
    defaultBasebet: 0,
    phantraman: 100,
    condition: '',
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
    defaultResetSeeds: 100000,
    opportunityChange: [],
    goChange: [],
    backprice: 5,
    deplay: 0,
    currentBet: 0,
    nextBet: 0,
    maxBet: 0,
    largeBaseBet: 10,
    stopbet: 0,
    runStopBet: false,
    rollforreset: 0,
    runCountTime: null,
    currentBalance: 0,
    largeBalance: 0,
    changeInLose: {
        default: {min: 5, max: 20},
        start: {min: 0.05, max: 1},
        go: {min: 10, max: 66}
    },
    change_seeds: function() {
        var self = this;
        $(".alert").hide();
        $("#btn-change-seeds").button('loading');
        $("#seed-client-new").removeClass("error");

        var seed_client_new = $.trim($("#seed-client-new").val());
        var token = $.trim($("#change-seed-token").val());

        if (seed_client_new != "") {
            $.ajax({
                type: "POST",
                url: "/api/change-seeds",
                data: {
                    "seed_client"		:	seed_client_new,
                    "token"				:	token
                },
                success: function(text) {
                    var val = JSON.parse(text);
                    if (val.return.success == "true") {
                        var seed_server_hashed = val.return.seed_server_hashed;
                        var seed_client = val.return.seed_client;

                        $("#seed-server-hashed-current").html(seed_server_hashed);
                        $("#seed-client-current").html(seed_client);
                        $("#hidden-seed-server-hashed").val(seed_server_hashed);
                        $("#hidden-seed-client").val(seed_client);

                        if (val.return.last_seeds_revealed != "none") {
                            var nonce = val.return.last_seeds_revealed.nonce;
                            var seed_server_revealed = val.return.last_seeds_revealed.seed_server_revealed;
                            var seed_server = val.return.last_seeds_revealed.seed_server;
                            var seed_client = val.return.last_seeds_revealed.seed_client;

                            $("#last_seed_server_hashed").html(seed_server);
                            $("#last_seed_server_revealed").html(seed_server_revealed);
                            $("#last_seed_client").html(seed_client);
                            $("#last_nonce").html(nonce);

                            $("#div-last-seeds-revealed").show();
                        }

                        showSuccessNotification("Success", "Your seeds has been updated");
                        $("#modal-provably-fair").modal("hide");
                    }
                    else {
                        $("#error-modal-provably-fair").html(val.return.value);
                        $("#div-error-modal-provably-fair").show();
                    }

                    $("#btn-change-seeds").button('reset');
                },
                error:		function (xhr, ajaxOptions, thrownError)		{errorRequestAbort();$("#modal-provably-fair").modal("hide");},
                timeout:	function (xhr, ajaxOptions, thrownError)		{errorRequestAbort();$("#modal-provably-fair").modal("hide");},
                abort:		function (xhr, ajaxOptions, thrownError)		{errorRequestAbort();$("#modal-provably-fair").modal("hide");}
            });
        }
        else {
            $("#seed-client-new").addClass("error");

            $("#error-modal-provably-fair").html("Your seed client is empty");
            $("#div-error-modal-provably-fair").show();
            $("#btn-change-seeds").button('reset');
        }
    },
    init: function () {
        var self = this;
        this.createTool();
        modal_provably_fair();
        setTimeout(function () {
            self.change_seeds();
        }, 3000);
        self.createChange();
        self.updateChange();
        $('.game__left__content').on('click', '#btn-start-bot', function () {
            self.basebet = parseFloat($('#amount').val());
            self.backprice = parseFloat($('#backprice').val());
            self.deplay = $('#deplay').val() || 0;
            self.stopbet = parseFloat($('#stoproll').val() || 0);
            self.largeBaseBet = parseFloat($('#largetBet').val() || 0);
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
            alert('bot stop');
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
    getOpportunityChange: function () {
        var self = this;
        var infobet = {
            change: 0,
            defaultHi: true,
            onlose: 0
        };
        var phantram = 0;
        self.opportunityChange.forEach(function (item) {
            ['hi', 'low'].forEach(function (condition) {
                if(item[condition].tilethang > phantram){
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
                // if (item[condition].tilethang > 70){
                //     phantram = item[condition].tilethang;
                //     infobet.change = item[condition].change;
                //     infobet.defaultHi = item[condition].defaultHi;
                //     infobet.onlose = item[condition].onlose;
                //     infobet.tilethang = item[condition].tilethang;
                // }else if((item[condition].tilethang >= 65 && item[condition].tilethang <= 70)){
                //     phantram = item[condition].tilethang;
                //     infobet.change = item[condition].change;
                //     infobet.defaultHi = item[condition].defaultHi;
                //     infobet.onlose = item[condition].onlose;
                //     infobet.tilethang = item[condition].tilethang;
                // }else if((item[condition].tilethang >= 45 && item[condition].tilethang <= 55)){
                //     phantram = item[condition].tilethang;
                //     infobet.change = item[condition].change;
                //     infobet.defaultHi = item[condition].defaultHi;
                //     infobet.onlose = item[condition].onlose;
                //     infobet.tilethang = item[condition].tilethang;
                // }else if ((item[condition].tilethang >= 25 && item[condition].tilethang <= 35)){
                //     phantram = item[condition].tilethang;
                //     infobet.change = item[condition].change;
                //     infobet.defaultHi = item[condition].defaultHi;
                //     infobet.onlose = item[condition].onlose;
                //     infobet.tilethang = item[condition].tilethang;
                // }else
                if ((item[condition].tilethang >= 10 && item[condition].tilethang <= 20)){
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
    },
    workingChange: function (roll_number) {
        var self = this;
        if(roll_number){
            self.updateTiLeThang(roll_number);
        }
        var smartChange = self.getOpportunityChange();
        var gochange = self.getGoChange();
        if((gochange.tilethang >= 5 && self.banalanceLose > 0)){
            self.change = gochange.change;
            var getPayout = self.returnPayoutVal(self.change);
            self.basebet = parseFloat(self.basebet);
            self.defaultHi = gochange.defaultHi;
            // if(self.banalanceLose < self.defaultBasebet){
            //     self.basebet = parseFloat(self.banalanceLose / (getPayout - 1));
            // }else if (gochange.tilethang >= 65 && gochange.tilethang <= 70){
            //     self.basebet = parseFloat((self.banalanceLose / 7) / (getPayout - 1));
            // }else if (gochange.tilethang >= 45 && gochange.tilethang <= 50){
            //     self.basebet = parseFloat((self.banalanceLose / 6) / (getPayout - 1));
            // }else if (gochange.tilethang >= 25 && gochange.tilethang <= 30){
            //     self.basebet = parseFloat((self.banalanceLose / 5) / (getPayout - 1));
            // }else
            if (gochange.tilethang >= 10 && gochange.tilethang <= 20){
                self.basebet = parseFloat((self.banalanceLose / langodau) / (getPayout - 1));
                if(langodau > 1)
                    langodau--;
            }else {
                self.change = randomNumberFromRange(self.changeInLose.default.min, self.changeInLose.default.max);
                self.basebet = self.defaultBasebet;
                if((Math.floor(Math.random() * 100) + 1) % 2){
                    self.defaultHi = true;
                }else{
                    self.defaultHi = false;
                }
            }
            flagGo = true;
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
        this.hi.condition = '>';
        this.low.condition = '<';
        if(this.defaultHi){
            this.condition = this.hi.condition;
            this.game = this.hi.game;
            this.lostTang = this.hi.loseTang;
        }else{
            this.condition = this.low.condition;
            this.game = this.low.game;
            this.lostTang = this.low.loseTang;
        }
    },
    createTool: function () {
        $('.game__left__menu').remove();
        var targetOptions = $('.row__game.text-semibold').next().next().find('.row__game__options');
        var fatherOptions = targetOptions.clone();
        fatherOptions.empty();
        var block1 = $('<div/>', {class: 'row__game__options__block border__right'}).append('<div class="title">Target to stop</div>');
        block1.append($('<div/>', {class: 'row__game__options__pie game__options__pie__1'}).append('<input type="text" id="target" value="'+GameCondition.target+'" />'));
        var block2 = $('<div/>', {class: 'row__game__options__block border__right'}).append('<div class="title">Deplay time (millisecond vd: 1 giây = 1000 miligiây)</div>');
        block2.append($('<div/>', {class: 'row__game__options__pie game__options__pie__2'}).append('<input type="text" id="deplay" value="'+GameCondition.deplay+'" />'));
        var block3 = $('<div/>', {class: 'row__game__options__block border__right'}).append('<div class="title">How many roll to reset seeds?</div>');
        block3.append($('<div/>', {class: 'row__game__options__pie game__options__pie__3'}).append('<input type="text" id="reset" value="'+GameCondition.defaultResetSeeds+'" />'));
        var block4 = $('<div/>', {class: 'row__game__options__block border__right', style: 'flex: 0 0 '+100/3+'%;'}).append('<div class="title">How many roll you want to get price back (Recommend 50 - 100)</div>');
        block4.append($('<div/>', {class: 'row__game__options__pie game__options__pie__4'}).append('<input type="text" style="text-align: center;" id="backprice" value="'+GameCondition.backprice+'" />'));
        var block5 = $('<div/>', {class: 'row__game__options__block border__right', style: 'flex: 0 0 '+100/3+'%;'}).append('<div class="title">large base bet %</div>');
        block5.append($('<div/>', {class: 'row__game__options__pie game__options__pie__5'}).append('<input type="text" style="text-align: center;" id="largetBet" value="'+GameCondition.largeBaseBet+'" />'));
        var block6 = $('<div/>', {class: 'row__game__options__block border__right', style: 'flex: 0 0 '+100/3+'%;'}).append('<div class="title">Stop roll</div>');
        block6.append($('<div/>', {class: 'row__game__options__pie game__options__pie__6'}).append('<input type="text" style="text-align: center;" id="stoproll" value="'+GameCondition.stopbet+'" />'));
        fatherOptions.css('flex-wrap', 'wrap');
        fatherOptions.append(block1).append(block2).append(block3).append(block4).append(block5).append(block6);
        targetOptions.closest('.row__game').after($('<div/>', {class: 'row__game'}).append(fatherOptions));
        var buttonStart = $('#btn-bet-dice').clone();
        $('#btn-bet-dice').remove();
        var buttonStop = buttonStart.clone();
        var buttonClear = buttonStart.clone();
        var buttonShowChart = buttonStart.clone();
        buttonStart.attr('id', 'btn-start-bot').text('Start bot').css('width', 'calc(100% / 3)').css('background', '#87be4d');
        buttonStop.attr('id', 'btn-stop-bot').text('Stop bot').css('width', 'calc(100% / 3)').css('background', '#f76c51');
        buttonClear.attr('id', 'btn-clear-bot').text('Clear bot').css('width', 'calc(100% / 3)');
        buttonShowChart.attr('id', 'btn-show-chart').text('Show chart').css('background', '#e7ebee').css('color', 'black');
        $('.game__left__content').append(buttonStart).append(buttonStop).append(buttonClear).append(buttonShowChart);
        $('.dice__stats__menu').find('[data-type="overall"]').remove();
        $(".options__stats").trigger('click');
        var div50 = $('<div/>', {style: 'width:50%;margin-right:2px'});
        var divflex = $('<div/>', {style: 'display:flex;width:100%;margin-top:10px'});

        var div50won = (div50.clone()).append('<h5>Current win</h5>');
        div50won.append($('<div/>', {id: 'current-win', class: 'stats__div__infos', text: 0}));

        var div50lose = (div50.clone()).append('<h5>Current lose</h5>');
        div50lose.append($('<div/>', {id: 'current-lose', class: 'stats__div__infos', text: 0}));

        var div50maxWon = (div50.clone()).append('<h5>Max win</h5>');
        div50maxWon.append($('<div/>', {id: 'current-max-win', class: 'stats__div__infos', text: 0}));

        var div50maxLose = (div50.clone()).append('<h5>Max lose</h5>');
        div50maxLose.append($('<div/>', {id: 'current-max-lose', class: 'stats__div__infos', text: 0}));

        var flex1 = divflex.clone();
        var flex2 = divflex.clone();

        flex1.attr('id', 'flexrow1').append(div50won).append(div50lose);
        flex2.attr('id', 'flexrow2').append(div50maxWon).append(div50maxLose);


        if($('#flexrow1').length == 0 && $('#flexrow2').length == 0){
            $('.dice__stats__current').append(flex1).append(flex2);
        }

        $('.dice__stats').height(430);
        $('.dice__stats__content').height(350);
    },
    play: function () {
        if(check){
            var self = GameCondition;
            check = false;
            $.ajax({
                type: "POST",
                url: server_front_name + "/api/bet",
                cache: false,
                data: {
                    access_token: access_token,
                    username: user_username,
                    type: "dice",
                    amount: self.basebet,
                    condition: self.condition,
                    game: self.game,
                    devise: devise
                },
                success: function (text) {
                    check = true;
                    var val = JSON.parse(text);
                    if (val.return.success == 'true') {
                        var username = val.return.username;
                        var id = val.return.id;
                        var type = val.return.type;
                        var devise = val.return.devise;
                        var ts = val.return.ts;
                        var time = val.return.time;
                        var winning_chance = val.return.winning_chance;
                        var roll_number = val.return.roll_number;
                        var amount_return = val.return.amount_return;
                        var new_balance = val.return.new_balance;
                        var show = val.return.show;
                        var amount = val.return.amount;
                        var condition = val.return.condition;
                        var game = val.return.game;
                        var payout = val.return.payout;

                        $("#balance-" + devise).val(round_float(new_balance, 12));
                        $(".balance-" + devise + "-html").html(round_float(new_balance, 8));

                        if (amount_return >= 0)
                            var roll_history = '<div class="last__results__block green" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\'' + id + '\'); return false;">' + parseFloat(roll_number).toFixed(2) + '</div>';
                        else
                            var roll_history = '<div class="last__results__block red" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\'' + id + '\'); return false;">' + parseFloat(roll_number).toFixed(2) + '</div>';

                        $(".last__results__content").prepend(roll_history);

                        $('.last__results__content div:first').animate({'marginLeft': '5px'}, 100, function () {
                            var number_elements = $(".last__results__content div").size();
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

                        self.totalBet++;
                        self.rollforreset++;
                        self.currentBalance = new_balance;
                        if(self.currentBalance > self.largeBalance){
                            self.largeBalance = self.currentBalance;
                        }
                        self.profit = (parseFloat(self.profit) + parseFloat(amount_return)).toFixed(8);
                        if (amount_return >= 0) {
                            self.win++;
                            if (self.win >= self.maxWin) {
                                self.maxWin = self.win;
                            }
                            self.currentBet = self.basebet;
                            // self.defaultHi = !self.defaultHi;
                            self.basebet = self.defaultBasebet;
                            $('#amount').val(parseFloat(self.basebet).toFixed(8));
                            if(self.banalanceLose > 0 && !flagChange && !flagNormal){
                                self.banalanceLose -= parseFloat(amount_return);
                            }
                            if(flagGo){
                               langodau = 10;
                            }

                            if(self.banalanceLose < 0){
                                self.banalanceLose = 0;
                            }
                            if(self.banalanceLose <= 0 || flagChange || flagNormal || flagGo){
                                self.lose = 0;
                                flagGo = false;
                            }
                            self.defaultHi = true;
                            if(self.rollforreset >= self.defaultResetSeeds){
                                $('#btn-stop-bot').trigger('click');
                                self.rollforreset = 0;
                                modal_provably_fair();
                                setTimeout(function () {
                                    self.change_seeds();
                                    $('#btn-start-bot').trigger('click');
                                    self.resetTileThang();
                                }, 3000);
                            }
                            updateChart(self.totalBet, self.profit, 'win');
                        } else {
                            self.lose++;
                            self.win = 0;
                            if (self.lose >= self.maxLose) {
                                self.maxLose = self.lose;
                            }
                            if(!flagChange){
                                self.banalanceLose += parseFloat(self.basebet);
                            }
                            self.currentBet = self.basebet;
                            // self.basebet = parseFloat(self.basebet + self.basebet * self.lostTang / 100).toFixed(8);
                            $('#amount').val(parseFloat(self.basebet).toFixed(8));
                            updateChart(self.totalBet, self.profit, 'lose');
                        }

                        $('#current-win').html(self.win);
                        $('#current-lose').html(self.lose);

                        $('#current-max-win').html(self.maxWin);
                        $('#current-max-lose').html(self.maxLose);

                        if(self.profit >= self.target){
                            $('#btn-stop-bot').trigger('click');
                            self.profit = 0;
                        }
                        updateThongtin();
                        self.updateChange(roll_number);
                        self.nextBet = self.basebet;
                        if(self.basebet > self.maxBet){
                            self.maxBet = self.basebet;
                        }
                        if(!self.runStopBet){
                            if(self.basebet / self.largeBalance * 100 > self.largeBaseBet){
                                self.runStopBet = true;
                                self.stopbet = self.totalBet + self.stopbet;
                            }
                        }else{
                            if(self.totalBet >= self.stopbet){
                                $('#btn-stop-bot').trigger('click');
                                self.runStopBet = false;
                            }
                        }
                    }else{
                        clearInterval(self.auto);
                        clearInterval(self.runCountTime);
                        self.runCountTime = null;
                        alert('Không đủ balance');
                    }
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
var totalSeconds = 0;
function updateFunctionTrigger(){
    $('#basebettool').on('keyup input change', function(){
        $('#amount').val($(this).val());
    });
    $('#targettool').on('keyup input change', function(){
        $('#target').val($(this).val());
    });
    $('#deplaytool').on('keyup input change', function(){
        $('#deplay').val($(this).val());
    });
    $('#changeseedstool').on('keyup input change', function(){
        $('#reset').val($(this).val());
    });
    $('#getpricebacktool').on('keyup input change', function(){
        $('#backprice').val($(this).val());
    });
    $('#amount').on('keyup input change', function(){
        $('#basebettool').val($(this).val());
    });
    $('#target').on('keyup input change', function(){
        $('#targettool').val($(this).val());
    });
    $('#deplay').on('keyup input change', function(){
        $('#deplaytool').val($(this).val());
    });
    $('#reset').on('keyup input change', function(){
        $('#changeseedstool').val($(this).val());
    });
    $('#backprice').on('keyup input change', function(){
        $('#getpricebacktool').val($(this).val());
    });
}
function updateThongtin(){
    $('.getCurrentblc').html(parseFloat($('#balance-'+devise).val()).toFixed(8));
    $('.getCurrentProfit').html(GameCondition.profit);
    $('.getCurrentbet').html(GameCondition.currentBet.toFixed(8));
    $('.getNextbet').html(GameCondition.nextBet.toFixed(8));
    $('.getMaxbet').html(GameCondition.maxBet.toFixed(8));
    $('.tile').html(JSON.stringify(GameCondition.getOpportunityChange()));
    $('.tilego').html(JSON.stringify(GameCondition.getGoChange()));
    if(GameCondition.runCountTime === null){
        GameCondition.runCountTime = setInterval(countimer, 1000);
    }
    $('.getSpeeds').html((GameCondition.totalBet / totalSeconds).toFixed(2)+'/s');
    $('.getWin').html(GameCondition.win);
    $('.getWinMax').html(GameCondition.maxWin);
    $('.getLose').html(GameCondition.lose);
    $('.getLoseMax').html(GameCondition.maxLose);
}
var lengthChart = 1000;
function updateChart(x, y, type){
    y = parseFloat(y);
    if(type === 'win'){
        var color = '#00695C';
    }else{
        var color = '#FF1744';
    }
    dps.push({
        x: x,
        y: y,
        color: color
    });
    if(dps[dps.length - 2]){
        dps[dps.length - 2].lineColor = color;
    }
    if (dps.length > lengthChart) {
        dps.shift();
    }
    chart.render();
}
$.getScript('https://canvasjs.com/assets/script/jquery.canvasjs.min.js', function(){
    GameCondition.init();
    var createFullChart = $('<div/>', {id: 'full-site', class: 'game__container', style: 'position: fixed;top: 0; right: 0;bottom: 0;left: 0;background: white;z-index: 1060;'});
    var divAllChart = $('<div/>', {id: 'allChart', style: 'width:70%;float:left;height: 100%'});
    var chartDiv = $('<div/>', {id: 'chartContainer', style: 'width: 100%;height: 100%;float:left;'});
    var divInfo = $('<div/>', {id: 'infoContainer', class: 'game__left', style: 'width: 30%;height: 100%;float:left;overflow: auto;'});
    var divGameLeft = $('<div/>', {class: 'game__left__content'}).css('box-shadow', 'none');
    var inputHideShow = $('<button/>', {'data-toggle': 'tooltip', 'data-placement': 'bottom', 'data-original-title': 'Click to hide Chart'}).html($('<i/>', {class: 'fa fa-toggle-on fa-2x', style: 'color: green;'})).css({position: 'absolute', right: '30%', top :0, border:0, background: 'none'}).tooltip();
    divInfo.css({
        border: '1px solid silver'
    });
    var defaultCss = {width: '100%', float: 'left'};
    var label = $('<label/>').css(defaultCss);
    var divInput = $('<div/>').css(defaultCss);
    var p = $('<p/>', {style: 'display: inline-block; width: 100%;font-size: 16px;'});

    var groupBasebet = divInput.clone();
    var groupTarget = divInput.clone();
    var groupDeplayTime = divInput.clone();
    var groupRollChangeSeeds = divInput.clone();
    var groupRollGetPriceBack = divInput.clone();

    var inputBasebet = $('<input/>', {type: 'text', id: 'basebettool'}).css(defaultCss).val($('#amount').val());
    var inputTarget = $('<input/>', {type: 'text', id: 'targettool', value: GameCondition.target}).css(defaultCss);
    var inputDeplayTime = $('<input/>', {type: 'text', id: 'deplaytool', value: GameCondition.deplay}).css(defaultCss);
    var inputRollChangeSeeds = $('<input/>', {type: 'text', id: 'changeseedstool', value: GameCondition.defaultResetSeeds}).css(defaultCss);
    var inputRollGetPriceBack = $('<input/>', {type: 'text', id: 'getpricebacktool', value: GameCondition.backprice}).css(defaultCss);

    var startBot = $('<button/>', {class: 'btn btn__roll manual_rolling', id: 'triggler-start-bot', type: 'button', text: 'Start Bot'}).css('width', 'calc(100% / 3)').css('background', 'rgb(135, 190, 77)');
    var stopBot = $('<button/>', {class: 'btn btn__roll manual_rolling', id: 'triggler-stop-bot', type: 'button', text: 'Stop Bot'}).css('width', 'calc(100% / 3)').css('background', 'rgb(247, 108, 81)');
    var clearBot = $('<button/>', {class: 'btn btn__roll manual_rolling', id: 'triggler-clear-bot', type: 'button', text: 'Clear Bot'}).css('width', 'calc(100% / 3)');
    startBot.click(function(){
        $('#btn-start-bot').trigger('click');
    });
    stopBot.click(function(){
        $('#btn-stop-bot').trigger('click');
    });
    clearBot.click(function(){
        $('#btn-clear-bot').trigger('click');
    });

    var balance = p.clone().html('Balance: <span class="getCurrentblc" style="text-align: right;font-weight:bold;">'+parseFloat($('#balance-'+devise).val()).toFixed(8)+'</span>');
    var profitDiv = p.clone().html('Profit: <span class="getCurrentProfit" style="text-align: right;font-weight:bold;">'+GameCondition.profit+'</span>');
    var currentBet = p.clone().html('Current bet: <span class="getCurrentbet" style="text-align: right;font-weight:bold;">'+GameCondition.currentBet.toFixed(8)+'</span>');
    var nextBet = p.clone().html('Next bet: <span class="getNextbet" style="text-align: right;font-weight:bold;">'+GameCondition.nextBet.toFixed(8)+'</span>');
    var maxBet = p.clone().html('Max bet: <span class="getMaxbet" style="text-align: right;font-weight:bold;">'+GameCondition.maxBet.toFixed(8)+'</span>');
    var changeCao = p.clone().html('Change tỉ lệ: <span class="tile" style="text-align: right;font-weight:bold;">'+JSON.stringify(GameCondition.getOpportunityChange())+'</span>');
    var changeGo = p.clone().html('Change Gỡ: <span class="tilego" style="text-align: right;font-weight:bold;">'+JSON.stringify(GameCondition.getGoChange())+'</span>');

    var timeBet = p.clone().html('Time: <span class="getTimebet" style="text-align: right;font-weight:bold;">0</span>');
    var speeds = p.clone().html('Speeds: <span class="getSpeeds" style="text-align: right;font-weight:bold;">'+(GameCondition.totalBet / totalSeconds).toFixed(2)+'/s</span>');
    var winT = p.clone().html('Win: <span class="getWin" style="text-align: right;font-weight:bold;">'+GameCondition.win+'</span>').css('width', '50%');
    var winTM = p.clone().html('Max Win: <span class="getWinMax" style="text-align: right;font-weight:bold;">'+GameCondition.maxWin+'</span>').css('width', '50%');
    var loseT = p.clone().html('Lose: <span class="getLose" style="text-align: right;font-weight:bold;">'+GameCondition.lose+'</span>').css('width', '50%');
    var loseTM = p.clone().html('Max Lose: <span class="getLoseMax" style="text-align: right;font-weight:bold;">'+GameCondition.maxLose+'</span>').css('width', '50%');
    var nameCoin = p.clone().html('Name coin: '+$('option[value="'+devise+'"]').html());
    var codeName = p.clone().html('Code name: Play with big payout');
    var codeBy = p.clone().html('<i style="font-weight: bold;">Code by Luân - Bot version 2.0</i>');
    var groupFb = p.clone().html('<i style="font-weight: bold;">FaceBook Group: <a href="https://goo.gl/pye9Xo" target="_blank">https://goo.gl/pye9Xo</a></i>');

    groupBasebet.append(label.clone().html('Basebet')).append(inputBasebet);
    groupTarget.append(label.clone().html('Target')).append(inputTarget);
    groupDeplayTime.append(label.clone().html('Deplay(milisecond)')).append(inputDeplayTime);
    groupRollChangeSeeds.append(label.clone().html('Roll change seeds')).append(inputRollChangeSeeds);
    groupRollGetPriceBack.append(label.clone().html('Roll get price back (Recommed 50 - 100)')).append(inputRollGetPriceBack);

    divGameLeft.append(groupBasebet)
        .append(groupTarget).append(groupDeplayTime).append(groupRollChangeSeeds)
        .append(groupRollGetPriceBack).append(startBot).append(stopBot).append(clearBot).append('<br/><br/>');
    divGameLeft.append([
        balance, profitDiv, currentBet, nextBet, maxBet, changeCao, changeGo, '<p>--------</p>',
        timeBet, speeds, winT, winTM, loseT, loseTM, nameCoin,
        codeName, codeBy, groupFb
    ]);
    divInfo.append(divGameLeft);
    inputHideShow.click(function(){
        $('#full-site').hide();
        $('body').attr('style', '');
    });
    divAllChart.append(chartDiv);
    createFullChart.append(divAllChart).append(divInfo).append(inputHideShow);
    $('body').append(createFullChart);
    chart = new CanvasJS.Chart("chartContainer", {
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
            dataPoints: dps,
            animationEnabled: true,
            animationDuration: 2000
        }],
    });
    chart.render();
    updateFunctionTrigger();
    createFullChart.hide();
});
function countimer(){
    ++totalSeconds;
    var hour = Math.floor(totalSeconds /3600);
    hour = hour.toString().length >= 2 ? hour : '0'+hour;
    var minute = Math.floor((totalSeconds - hour*3600)/60);
    minute = minute.toString().length >= 2 ? minute : '0'+minute;
    var seconds = totalSeconds - (hour*3600 + minute*60);
    seconds = seconds.toString().length >= 2 ? seconds : '0'+seconds;
    $('.getTimebet').html(hour+':'+minute+':'+seconds);
}