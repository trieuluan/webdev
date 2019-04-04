var invalAuto = null;
function play() {

    if (game_in_progress == true) {
        $("#btn-bet-dice, #btn-bet-start-pilot-dice").button("reset");
        return false;
    }

    game_in_progress = false;

    if (autobet_mode == false) {
        var amount = $("#amount").val();
        var game = $("#game").val();
        var condition = $("#condition").val();
    }
    else {
        var amount = auto_amount;
        var condition = auto_condition;
        var game = auto_game;
    }

    amount = round_float(amount, devise_decimal);

    $.ajax({
        type: "POST",
        url: "/api/bet",
        data: {
            access_token	:	access_token,
            username		:	user_username,
            type			:	"dice",
            amount			:	amount,
            condition		:	condition,
            game			:	game,
            devise			:	devise
        },
        success: function(text) {
            var val = JSON.parse(text);
            if (val.return.success == 'true') {
                bet_nb_errors = 0;

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

                $("#balance-"+devise).val(round_float(new_balance, 12));
                $(".b__text").html(round_float(new_balance, 8));
                $("#currency-menu-top-"+devise+"-content").html(round_float(new_balance, 8));

                if (amount_return >= 0)
                    var roll_history = '<div class="last__results__block green" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\''+id+'\'); return false;">'+parseFloat(roll_number).toFixed(2)+'</div>';
                else
                    var roll_history = '<div class="last__results__block red" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\''+id+'\'); return false;">'+parseFloat(roll_number).toFixed(2)+'</div>';

                $(".last__results__content").prepend(roll_history);

                $('.last__results__content div:first').animate({ 'marginLeft': '5px' }, 100, function() {
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

                    var chanceCalcul = (100/(parseFloat(winning_chance))*100);
                    datas_overall_session.lucky_total = parseFloat(datas_overall_session.lucky_total)+parseFloat(chanceCalcul);
                    datas_current_session.lucky_total = parseFloat(datas_current_session.lucky_total)+parseFloat(chanceCalcul);
                }
                else {
                    datas_overall_session.number_bets_losses++;
                    datas_current_session.number_bets_losses++;
                }

                datas_overall_session.lucky = (parseFloat(datas_overall_session.lucky_total/datas_overall_session.number_bets)).toFixed(2);
                datas_current_session.lucky = (parseFloat(datas_current_session.lucky_total/datas_current_session.number_bets)).toFixed(2);

                datas_overall_session.wagered = (parseFloat(datas_overall_session.wagered)+parseFloat(amount)).toFixed(8);
                datas_current_session.wagered = (parseFloat(datas_current_session.wagered)+parseFloat(amount)).toFixed(8);

                datas_overall_session.profit = (parseFloat(datas_overall_session.profit)+parseFloat(amount_return)).toFixed(8);
                datas_current_session.profit = (parseFloat(datas_current_session.profit)+parseFloat(amount_return)).toFixed(8);

                $("#overall-bets-number").html(number_format(datas_detailled.number_bets));
                $("#overall-wagered").html(datas_detailled.wagered);
                $("#overall-profit").html(datas_detailled.profit);
                $("#overall-bets-wins").html(number_format(datas_detailled.number_bets_wins));
                $("#overall-bets-losses").html(number_format(datas_detailled.number_bets_losses));
                $("#overall-lucky").html(datas_detailled.lucky+"%");

                $("#current-bets-number").html(number_format(datas_current_session.number_bets));
                $("#current-wagered").html(datas_current_session.wagered);
                $("#current-profit").html(datas_current_session.profit);
                $("#current-bets-wins").html(number_format(datas_current_session.number_bets_wins));
                $("#current-bets-losses").html(number_format(datas_current_session.number_bets_losses));
                $("#current-lucky").html(datas_current_session.lucky+"%");

                var notifications = val.return.notifications;
                for (var prop in notifications) {
                    if (notifications[prop].name == "rcvJackpotDice")
                        rcvJackpotDice(notifications[prop]);
                    else {
                        rcvnotificationbet(notifications[prop]);
                    }
                }

                // $("#result__bet").removeClass("green red");
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

                var time_delay = getTimeDelay("dice", devise, amount, winning_chance);

                if (autobet_mode == false) {
                    setTimeout(function() {
                        $("#btn-bet-dice, #btn-bet-start-pilot-dice").button("reset");
                    }, time_delay);
                }
                else {
                    number_bet_done++;

                    if (unlimited_bet == false) {
                        number_rolls--;
                        $("#limit__rolls__input").val(number_rolls);
                    }

                    if (on_win == "id-bet-win" && amount_return >= 0) {
                        auto_amount = parseFloat(auto_amount)+parseFloat(auto_amount*(pourc_on_win/100));
                    }
                    else if (amount_return >= 0) {
                        auto_amount = auto_amount_var;
                    }

                    if (on_lose == "id-bet-lose" && amount_return < 0) {
                        auto_amount = parseFloat(auto_amount)+parseFloat(auto_amount*(pourc_on_lose/100));
                    }
                    else if (amount_return < 0) {
                        auto_amount = auto_amount_var;
                    }

                    var tmp = Math.pow(10, 8);
                    auto_amount = Math.round(auto_amount*tmp)/tmp;

                    if ((number_bet_done < number_rolls_total) || unlimited_bet == true) {
                        var speed_bet_val = $("#speed-bet").val();
                        if (speed_bet_val == 20)
                            var time_by_bet = parseInt(time_delay*15);
                        else if (speed_bet_val == 40)
                            var time_by_bet = parseInt(time_delay*10);
                        else if (speed_bet_val == 60)
                            var time_by_bet = parseInt(time_delay*5);
                        else
                            var time_by_bet = parseInt(time_delay);

                        if (autobet_stop == false) {
                            if(invalAuto === null){
                                invalAuto = setInterval(function () {
                                    play();
                                }, 150);
                            }
                        }
                        else {
                            clearInterval(invalAuto);
                            invalAuto = null;
                            stop_pilot_mode();
                        }
                    }
                    else {
                        clearInterval(invalAuto);
                        invalAuto = null;
                        stop_pilot_mode();
                    }
                }

                game_in_progress = false;

                if (val.return.event == true) {
                    socket.emit("event", {});
                }

            }
            else {
                game_in_progress = false;

                if (val.return.type != "abort") {
                    if (autobet_mode == false) {
                        showErrorNotification(val.return.value, val.return.info);
                        $("#btn-bet-dice, #btn-bet-start-pilot-dice").button("reset");
                    }
                    else {
                        if (number_bet_done >= 1) {
                            $("#modal-stop-autobet-numbers").html(number_bet_done);
                            $("#modal-stop-autobet-value").html(val.return.value);
                            $("#modal-stop-autobet-reason").modal("show");
                        }
                        else {
                            showErrorNotification(val.return.value, val.return.info);
                        }
                        clearInterval(invalAuto);
                        invalAuto = null;
                        stop_pilot_mode();
                    }
                }
                else {
                    if (bet_nb_errors >= 2) {
                        bet_nb_errors = 0;
                        if (autobet_mode == false) {
                            showErrorNotification(val.return.value, val.return.info);
                            $("#btn-bet-dice, #btn-bet-start-pilot-dice").button("reset");
                        }
                        else {
                            if (number_bet_done >= 1) {
                                $("#modal-stop-autobet-numbers").html(number_bet_done);
                                $("#modal-stop-autobet-value").html(val.return.value);
                                $("#modal-stop-autobet-reason").modal("show");
                            }
                            else {
                                showErrorNotification(val.return.value, val.return.info);
                            }
                            clearInterval(invalAuto);
                            invalAuto = null;
                            stop_pilot_mode();
                        }

                    }
                    else {
                        bet_nb_errors++;
                        setTimeout(function() {	play();	}, 1000);
                    }
                }

            }

        },
        error:		function (xhr, ajaxOptions, thrownError)	{game_in_progress = false;setTimeout(function() {	play();	}, 1000);},
        timeout:	function (xhr, ajaxOptions, thrownError)	{game_in_progress = false;setTimeout(function() {	play();	}, 1000);},
        abort:		function (xhr, ajaxOptions, thrownError)	{game_in_progress = false;setTimeout(function() {	play();	}, 1000);}
    });
}