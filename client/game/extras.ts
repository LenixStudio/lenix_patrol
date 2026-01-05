import { triggerNuiCallback } from "@trippler/tr_lib/client"
import { config } from "../../shared/constants"
import {checkVehicleExtras, toggleRemote, toggleCursor, notify } from "../modules/extras"
import { getState, setState } from "../states"

const remote = config.controls.toggleRemote
const cursor = config.controls.toggleCursor

RegisterCommand('lenix_patrolextras_debug', () => {
  if (getState.vehicleBusy) checkVehicleExtras()
  else notify('get in a vehicle')
}, config.debug ? false : true)


RegisterCommand(remote.commands.command, remote.commands.enabled ? toggleRemote : () => { }, false)
RegisterCommand(cursor.commands.command, cursor.commands.enabled ? toggleCursor : () => { }, false)

RegisterKeyMapping(remote.commands.command, remote.description, 'keyboard', remote.key)
RegisterKeyMapping(cursor.commands.command, cursor.description, 'keyboard', cursor.key)

setImmediate(async () => {
  let lastSirenState
  while (true) {
    const Veh = GetVehiclePedIsIn(PlayerPedId(), false)
    if (Veh != 0) {
      setState.vehicleBusy(true) 
      const currentSirenState = IsVehicleSirenOn(Veh)
      if (lastSirenState == null || currentSirenState != lastSirenState) {
        triggerNuiCallback('sirenCheck', currentSirenState)
        lastSirenState = currentSirenState
      }
    } else if (getState.remoteBusy) {
      setState.vehicleHandle(1)
      setTimeout(() => {
        toggleRemote()
      }, 400)
      setTimeout(() => {
        setState.vehicleHandle(0)
      }, 400)
    }
    setState.vehicleBusy(false)
    lastSirenState = null
    await new Promise(resolve => setTimeout(resolve, 200))
  }
})