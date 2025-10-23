local IsUIOpen, Option, UnAvailableExtras, ActiveExtras, InActiveExtras = false, {}, {}, {}, {}
local config = require 'config/client'

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
    print({type = 'info', message = ("Restored to original states: %s"):format(json.encode(originalStates))})

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
    print({type = 'info', message = ("Original states: %s"):format(json.encode(turnOnTable))})

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
    if config.ignoreVehicleState then return end
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
    if not config.ignoreVehicleState and IsVehicleDamaged(Veh) then
        if isExtraOn == false then
            notify(config.notify.error.damaged, 'error')
            cb({success = false, error = "Veh damaged"})
            return
        end
        SetVehicleExtra(Veh, extraNum, isExtraOn)
        local newState = not isExtraOn -- After toggle, state is opposite
        print({type = 'info', message = ("Extra %s %s"):format(extraNum, isExtraOn and "disabled" or "enabled")})
        cb({
            success = true,
            extraNum = extraNum,
            isActive = newState
        })
    else
        SetVehicleExtra(Veh, extraNum, isExtraOn)
        local newState = not isExtraOn -- After toggle, state is opposite
        print({type = 'info', message = ("Extra %s %s"):format(extraNum, isExtraOn and "disabled" or "enabled")})
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
    if OpenDamageCheck() == 1 then return notify(config.notify.success.closed, 'success') end
    if OpenDamageCheck() == 2 then return notify(config.notify.error.damaged, 'success') end
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

RegisterCommand(config.controls.toggleRemote.commands.command, config.controls.toggleRemote.commands and toggleRemote, config.controls.toggleRemote.commands.enabled and false or true)
RegisterCommand(config.controls.toggleCursor.commands.command, config.controls.toggleCursor.commands and toggleCursor, config.controls.toggleCursor.commands.enabled and false or true)

RegisterKeyMapping(config.controls.toggleRemote.commands.command, config.controls.toggleRemote.description, 'keyboard', config.controls.toggleRemote.key)
RegisterKeyMapping(config.controls.toggleCursor.commands.command, config.controls.toggleCursor.description, 'keyboard', config.controls.toggleCursor.key)

RegisterCommand('tr_patrolextras_debug', function()
    if not InVehicle then return end

    checkVehicleExtras()
    print({type = 'info', message = ('UnAvailableExtras %s'):format(json.encode(UnAvailableExtras))})
    print({type = 'info', message = ('ActiveExtras %s'):format(json.encode(ActiveExtras))})
    print({type = 'info', message = ('InActiveExtras %s'):format(json.encode(InActiveExtras))})
end, config.debug and false or true)

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