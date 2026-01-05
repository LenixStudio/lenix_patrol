import { megaphone } from "../../shared/constants"
import { Bridge } from "../api/megaphone"
import { getState, setState } from "../states"

const longVoiceRange = megaphone.range
const VehicleModels = megaphone.vehicleModels
const VehicleClasses = megaphone.vehicleClass

const removeMicFilter = () => MumbleSetSubmixForServerId(PlayerId(), -1)

export const toggleMegaphone = () => {
  if (!isEmergencyVehicle()) {
    Bridge.notify(megaphone.locales.refused, 'error', 5000)
    return
  }

  if (getState.micNotBusy) {
    setState.micCurrentlyBusy(!getState.micNotBusy)
    if (getState.micCurrentlyBusy) {
      applyMicFilter()
      Bridge.voice.overrideProximityRange(longVoiceRange, true)
      setState.micBusy(true)
      Bridge.drawtext.show('J', megaphone.locales.on)
      vehicleCheckLoop()
    } else {
      deactivateMic()
    }
  } else {
    Bridge.notify(megaphone.locales.unavailable, 'error', 3000)
  }
}

export const createMicFilter = () => {
  setState.micFilter(CreateAudioSubmix("lenix_patrolmegaphone"))
  if (getState.micFilter) {
    SetAudioSubmixEffectRadioFx(getState.micFilter, 0)
    SetAudioSubmixEffectParamInt(getState.micFilter, 0, 'default', 1)
    AddAudioSubmixOutput(getState.micFilter, 0)
  }
}

export const isEmergencyVehicle = () => {
  const playerPed = PlayerPedId()
  if (IsPedInAnyVehicle(playerPed, false)) {
    const vehicle = GetVehiclePedIsIn(playerPed, false)
    const vehicleClass = GetVehicleClass(vehicle)
    const vehicleModel = GetEntityModel(vehicle)
    
    if (VehicleModels[vehicleModel]) {
      setState.micNotBusy(true)
      return true
    }
    return (VehicleClasses[vehicleClass] || false)
  }
  return false
}

export const applyMicFilter = () => {
  if (getState.micFilter) MumbleSetSubmixForServerId(PlayerId(), getState.micFilter)
}

export const vehicleCheckLoop = () => {
  setImmediate(async () => {
    while (getState.micBusy) {
      if (!isEmergencyVehicle()) {
        setState.micNotBusy(false)
        setState.micBusy(false)
        Bridge.notify(megaphone.locales.left, 'warning', 7500)
        deactivateMic()
        break
      }
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  })
}

export const deactivateMic = () => {
  removeMicFilter()
  Bridge.voice.clearProximityOverride()
  setState.micBusy(false)
  setState.micCurrentlyBusy(false)
  setTimeout(() => Bridge.drawtext.hide(), 1000)
  Bridge.drawtext.show(null, megaphone.locales.off)
}