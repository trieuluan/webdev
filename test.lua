local balance = 20000
local py = 4.7143
local totalRisk = (py * 10) + 20
print(totalRisk)
--totalRisk = math.ceil(totalRisk)
local onlose = 1 / (py - 1) * 100
--[[local before = (30 * onlose * (100))]]
bet = balance / py
--bet = 0.01564528515254
--bet = bet + (bet * onlose / 100)
for i = 1, totalRisk, 1 do
    bet = bet / ((onlose / 100) + 1)
end
totalBet = bet
for i = 1, totalRisk, 1 do
    bet = bet + (bet * onlose / 100)
--    print(bet)
    totalBet = totalBet + bet
end
--print(totalBet)
