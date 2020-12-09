--
-- Created by IntelliJ IDEA.
-- User: luan
-- Date: 5/27/20
-- Time: 8:54 PM
-- To change this template use File | Settings | File Templates.
--

local http = require("socket.http")
local inspect = require('inspect')
local ltn12 = require "ltn12"
local json = require "json"
local data = ""

local info = {
    profit = 0,
    balance = 2000,
    bigerBalance = 0,
--    nonce = 1,
    chienthuat = 1,
    stop = false,
    profitMax = 0
}

local allVariable = {
    bet = 0.00000200,
    form = 5,
    to = 95,
    tableChance = {},
    typeBet = {
        hi = true,
        low = false
    },
    stop = false,
    target = info.balance * 2,
    countBet = 0,
    flagGo = false,
    maxBet = 0
};

local _bet = {
    bet = allVariable.bet,
    over = true,
    target = 50
}

function getPayout(chag)
    local py = 100 / tonumber(chag)
    py = py - (py * (1 / 100))
    return py;
end

function createChange()
    for i = allVariable.form, allVariable.to, 1 do
        i = string.format("%.2f", i)
        local py = tonumber(string.format("%.4f", getPayout(i)))
        allVariable.tableChance[tonumber(i)] = {};
        for hiLow, val in pairs(allVariable.typeBet) do
            allVariable.tableChance[tonumber(i)][hiLow] = {};
            allVariable.tableChance[tonumber(i)][hiLow] = {
                lose = 0,
                onlose = 1 / (py - 1) * 100,
                onwin = {
                    count = 0,
                    tile = 0
                },
                bet = allVariable.bet,
                py = py,
                bethigh = val,
                chance = i,
                tilethang = 0,
                infoData = {
                    profit = 0,
                    maxBet = 0,
                    bigerBalance = 0,
                    balance = info.balance,
                    dead = false
                }
            }
            if tonumber(i) <= 15 then
                allVariable.tableChance[tonumber(i)][hiLow].risk = math.ceil((py * 10) + ((py * 30) * 20 / 100))
            elseif tonumber(i) > 15 and tonumber(i) < 30 then
                allVariable.tableChance[tonumber(i)][hiLow].risk = math.ceil((py * 10) + 20)
            else
                allVariable.tableChance[tonumber(i)][hiLow].risk = math.ceil((py * 10) + ((py * 20) * 20 / 100))
            end
            if val == true then
                allVariable.tableChance[tonumber(i)][hiLow].game = string.format("%.2f", (100 - i - 0.01))
            else
                allVariable.tableChance[tonumber(i)][hiLow].game = string.format("%.2f", i)
            end
        end
    end
end

createChange()

function resetBet()
    for key, value in pairs(allVariable.tableChance) do
        for hiLow, val in pairs(allVariable.typeBet) do
            value[hiLow].lose = 0
            value[hiLow].bet = allVariable.bet
            value[hiLow].onwin.count = 0
            value[hiLow].onwin.tile = 0
            value[hiLow].onwin.tilethang = 0
            value[hiLow].infoData.profit = 0
            value[hiLow].infoData.maxBet = 0
            value[hiLow].infoData.bigerBalance = 0
        end
    end
end

function resetstats()
    info.profit = 0
    info.bigerBalance = 0
    allVariable.target = info.balance * 2
end

function getCurBet(value, hiLow)
    local currentBet = info.bigerBalance / value[hiLow].py
    for i = 1, value[hiLow].risk, 1 do
        currentBet = currentBet / ((value[hiLow].onlose / 100) + 1)
    end
    if currentBet > info.balance then
        currentBet = allVariable.bet
    else
        if currentBet < allVariable.bet then
            currentBet = allVariable.bet
        end
    end
    return currentBet
end

function getMutiBet(value, hiLow)
    local currentBet = info.bigerBalance / value[hiLow].py
    local risk = value[hiLow].risk - value[hiLow].lose
    for i = 1, risk, 1 do
        currentBet = currentBet / ((value[hiLow].onlose / 100) + 1)
    end
    if currentBet < allVariable.bet then
        currentBet = allVariable.bet
    end
    return currentBet
end

function updateInfo(value, hiLow, winLose)
    local profit
    if winLose then
        profit = value[hiLow].bet * value[hiLow].py - value[hiLow].bet
    else
        profit = -value[hiLow].bet
    end
    if value[hiLow].bet > value[hiLow].infoData.maxBet then
        value[hiLow].infoData.maxBet = value[hiLow].bet
    end
    value[hiLow].infoData.profit = value[hiLow].infoData.profit + profit
    value[hiLow].infoData.balance = value[hiLow].infoData.balance + profit
    if value[hiLow].infoData.balance > value[hiLow].infoData.bigerBalance then
        value[hiLow].infoData.bigerBalance = value[hiLow].infoData.balance
    end
end

function winUpdate (value, hiLow)
    updateInfo(value, hiLow, true)
    local tileT = value[hiLow].lose / value[hiLow].risk * 100
    if tileT ~= 0 then
        value[hiLow].onwin.count = value[hiLow].onwin.count + 1
    end
    value[hiLow].onwin.tile = value[hiLow].onwin.tile + tileT
    value[hiLow].lose = 0
    value[hiLow].bet = getCurBet(value, hiLow)
    value[hiLow].tilethang = 0
