local IsUIOpen, UnAvailableExtras, ActiveExtras, InActiveExtras = false, {}, {}, {}
local config<const> = lib.require 'config/client'
local remote<const>, cursor<const> = config.controls.toggleRemote, config.controls.toggleCursor

RegisterCommand('tr_patrolextras_debug', function()
    if InVehicle then
        checkVehicleExtras()
    else
        notify('get in the vehicle')
    end
end, config.debug and false or true)

function checkVehicleExtras()
    for i = 1, 12 do
        ActiveExtras[i] = IsVehicleExtraTurnedOn(Veh, i) and true
        InActiveExtras[i] = not IsVehicleExtraTurnedOn(Veh, i)
        UnAvailableExtras[i] = not DoesExtraExist(Veh, i)
    end
end

local function openDamageCheck()
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
        local newState = not isExtraOn
        lib.console.trace(("Extra %s %s"):format(extraNum, isExtraOn and "disabled" or "enabled"))
        cb({
            success = true,
            extraNum = extraNum,
            isActive = newState
        })
    else
        SetVehicleExtra(Veh, extraNum, isExtraOn)
        local newState = not isExtraOn
        lib.console.trace(("Extra %s %s"):format(extraNum, isExtraOn and "disabled" or "enabled"))
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
    if openDamageCheck() == 1 then return notify(config.notify.success.closed, 'success') end
    if openDamageCheck() == 2 then return notify(config.notify.error.damaged, 'error') end
    if openDamageCheck() == false then
        IsUIOpen = not IsUIOpen
        if IsUIOpen then
            checkVehicleExtras()
            SendNUIMessage({
                action = 'open',
                unAvailableExtras = UnAvailableExtras,
                activeExtras = ActiveExtras,
                inActiveExtras = InActiveExtras,
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
    else
        lib.console.fatal('Something unexpected happend')
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

RegisterCommand(remote.commands.command, remote.commands.enabled and toggleRemote, false)
RegisterCommand(cursor.commands.command, cursor.commands.enabled and toggleCursor, false)

RegisterKeyMapping(remote.commands.command, remote.description, 'keyboard', remote.key)
RegisterKeyMapping(cursor.commands.command, cursor.description, 'keyboard', cursor.key)

RegisterNetEvent('tr_patrolextras:client:toggleRemote', toggleRemote)
RegisterNetEvent('tr_patrolextras:client:toggleCursor', toggleCursor)
exports('toggleRemote', toggleRemote)
exports('toggleCursor', toggleCursor)

CreateThread(function()
    local lastSirenState = nil
    while true do
        Veh = GetVehiclePedIsIn(PlayerPedId(), false)
        if Veh ~= 0 then
            InVehicle = true
            local currentSirenState = IsVehicleSirenOn(Veh) and true
            if lastSirenState == nil or currentSirenState ~= lastSirenState then
                SendNUIMessage({
                    action = 'sirenCheck',
                    sirenOn = currentSirenState
                })
                lastSirenState = currentSirenState
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
            lastSirenState = nil
        end
        Wait(200)
    end
end)