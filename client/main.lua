local originalPrint = print
print = function(...)
    local info = debug.getinfo(2, "Sl")
    local lineInfo = info.short_src .. ":" .. info.currentline
    return Option.Print.Debug and originalPrint("[" .. lineInfo .. "]", ...)
end

local function setVehicleExtras(availabilityCheck, originalStates, UnAvailableExtras)
    for i = 1, 12 do
        SetVehicleExtra(Veh, i, true)
        Wait(1)
        local stateAfterOff = IsVehicleExtraTurnedOn(Veh, i)
        SetVehicleExtra(Veh, i, false)
        local stateAfterOn = IsVehicleExtraTurnedOn(Veh, i)
        if stateAfterOff ~= stateAfterOn then
            availabilityCheck[i] = false
        else
            availabilityCheck[i] = true
        end
    end
    for i = 1, 12 do
        SetVehicleExtra(Veh, i, not originalStates[i])
    end
    print("Restored to original states: " .. json.encode(originalStates))

    for i = 1, 12 do
        if availabilityCheck[i] then
            table.insert(UnAvailableExtras, i)
        end
    end
end

local function checkVehicleExtras()
    local originalStates, availabilityCheck, turnOnTable = {}, {}, {}

    for i = 1, 12 do
        originalStates[i] = IsVehicleExtraTurnedOn(Veh, i)
    end

    setVehicleExtras(availabilityCheck, originalStates, UnAvailableExtras)

    for i = 1, 12 do
        if originalStates[i] then
           table.insert(turnOnTable, originalStates[i])
        else
            table.insert(turnOnTable, false)
        end
    end
    print("Original states: " .. json.encode(turnOnTable))

    for i = 1, 12 do
        if turnOnTable[i] then
            table.insert(ActiveExtras, i)
        elseif turnOnTable[i] == false then
            table.insert(UnAvailableExtras, i)
        else
            table.insert(InActiveExtras, i)
        end
    end
    for i = 1, 12 do
        turnOnTable[i] = IsVehicleExtraTurnedOn(Veh, i)
        UnAvailableExtras = UnAvailableExtras
    end
end

local function OpenDamageCheck()
    if Option.IgnoreVehicleState then return end
    if IsVehicleDamaged(Veh) then
        if IsUIOpen then
            SendNUIMessage({
                action = 'close',
                sirenOn = false
            })
            SetNuiFocus(false, false)
            IsUIOpen = false
            return 1
        end
        return 2
    end
    return false
end

local function ToggleDamageCheck(isExtraOn, extraNum, cb)
    if not Option.IgnoreVehicleState and IsVehicleDamaged(Veh) then
        if isExtraOn == false then
            Notify(Option.Notify.Error.Damaged, 'error')
            cb({success = false, error = "Veh damaged"})
            return
        end
        SetVehicleExtra(Veh, extraNum, isExtraOn)
        local newState = not isExtraOn -- After toggle, state is opposite
        print("Extra " .. extraNum .. " " .. (isExtraOn and "disabled" or "enabled"))
        cb({
            success = true,
            extraNum = extraNum,
            isActive = newState
        })
    else
        SetVehicleExtra(Veh, extraNum, isExtraOn)
        local newState = not isExtraOn -- After toggle, state is opposite
        print("Extra " .. extraNum .. " " .. (isExtraOn and "disabled" or "enabled"))
        cb(
            {
                success = true,
                extraNum = extraNum,
                isActive = newState
            }
        )
    end
end

local function toggleRemote()
    if not InVehicle then return end
    if OpenDamageCheck() == 1 then return Notify(Option.Notify.Success.Closed, 'success') end
    if OpenDamageCheck() == 2 then return Notify(Option.Notify.Error.Damaged, 'success') end

    IsUIOpen = not IsUIOpen
    if IsUIOpen then
        SendNUIMessage({
            action = 'open',
            UnAvailableExtras = UnAvailableExtras,
            ActiveExtras = ActiveExtras,
            InActiveExtras = InActiveExtras,
            sirenOn = true
        })
        IsUiOpen = true
    else
        SetNuiFocus(false, false)
        SendNUIMessage({
            action = 'close',
            sirenOn = false
        })
        IsUiOpen = false
    end
end

local function toggleCursor()
    Wait(200)
    if IsUIOpen then
        SetNuiFocus(true, true)
    else
        SetNuiFocus(false, false)
    end
end

RegisterNetEvent('tr_patrolextras:client:checkVehicleExtras', checkVehicleExtras)
RegisterNetEvent('tr_patrolextras:client:toggleRemote', toggleRemote)
RegisterNetEvent('tr_patrolextras:client:toggleCursor', toggleCursor)

RegisterNUICallback('toggle', function(data, cb)
    if not InVehicle then return end
    Wait(200)
    local extraNum = data.num or 1
    local isExtraOn = IsVehicleExtraTurnedOn(Veh, extraNum)
    ToggleDamageCheck(isExtraOn, extraNum, cb)
end)

RegisterNUICallback('unfocus', function(data, cb)
    SetNuiFocus(false, false)
    cb(true)
end)

RegisterCommand(Option.Controls.toggleRemote.commands.command, Option.Controls.toggleRemote.commands and toggleRemote, Option.Controls.toggleRemote.commands.enabled and false or true)
RegisterCommand(Option.Controls.toggleCursor.commands.command, Option.Controls.toggleCursor.commands and toggleCursor, Option.Controls.toggleCursor.commands.enabled and false or true)

RegisterKeyMapping(Option.Controls.toggleRemote.commands.command, Option.Controls.toggleRemote.description, 'keyboard', Option.Controls.toggleRemote.key)
RegisterKeyMapping(Option.Controls.toggleCursor.commands.command, Option.Controls.toggleCursor.description, 'keyboard', Option.Controls.toggleCursor.key)

RegisterCommand('tr_patrolextras_debug', function()
    if not InVehicle then return end

    checkVehicleExtras()
    print('UnAvailableExtras '..json.encode(UnAvailableExtras))
    print('ActiveExtras '..json.encode(ActiveExtras))
    print('InActiveExtras '..json.encode(InActiveExtras))
end, Option.Print.Debug and false or true)

CreateThread(function()
    while true do
        Veh = GetVehiclePedIsIn(PlayerPedId(), false)
        if Veh ~= 0 then
            InVehicle = true
            if IsVehicleSirenOn(Veh) then
                SendNUIMessage({
                    sirenOn = true
                })
            else
                SendNUIMessage({
                    sirenOn = false
                })
            end
        else
            if IsUIOpen then
                Veh = 1
                Wait(400)
                toggleRemote()
                Wait(400)
                Veh = 0
            end
            InVehicle = false
        end
        Wait(200)
    end
end)