end

function loseUpdate(value, hiLow, key)
    updateInfo(value, hiLow, false)
    if value[hiLow].lose > 0 then
        --[[if key == tonumber(data.chance) then
            value[hiLow].bet = value[hiLow].bet + (value[hiLow].bet * value[hiLow].onlose / 100)
        else
            value[hiLow].bet = getMutiBet(value, hiLow)
        end]]
--        value[hiLow].bet = getMutiBet(value, hiLow)
        value[hiLow].bet = value[hiLow].bet + (value[hiLow].bet * value[hiLow].onlose / 100)
    end
    value[hiLow].tilethang = value[hiLow].lose / value[hiLow].risk * 100
    value[hiLow].lose = value[hiLow].lose + 1
end

function updateBet()
    info.profit = info.profit + data.profit
    info.balance = info.balance + data.profit
    if info.balance > info.bigerBalance then
        info.bigerBalance = info.balance
    end
    info.nonce = info.nonce + 1
    allVariable.countBet = allVariable.countBet + 1
    for key, value in pairs(allVariable.tableChance) do
        for hiLow, val in pairs(allVariable.typeBet) do
            if val then
                if tonumber(data.roll) > tonumber(value[hiLow].game) then
                    winUpdate(value, hiLow)
                else
                    loseUpdate(value, hiLow, key)
                end
            else
                if tonumber(data.roll) < tonumber(value[hiLow].game) then
                    winUpdate(value, hiLow)
                else
                    loseUpdate(value, hiLow, key)
                end
            end
        end
    end
end

function getBet()
    local _bet
    local phamtram = 0
    local profitBiger
    local maxBet
    local taticName
    local smallestSoFar
    for key, val in pairs(allVariable.tableChance) do
        for hiLow, v in pairs(allVariable.typeBet) do
            if val[hiLow].tilethang > phamtram and
--                val[hiLow].tilethang < 100 - (val[hiLow].onwin.tile / val[hiLow].onwin.count + 40) and
                (not smallestSoFar or (math.abs( ( 100 - (val[hiLow].onwin.tile / val[hiLow].onwin.count + 50) ) - val[hiLow].tilethang) < smallestSoFar) ) and
                (not profitBiger or val[hiLow].infoData.profit < profitBiger) and
                (not maxBet or val[hiLow].infoData.maxBet > maxBet) then
                    smallestSoFar = math.abs( ( 100 - (val[hiLow].onwin.tile / val[hiLow].onwin.count + 50) ) - val[hiLow].tilethang)
                    phamtram = val[hiLow].tilethang
                    profitBiger = val[hiLow].infoData.profit
                    maxBet = val[hiLow].infoData.maxBet
                    _bet = val[hiLow]
             end
        end
    end
    if _bet ~= nil then
        allVariable.flagGo = false
        return {
            bet = _bet.bet,
            over = _bet.bethigh,
            target = _bet.chance,
            tiletThang = _bet.tilethang,
            risk = _bet.risk,
            lose = _bet.lose,
            payout = _bet.py,
            infoData = _bet.infoData,
            maxTile = 100 - math.abs((_bet.onwin.tile / _bet.onwin.count) + 50)
        }
    else
        return {
            bet = allVariable.bet,
            over = math.random(0, 100) % 2 == 0,
            target = math.random(5, 95)
        }
    end
end

local function collect(chunk)
    if chunk ~= nil then
        data = ""
        data = data .. chunk
        data = json:decode(data)
    end
    return true
end

function dobet()
    if _bet.bet > allVariable.maxBet then
        allVariable.maxBet = _bet.bet
    end
    local reqbody = "amount=".._bet.bet.."&over="..tostring(_bet.over).."&target=".._bet.target.."&nonce="..info.nonce
    local result, status_code, content = http.request {
        method = "POST",
        url = "https://www.bitsler.com/api/bet-dice",
        headers =
        {
            ["Content-Type"] = "application/x-www-form-urlencoded",
            ["Content-Length"] = reqbody:len(),
        },
        sink = collect,
        source = ltn12.source.string(reqbody),
    }
    if status_code == 200 then
        updateBet()
        if info.profit > info.profitMax then
            info.profitMax = info.profit
        end
        --[[if info.profitMax > ((info.bigerBalance * 10) / 100) then
            resetstats()
            resetBet()
            info.profitMax = 0
        end
        if info.profit < -((info.bigerBalance * 5) / 100) then
            resetstats()
            resetBet()
            info.profitMax = 0
        end]]
        --[[if info.balance > allVariable.target then
            resetstats()
            resetBet()
        end]]
        os.execute("clear")
        if info.balance > 0 and _bet.bet < info.balance and allVariable.target > info.balance and info.stop == false then
            print(inspect(info), inspect(_bet))
            _bet = getBet()
            dobet()
        else
            print(inspect(info), inspect(_bet))
        end
    end
end

dobet()