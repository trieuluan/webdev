"use strict";

var _createClass = (function() {
    function a(a, b) {
        for (var c, d = 0; d < b.length; d++)
            (c = b[d]),
                (c.enumerable = c.enumerable || !1),
                (c.configurable = !0),
            "value" in c && (c.writable = !0),
                Object.defineProperty(a, c.key, c);
    }
    return function(b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b;
    };
})();
function _classCallCheck(a, b) {
    if (!(a instanceof b))
        throw new TypeError("Cannot call a class as a function");
}
requirejs(
    [
        "https://canvasjs.com/assets/script/jquery.canvasjs.min.js",
        "https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"
    ],
    function(a, b) {
        var c = (function() {
                function a() {
                    var c = this;
                    _classCallCheck(this, a),
                        (this.coin = devise),
                        (this.profit = 0),
                        (this.startBalance = parseFloat($("#balance-" + devise).val())),
                        (this.currentBalance = this.startBalance),
                        (this.target = 50),
                        (this.defaultBasebet = 0),
                        (this.autoStart = !1),
                        (this.stop = !0),
                        (this.totalBet = 0),
                        (this.win = 0),
                        (this.lose = 0),
                        (this.maxWin = 0),
                        (this.maxLose = 0),
                        (this.from = 0.01),
                        (this.to = 90),
                        (this.balanceLose = 0),
                        (this.runChance = { min: 0.01, max: 98 }),
                        (this.listChanceRun = []),
                        (this.flagGo = !1),
                        (this.resetTileThang = function() {
                            console.log("here"),
                                c.listChanceRun.forEach(function(a, b, c) {
                                    c[b].tilethang = 0;
                                });
                        }),
                        (this.updateTiLeThang = function(a) {
                            c.listChanceRun.forEach(function(b, c, d) {
                                b.defaultHi
                                    ? a < b.game
                                    ? (d[c].lose += 1)
                                    : (d[c].lose = 0)
                                    : a > b.game
                                    ? (d[c].lose += 1)
                                    : (d[c].lose = 0),
                                    (d[c].tilethang = 100 * (b.lose / b.risk));
                            });
                        }),
                        (this.createChange = function(a) {
                            c.listChanceRun = [];
                            for (var d, e = c.runChance.min; e <= c.runChance.max; e += 0.01)
                                (d = c.getPayout(e)),
                                    c.listChanceRun.push({
                                        game: parseFloat(100 - e - 0.01).toFixed(2),
                                        risk: 10 * d + (20 * (10 * d)) / 100,
                                        chance: e.toFixed(2),
                                        lose: 0,
                                        defaultHi: !0,
                                        tilethang: 0,
                                        onlose: 100 * (1 / (1 * d - 1)),
                                        basebet: a,
                                        condition: ">"
                                    }),
                                    c.listChanceRun.push({
                                        game: parseFloat(e).toFixed(2),
                                        risk: 10 * d + (20 * (10 * d)) / 100,
                                        chance: e.toFixed(2),
                                        lose: 0,
                                        defaultHi: !1,
                                        tilethang: 0,
                                        onlose: 100 * (1 / (1 * d - 1)),
                                        basebet: a,
                                        condition: "<"
                                    });
                            c.listChanceRun = b.orderBy(
                                c.listChanceRun,
                                ["chance"],
                                ["desc"]
                            );
                        });
                }
                return (
                    _createClass(a, [
                        {
                            key: "showError",
                            value: function showError(a) {
                                showErrorNotification("ERROR", a);
                            }
                        },
                        {
                            key: "showSuccess",
                            value: function showSuccess(a) {
                                showSuccessNotification("SUCCESS", a);
                            }
                        },
                        {
                            key: "getPhanTramProfit",
                            value: function getPhanTramProfit() {
                                return (
                                    100 * (parseFloat(this.profit) / this.startBalance) || 0
                                ).toFixed(2);
                            }
                        },
                        {
                            key: "createTool",
                            value: function createTool() {
                                var a = $("<div/>", {
                                        class: "info-luan-bot",
                                        style: "width: 100%;padding: 10px 0;text-align: center"
                                    }),
                                    b = $("<h1/>", {
                                        text: "Super Bot Dice",
                                        style: "color: white;"
                                    })
                                        .append("<br/>")
                                        .append(
                                            $("<small/>", {
                                                text: "NEW STADY v1.0.1",
                                                style: "color: white;"
                                            })
                                        ),
                                    c = $(
                                        '<p style="color: white;font-weight: bold;">Strategy by <a style="color: greenyellow;" href="https://www.facebook.com/ttluan" target="_blank">Tr\u01B0\u01A1ng Tri\u1EC7u Lu\xE2n</a></p><p style="color: white;font-weight: bold;">Algorithm by <a style="color: greenyellow;" href="https://www.facebook.com/ttluan" target="_blank">Tr\u01B0\u01A1ng Tri\u1EC7u Lu\xE2n</a></p><p style="color: white;font-weight: bold;">Developer by <a style="color: greenyellow;" href="https://www.facebook.com/ttluan" target="_blank">Tr\u01B0\u01A1ng Tri\u1EC7u Lu\xE2n</a></p><p style="color: white;font-weight: bold;">Donate to developer via wallet:</p><ul style="color: white;width: 500px;text-align: left;margin: 0 auto;"><li>DTQUKPAtskAnri5dKKVT4n5VaWz3DDovqw - Doge</li><li>0x64b447117d3493e2cfb7b10dc4d76345de34057f - Ethereum</li><li>LXm8xFQmShkXVPj9PwCRGwyn92gShDz9qU - Litecoin</li><li>qqxluxclfu8awmqkmakpylqnznp9dsmklvl3f6nfmt - Bitcoin cash</li><li>382uQjc3wrBpsz1GRo5967gpicAfqycHL2 - Bitcoin</li></ul>'
                                    );
                                a.append(b).append(c),
                                    $(".game__container__content").width("90%"),
                                    $(".game__container__content .game__left").width("70%"),
                                    $(".game__container__content .game__right").width("30%"),
                                    $(".game__container__index").prepend(a),
                                    $(".game__left__menu").remove();
                                var d = $(".row__game.text-semibold")
                                        .next()
                                        .next()
                                        .find(".row__game__options"),
                                    e = d.clone();
                                e.empty();
                                var f = $("<div/>", {
                                    class: "row__game__options__block border__right"
                                }).append('<div class="title">Profit target %</div>');
                                f.append(
                                    $("<div/>", {
                                        class: "row__game__options__pie game__options__pie__1"
                                    }).append(
                                        '<input type="text" id="target" value="' +
                                        this.target +
                                        '" />'
                                    )
                                ),
                                    e.css("flex-wrap", "wrap"),
                                    e.append(f),
                                    d
                                        .closest(".row__game")
                                        .after($("<div/>", { class: "row__game" }).append(e));
                                var g = $("#btn-bet-dice").clone();
                                $("#btn-bet-dice").remove();
                                var h = g.clone(),
                                    i = g.clone();
                                g
                                    .attr("id", "btn-start-bot")
                                    .text("Start bot")
                                    .css("width", "calc(100% / 3)")
                                    .css("background", "#87be4d"),
                                    h
                                        .attr("id", "btn-stop-bot")
                                        .text("Stop bot")
                                        .css("width", "calc(100% / 3)")
                                        .css("background", "#f76c51"),
                                    i
                                        .attr("id", "btn-clear-bot")
                                        .text("Clear bot")
                                        .css("width", "calc(100% / 3)"),
                                    $(".game__left__content")
                                        .append(g)
                                        .append(h)
                                        .append(i),
                                    $(".dice__stats__menu")
                                        .find('[data-type="overall"]')
                                        .remove(),
                                    $(".options__stats").trigger("click");
                                var j = $("<div/>", { style: "width:50%;margin-right:2px" }),
                                    k = $("<div/>", { style: "width:100%;margin-right:2px" }),
                                    l = $("<div/>", {
                                        style: "display:flex;width:100%;margin-top:10px"
                                    }),
                                    m = j.clone().append("<h5>Current win</h5>");
                                m.append(
                                    $("<div/>", {
                                        id: "current-win",
                                        class: "stats__div__infos",
                                        text: 0
                                    })
                                );
                                var n = j.clone().append("<h5>Current lose</h5>");
                                n.append(
                                    $("<div/>", {
                                        id: "current-lose",
                                        class: "stats__div__infos",
                                        text: 0
                                    })
                                );
                                var o = j.clone().append("<h5>Max win</h5>");
                                o.append(
                                    $("<div/>", {
                                        id: "current-max-win",
                                        class: "stats__div__infos",
                                        text: 0
                                    })
                                );
                                var p = j.clone().append("<h5>Max lose</h5>");
                                p.append(
                                    $("<div/>", {
                                        id: "current-max-lose",
                                        class: "stats__div__infos",
                                        text: 0
                                    })
                                );
                                var q = j.clone().append("<h5>Profit</h5>");
                                q.append(
                                    $("<div/>", {
                                        id: "my-current-profit",
                                        class: "stats__div__infos",
                                        text: this.profit
                                    })
                                );
                                var r = j.clone().append("<h5>Ph\u1EA7n tr\u0103m profit</h5>");
                                r.append(
                                    $("<div/>", {
                                        id: "current-pt-profit",
                                        class: "stats__div__infos",
                                        text: this.getPhanTramProfit()
                                    })
                                );
                                var s = k.clone().append("<h5>Balance Lose</h5>");
                                s.append(
                                    $("<div/>", {
                                        id: "balance-lose",
                                        class: "stats__div__infos",
                                        text: 0
                                    })
                                );
                                var t = l.clone(),
                                    u = l.clone(),
                                    v = l.clone(),
                                    w = l.clone();
                                t
                                    .attr("id", "flexrow1")
                                    .append(m)
                                    .append(n),
                                    u
                                        .attr("id", "flexrow2")
                                        .append(o)
                                        .append(p),
                                    v.attr("id", "flexrow3").append(s),
                                    w
                                        .attr("id", "flexrow4")
                                        .append(q)
                                        .append(r),
                                0 == $("#flexrow1").length &&
                                0 == $("#flexrow2").length &&
                                0 == $("#flexrow3").length &&
                                $(".dice__stats__current")
                                    .append(t)
                                    .append(u)
                                    .append(v)
                                    .append(w),
                                    $(".dice__stats").height(580),
                                    $(".dice__stats__content").height(500);
                            }
                        },
                        {
                            key: "dobet",
                            value: function dobet() {
                                return $.ajax({
                                    type: "POST",
                                    url: "/api/bet",
                                    cache: !1,
                                    context: this,
                                    data: {
                                        access_token: access_token,
                                        username: user_username,
                                        type: "dice",
                                        amount: this.databet.basebet,
                                        condition: this.databet.condition,
                                        game: this.databet.game,
                                        devise: this.coin
                                    }
                                });
                            }
                        },
                        {
                            key: "infoSeeds",
                            value: function infoSeeds(a) {
                                return $.ajax({
                                    type: "post",
                                    url: "/api/check-bet.php",
                                    context: this,
                                    data: { id: a }
                                });
                            }
                        },
                        {
                            key: "insertBet",
                            value: function insertBet(a) {
                                return $.ajax({
                                    type: "post",
                                    data: a,
                                    url: "//dicegametool.com/api/insert",
                                    context: this,
                                    dataType: "JSON"
                                });
                            }
                        },
                        {
                            key: "stopGame",
                            value: function stopGame() {
                                (this.stop = !0),
                                    (this.autoStart = !1),
                                    (this.defaultBasebet = 0),
                                    alert("Bet stop");
                            }
                        },
                        {
                            key: "startGame",
                            value: function startGame() {
                                this.stop ||
                                this.dobet().then(this.updateBet, function() {
                                    (this.stop = !0),
                                        (this.autoStart = !1),
                                        $("#btn-start-bot").trigger("click");
                                });
                            }
                        },
                        {
                            key: "getPayout",
                            value: function getPayout(a) {
                                var b = 100 / parseFloat(a);
                                b -= b * (parseFloat(1) / 100);
                                var c = parseFloat(b);
                                return 1e3 > c && (c = c.toFixed(4)), c;
                            }
                        },
                        {
                            key: "loadDatabet",
                            value: function loadDatabet() {
                                var a = b.maxBy(this.listChanceRun, function(a) {
                                    return a.tilethang;
                                });
                                return a;
                            }
                        },
                        {
                            key: "loadDataMinBet",
                            value: function loadDataMinBet() {
                                var a = b.minBy(
                                    b.orderBy(this.listChanceRun, "chance", "asc"),
                                    function(a) {
                                        return a.tilethang;
                                    }
                                );
                                return a;
                            }
                        },
                        {
                            key: "doScript",
                            value: function doScript(a) {
                                (this.onLoadDataBet = this.loadDatabet()),
                                    20 <= this.onLoadDataBet.tilethang &&
                                    50 >= this.onLoadDataBet.tilethang
                                        ? (0 <= a
                                        ? (this.databet.basebet = this.defaultBasebet)
                                        : (this.balanceLose += this.databet.basebet),
                                            (this.databet = this.onLoadDataBet))
                                        : ((this.onLoadDataBet = this.loadDataMinBet()),
                                            0 <= a
                                                ? (this.databet.basebet = this.defaultBasebet)
                                                : (this.balanceLose += this.databet.basebet),
                                            (this.databet = this.onLoadDataBet)),
                                    (this.databet.basebet = parseFloat(this.databet.basebet)),
                                    0 <= a
                                        ? (this.win++,
                                            (this.lose = 0),
                                        this.win >= this.maxWin && (this.maxWin = this.win),
                                        0 < this.balanceLose &&
                                        this.flagGo &&
                                        ((this.flagGo = !1),
                                            (this.balanceLose -= parseFloat(a))),
                                            d.updateChart(
                                                this.totalBet,
                                                this.profit.toFixed(8),
                                                "win"
                                            ))
                                        : (this.lose++,
                                        this.lose >= this.maxLose && (this.maxLose = this.lose),
                                            (this.win = 0),
                                            (this.flagGo = !1),
                                            (this.databet.basebet +=
                                                (this.databet.basebet * this.databet.onlose) / 100),
                                            d.updateChart(
                                                this.totalBet,
                                                this.profit.toFixed(8),
                                                "lose"
                                            ));
                                var b = this.getPayout(this.databet.chance);
                                0 < this.balanceLose &&
                                0.1 < 100 * (this.balanceLose / this.currentBalance) &&
                                ((this.flagGo = !0),
                                    (this.databet.basebet = this.balanceLose / (b - 1))),
                                0 > this.balanceLose && (this.balanceLose = 0),
                                this.databet.basebet > this.currentBalance &&
                                (this.databet.basebet = this.currentBalance / 2),
                                    1e-8 > this.databet.basebet && "btc" === this.coin
                                        ? (this.databet.basebet = 1e-8)
                                        : 5e-6 > this.databet.basebet && "etc" === this.coin
                                        ? (this.databet.basebet = 5e-6)
                                        : 5e-7 > this.databet.basebet && "ltc" === this.coin
                                            ? (this.databet.basebet = 5e-7)
                                            : 0.05 > this.databet.basebet && "doge" === this.coin
                                                ? (this.databet.basebet = 0.05)
                                                : 1e-7 > this.databet.basebet && "eth" === this.coin
                                                    ? (this.databet.basebet = 1e-7)
                                                    : 5e-8 > this.databet.basebet && "bch" === this.coin
                                                        ? (this.databet.basebet = 5e-8)
                                                        : 2e-7 > this.databet.basebet &&
                                                        ("xmr" === this.coin ||
                                                            "dash" === this.coin ||
                                                            "zec" === this.coin)
                                                            ? (this.databet.basebet = 2e-7)
                                                            : 0.01 > this.databet.basebet &&
                                                            "burst" === this.coin
                                                                ? (this.databet.basebet = 0.01)
                                                                : 3e-5 > this.databet.basebet &&
                                                                "strat" === this.coin
                                                                    ? (this.databet.basebet = 3e-5)
                                                                    : 15e-5 > this.databet.basebet &&
                                                                    "xrp" === this.coin
                                                                        ? (this.databet.basebet = 15e-5)
                                                                        : 0.1 > this.databet.basebet &&
                                                                        "burst" === this.coin &&
                                                                        (this.databet.basebet = 0.1),
                                    $("#amount").val(parseFloat(this.databet.basebet).toFixed(8)),
                                    set_by_chance(this.databet.chance, !0);
                            }
                        },
                        {
                            key: "updateBet",
                            value: function updateBet(a) {
                                if (a) {
                                    var b = JSON.parse(a);
                                    if ("true" === b.return.success) {
                                        var f = b.return.username,
                                            g = b.return.id,
                                            h = b.return.type,
                                            i = b.return.devise,
                                            j = b.return.ts,
                                            k = b.return.time,
                                            l = b.return.winning_chance,
                                            m = b.return.roll_number,
                                            n = b.return.amount_return,
                                            o = b.return.new_balance,
                                            p = b.return.show,
                                            q = b.return.amount,
                                            r = b.return.condition,
                                            s = b.return.game,
                                            t = b.return.payout;
                                        this.updateTiLeThang(m),
                                            $("#balance-" + i).val(round_float(o, 12)),
                                            $(".b__text").html(round_float(o, 8)),
                                            $("#currency-menu-top-" + i + "-content").html(
                                                round_float(o, 8)
                                            );
                                        var u = null;
                                        if (
                                            ((u =
                                                0 <= n
                                                    ? '<div class="last__results__block green" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\'' +
                                                    g +
                                                    "'); return false;\">" +
                                                    parseFloat(m).toFixed(2) +
                                                    "</div>"
                                                    : '<div class="last__results__block red" style="margin-left:-40px;width:49px;float:left" onclick="get_infos_bet(\'' +
                                                    g +
                                                    "'); return false;\">" +
                                                    parseFloat(m).toFixed(2) +
                                                    "</div>"),
                                                $(".last__results__content").prepend(u),
                                                $(".last__results__content div:first").animate(
                                                    { marginLeft: "5px" },
                                                    100,
                                                    function() {
                                                        var a = $(".last__results__content div").size();
                                                        6 == a &&
                                                        $(".last__results__content div")
                                                            .get(5)
                                                            .remove();
                                                    }
                                                ),
                                                addBetHistory(
                                                    "my-bets",
                                                    h,
                                                    g,
                                                    f,
                                                    k,
                                                    q,
                                                    i,
                                                    l,
                                                    m,
                                                    n,
                                                    r,
                                                    s,
                                                    t
                                                ),
                                                datas_overall_session.number_bets++,
                                                datas_current_session.number_bets++,
                                            0 <= n)
                                        ) {
                                            datas_overall_session.number_bets_wins++,
                                                datas_current_session.number_bets_wins++;
                                            var c = 100 * (100 / parseFloat(l));
                                            (datas_overall_session.lucky_total =
                                                parseFloat(datas_overall_session.lucky_total) +
                                                parseFloat(c)),
                                                (datas_current_session.lucky_total =
                                                    parseFloat(datas_current_session.lucky_total) +
                                                    parseFloat(c));
                                        } else
                                            datas_overall_session.number_bets_losses++,
                                                datas_current_session.number_bets_losses++;
                                        (datas_overall_session.lucky = parseFloat(
                                            datas_overall_session.lucky_total /
                                            datas_overall_session.number_bets
                                        ).toFixed(2)),
                                            (datas_current_session.lucky = parseFloat(
                                                datas_current_session.lucky_total /
                                                datas_current_session.number_bets
                                            ).toFixed(2)),
                                            (datas_overall_session.wagered = (
                                                parseFloat(datas_overall_session.wagered) +
                                                parseFloat(q)
                                            ).toFixed(8)),
                                            (datas_current_session.wagered = (
                                                parseFloat(datas_current_session.wagered) +
                                                parseFloat(q)
                                            ).toFixed(8)),
                                            (datas_overall_session.profit = (
                                                parseFloat(datas_overall_session.profit) + parseFloat(n)
                                            ).toFixed(8)),
                                            (datas_current_session.profit = (
                                                parseFloat(datas_current_session.profit) + parseFloat(n)
                                            ).toFixed(8)),
                                            $("#current-bets-number").html(
                                                number_format(datas_current_session.number_bets)
                                            ),
                                            $("#current-wagered").html(datas_current_session.wagered),
                                            $("#current-profit").html(datas_current_session.profit),
                                            $("#current-bets-wins").html(
                                                number_format(datas_current_session.number_bets_wins)
                                            ),
                                            $("#current-bets-losses").html(
                                                number_format(datas_current_session.number_bets_losses)
                                            ),
                                            $("#current-lucky").html(
                                                datas_current_session.lucky + "%"
                                            );
                                        var d = b.return.notifications;
                                        for (var e in d)
                                            "rcvJackpotDice" == d[e].name
                                                ? rcvJackpotDice(d[e])
                                                : rcvnotificationbet(d[e]);
                                        0 <= n
                                            ? ($("#result__bet").html(
                                            "+" + number_format(round_float(n, 8), 8)
                                            ),
                                                $(".b__text").addClass("green"))
                                            : ($("#result__bet").html(
                                            number_format(round_float(n, 8), 8)
                                            ),
                                                $(".b__text").addClass("red")),
                                            setTimeout(function() {
                                                $(".b__text").removeClass("red green");
                                            }, 200),
                                            show_result(),
                                            this.totalBet++,
                                            (this.profit = parseFloat(this.profit) + parseFloat(n)),
                                            (this.currentBalance = parseFloat(o)),
                                        parseFloat(this.profit) >=
                                        (this.target * this.startBalance) / 100 &&
                                        this.stopGame(),
                                            this.doScript(n),
                                            $("#current-win").html(this.win),
                                            $("#current-lose").html(this.lose),
                                            $("#current-max-win").html(this.maxWin),
                                            $("#current-max-lose").html(this.maxLose),
                                            $("#my-current-profit").html(this.profit.toFixed(8)),
                                            $("#current-pt-profit").html(this.getPhanTramProfit()),
                                            $("#balance-lose").html(
                                                parseFloat(this.balanceLose).toFixed(8)
                                            ),
                                            this.startGame();
                                    } else this.showError(b.return.value), this.stopGame();
                                }
                            }
                        }
                    ]),
                        a
                );
            })(),
            d = (function() {
                function b() {
                    _classCallCheck(this, b);
                    var a = this;
                    $(".game__container__content .game__left").append(
                        '<div id="chart_canvas" class="game__container" style="width: 100%;height:' +
                        $(".game__left__content").height() +
                        'px"></div>'
                    ),
                        setTimeout(function() {
                            a.addChart();
                        }, 2e3);
                }
                return (
                    _createClass(
                        b,
                        [
                            {
                                key: "addChart",
                                value: function addChart() {
                                    (b.chart = new a.Chart("chart_canvas", {
                                        theme: "light2",
                                        title: { text: "Bitsler Chart Betting", fontSize: 12 },
                                        legend: { verticalAlign: "center" },
                                        axisY: {
                                            labelFontSize: 11,
                                            title: "Profit",
                                            includeZero: !1,
                                            valueFormatString: "#,##0.########",
                                            titleFontSize: "12"
                                        },
                                        axisX: {
                                            labelFontSize: 11,
                                            title: "Bet",
                                            titleFontSize: "12"
                                        },
                                        data: [
                                            {
                                                type: "line",
                                                dataPoints: b.dps,
                                                animationEnabled: !0,
                                                animationDuration: 2e3
                                            }
                                        ]
                                    })),
                                        b.chart.render();
                                }
                            }
                        ],
                        [
                            {
                                key: "updateChart",
                                value: function updateChart(a, c, d) {
                                    c = parseFloat(c);
                                    var e = null;
                                    (e = "win" === d ? "#00695C" : "#FF1744"),
                                        b.dps.push({ x: a, y: c, color: e }),
                                    b.dps[b.dps.length - 2] &&
                                    (b.dps[b.dps.length - 2].lineColor = e),
                                    b.dps.length > b.lengthChart && b.dps.shift(),
                                        b.chart.render();
                                }
                            }
                        ]
                    ),
                        b
                );
            })();
        (d.dps = []), (d.chart = null), (d.lengthChart = 1e3);
        var e = new c();
        (e.databet = e.loadDatabet()),
            e.createTool(),
            new d(),
            $(".game__left__content").on("click", "#btn-start-bot", function() {
                return e.autoStart
                    ? void e.showError("Bot on running")
                    : void ((e.stop = !1),
                        (e.autoStart = !0),
                        (e.coin = devise),
                        (e.startBalance = parseFloat($("#balance-" + devise).val())),
                        (e.target = parseFloat($("#target").val())),
                    0 === e.defaultBasebet &&
                    (e.defaultBasebet = parseFloat($("#amount").val())),
                        0 === e.listChanceRun.length
                            ? e.createChange(e.defaultBasebet)
                            : e.listChanceRun.forEach(function(a, b, c) {
                                c[b].basebet = e.defaultBasebet;
                            }),
                        (e.databet = e.loadDatabet()),
                        0 >= e.databet.basebet
                            ? (e.showError("Xin nh\u1EADp base bet"),
                                (e.autoStart = !1),
                                (e.stop = !0))
                            : e.startGame());
            }),
            $(".game__left__content").on("click", "#btn-stop-bot", function() {
                e.stopGame();
            });
    }
);
