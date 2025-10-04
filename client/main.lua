local longVoiceRange = Option.Range
local micFilter, isMicActive, isToggleOn = false, false, false
local canUseMic = true
local VehicleModels = Option.VehicleModels
local VehicleClasses = Option.VehicleClass

function isEmergencyVehicle()
    local playerPed = PlayerPedId()
    if IsPedInAnyVehicle(playerPed, false) then
        local vehicle = GetVehiclePedIsIn(playerPed, false)
        local vehicleClass = GetVehicleClass(vehicle)
        local vehicleModel = GetEntityModel(vehicle)
        
        if VehicleModels[vehicleModel] then
            canUseMic = true
            return true
        end
        return VehicleClasses[vehicleClass] or false
    end
    return false
end

function createMicFilter()
    micFilter = CreateAudioSubmix("tr_patrolmegaphone")
    if micFilter then
        SetAudioSubmixEffectRadioFx(micFilter, 0)
        SetAudioSubmixEffectParamInt(micFilter, 0, `default`, 1)
        AddAudioSubmixOutput(micFilter, 0)
    end
end

function applyMicFilter()
    if micFilter then
        MumbleSetSubmixForServerId(PlayerId(), micFilter)
    end
end

function removeMicFilter()
    MumbleSetSubmixForServerId(PlayerId(), -1)
end

function deactivateMic()
    removeMicFilter()
    exports["pma-voice"]:clearProximityOverride()
    isToggleOn = false
    isMicActive = false
    exports.tr_fusion:showInteraction(nil, 'Deactivated')
    Wait(1000)
    exports.tr_fusion:hideInteraction()
end

function vehicleCheckLoop()
    CreateThread(function()
        while isToggleOn do
            Wait(500)
            if not isEmergencyVehicle() then
                canUseMic = false
                exports['qb-core']:Notify('You left the emergency vehicle, mic turned off!', 'warning', 7500)
                deactivateMic()
                break
            end
        end
    end)
end

CreateThread(function()
    createMicFilter()
end)

RegisterCommand(Option.Command, function()
    TriggerEvent('tr_patrolmegaphone:client:toggle')
end, false)

RegisterKeyMapping(Option.Command, Option.Description, 'keyboard', Option.Key)

RegisterNetEvent('tr_patrolmegaphone:client:toggle', function()
    print('Toggling Patrol Mic')
    if not isEmergencyVehicle() then
        exports['qb-core']:Notify('You must be in an emergency vehicle to use the patrol mic!', 'error', 5000)
        return
    end
    
    if canUseMic then
        isMicActive = not isMicActive
        if isMicActive then
            applyMicFilter()
            exports["pma-voice"]:overrideProximityRange(longVoiceRange, true)
            isToggleOn = true
            exports.tr_fusion:showInteraction('J', 'Activated')
            vehicleCheckLoop()
        else
            deactivateMic()
        end
    else
        exports['qb-core']:Notify('Patrol mic is not available right now!', 'error', 3000)
    end
end)