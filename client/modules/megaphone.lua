local config<const> = require 'shared/constants/index'
local Bridge<const> = require 'client/api/megaphone/index'
local state<const> = require 'client/states'

local megaphone<const> = config.megaphone
local longVoiceRange<const> = megaphone.range
local VehicleModels<const> = megaphone.vehicleModels
local VehicleClasses<const> = megaphone.vehicleClass

local function removeMicFilter()
  MumbleSetSubmixForServerId(PlayerId(), -1)
end

local function applyMicFilter()
  if state.getState.micFilter then 
    MumbleSetSubmixForServerId(PlayerId(), state.getState.micFilter) 
  end
end

local function isEmergencyVehicle()
  local playerPed<const> = PlayerPedId()
  if IsPedInAnyVehicle(playerPed, false) then
    local vehicle<const> = GetVehiclePedIsIn(playerPed, false)
    local vehicleClass<const> = GetVehicleClass(vehicle)
    local vehicleModel<const> = GetEntityModel(vehicle)
    
    if VehicleModels[vehicleModel] then
      state.setState.micNotBusy(true)
      return true
    end
    return VehicleClasses[vehicleClass] or false
  end
  return false
end

local function deactivateMic()
  removeMicFilter()
  Bridge.voice.clearProximityOverride()
  state.setState.micBusy(false)
  state.setState.micCurrentlyBusy(false)
  SetTimeout(1000, function() Bridge.drawtext.hide() end)
  Bridge.drawtext.show(nil, megaphone.locales.off)
end

local function vehicleCheckLoop()
  CreateThread(function()
    while state.getState.micBusy do
      if not isEmergencyVehicle() then
        state.setState.micNotBusy(false)
        state.setState.micBusy(false)
        Bridge.notify(megaphone.locales.left, 'warning', 7500)
        deactivateMic()
        break
      end
      Wait(500)
    end
  end)
end

local function toggleMegaphone()
  if not isEmergencyVehicle() then
    Bridge.notify(megaphone.locales.refused, 'error', 5000)
    return
  end

  if state.getState.micNotBusy then
    state.setState.micCurrentlyBusy(not state.getState.micCurrentlyBusy)
    if state.getState.micCurrentlyBusy then
      applyMicFilter()
      Bridge.voice.overrideProximityRange(longVoiceRange, true)
      state.setState.micBusy(true)
      Bridge.drawtext.show('J', megaphone.locales.on)
      vehicleCheckLoop()
    else
      deactivateMic()
    end
  else
    Bridge.notify(megaphone.locales.unavailable, 'error', 3000)
  end
end

local function createMicFilter()
  local submix<const> = CreateAudioSubmix("lenix_patrolmegaphone")
  state.setState.micFilter(submix)
  if submix then
    SetAudioSubmixEffectRadioFx(submix, 0)
    SetAudioSubmixEffectParamInt(submix, 0, GetHashKey('default'), 1)
    AddAudioSubmixOutput(submix, 0)
  end
end

return {
  toggleMegaphone = toggleMegaphone,
  createMicFilter = createMicFilter,
  isEmergencyVehicle = isEmergencyVehicle,
  deactivateMic = deactivateMic
}