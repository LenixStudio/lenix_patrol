local lib<const> = exports.tr_lib:require [[@tr_lib/get]]
local settings = lib.require 'config/client'

local longVoiceRange = settings.range
local micFilter, isMicActive, isToggleOn = false, false, false
local canUseMic = true
local VehicleModels = settings.vehicleModels
local VehicleClasses = settings.vehicleClass

local function isEmergencyVehicle()
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

local function createMicFilter()
    micFilter = CreateAudioSubmix("lenix_patrolmegaphone")
    if micFilter then
        SetAudioSubmixEffectRadioFx(micFilter, 0)
        SetAudioSubmixEffectParamInt(micFilter, 0, `default`, 1)
        AddAudioSubmixOutput(micFilter, 0)
    end
end

local function applyMicFilter()
    if micFilter then
        MumbleSetSubmixForServerId(PlayerId(), micFilter)
    end
end

local function removeMicFilter()
    MumbleSetSubmixForServerId(PlayerId(), -1)
end

local function deactivateMic()
    removeMicFilter()
    exports["pma-voice"]:clearProximityOverride()
    isToggleOn = false
    isMicActive = false
    Bridge.drawtext.show(nil, settings.locales.off)
    Wait(1000)
    Bridge.drawtext.hide()
end

local function vehicleCheckLoop()
    CreateThread(function()
        while isToggleOn do
            Wait(500)
            if not isEmergencyVehicle() then
                canUseMic = false
                exports['qb-core']:Notify(settings.locales.left, 'warning', 7500)
                deactivateMic()
                break
            end
        end
    end)
end

CreateThread(function()
    createMicFilter()
end)

RegisterCommand(settings.command, function()
    TriggerEvent('lenix_patrolmegaphone:client:toggle')
end, false)

RegisterKeyMapping(settings.command, settings.description, 'keyboard', settings.key)

RegisterNetEvent('lenix_patrolmegaphone:client:toggle', function()
    if not isEmergencyVehicle() then
        exports['qb-core']:Notify(settings.locales.refused, 'error', 5000)
        return
    end
    
    if canUseMic then
        isMicActive = not isMicActive
        if isMicActive then
            applyMicFilter()
            exports["pma-voice"]:overrideProximityRange(longVoiceRange, true)
            isToggleOn = true
            Bridge.drawtext.show('J', settings.locales.on)
            vehicleCheckLoop()
        else
            deactivateMic()
        end
    else
        exports['qb-core']:Notify(settings.locales.unavailable, 'error', 3000)
    end
end)