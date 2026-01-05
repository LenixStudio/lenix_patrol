import { fatal, trace } from '@trippler/tr_lib/shared'
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/client'
import { config } from '../../shared/constants'

const notify = (text: string, type?: string) =>{
  SetNotificationTextEntry("STRING")
  AddTextComponentString(text)
  DrawNotification(false, false)
}

const remote = config.controls.toggleRemote
const cursor = config.controls.toggleCursor
const UnAvailableExtras: boolean[] = []
const ActiveExtras: boolean[] = []
const InActiveExtras: boolean[] = []
let isUiOpen = false
let inVehicle = false
let vehicle: number = 0

RegisterCommand('lenix_patrolextras_debug', () => {
  if (inVehicle) checkVehicleExtras()
  else notify('get in the vehicle')
}, config.debug ? false : true)

const checkVehicleExtras = () => {
  for (let i = 1; i <= 12; i++) {
    ActiveExtras[i] = IsVehicleExtraTurnedOn(vehicle, i) ? true : false
    InActiveExtras[i] = !IsVehicleExtraTurnedOn(vehicle, i)
    UnAvailableExtras[i] = !DoesExtraExist(vehicle, i)
  }
}

const openDamageCheck = () => {
  if (config.ignoreVehicleState) return false
  if (IsVehicleDamaged(vehicle)) {
    if (isUiOpen) {
      triggerNuiCallback('close', false)
      SetNuiFocus(false, false)
      isUiOpen = false
      return 1
    } else return 2
  } else return false
}

const ToggleDamageCheck = (isExtraOn: boolean, extraNum: number, cb: Function) => {
  if (!config.ignoreVehicleState && IsVehicleDamaged(vehicle)) {
    if (!isExtraOn) {
      notify(config.notify.error.damaged, 'error')
      cb({
        success: false,
        error: "Veh damaged"
      })
    } else {
      SetVehicleExtra(vehicle, extraNum, isExtraOn)
      const newState = !isExtraOn
      trace(`Extra ${extraNum} ${isExtraOn ? "disabled" : "enabled"}`)
      cb({
        success: true,
        extraNum: extraNum,
        isActive: newState
      })
    }
  } else {
    SetVehicleExtra(vehicle, extraNum, isExtraOn)
    const newState = !isExtraOn
    trace(`Extra ${extraNum} ${isExtraOn ? "disabled" : "enabled"}`)
    cb({
      success: true,
      extraNum: extraNum,
      isActive: newState
    })
  }
}

const toggleRemote = (): void => {
  if (!inVehicle) return
  if (openDamageCheck() == 1) return notify(config.notify.success.closed, 'success')
  if (openDamageCheck() == 2) return notify(config.notify.error.damaged, 'error')
  if (openDamageCheck() == false) {
    isUiOpen = !isUiOpen
    if (isUiOpen) {
        checkVehicleExtras()
        triggerNuiCallback('open', {
          unAvailableExtras: UnAvailableExtras,
          activeExtras: ActiveExtras,
          inActiveExtras: InActiveExtras,
          sirenOn: true
        })
        isUiOpen = true
    } else {
      SetNuiFocus(false, false)
      triggerNuiCallback('close', false)
      isUiOpen = false
    }
  } else fatal('Something unexpected happend')
}

const toggleCursor = () => {
  setTimeout(() => {
    if (isUiOpen) SetNuiFocus(true, true)
    else SetNuiFocus(false, false)
  }, 200)
}

onNet('lenix_patrolextras:client:checkVehicleExtras', checkVehicleExtras)

onNuiCallback<{ num: number }>('toggle', (data, cb) => {
  if (!inVehicle) return
  setTimeout(() => {
      const extraNum = data.num || 1
      const isExtraOn = IsVehicleExtraTurnedOn(vehicle, extraNum)
      ToggleDamageCheck(isExtraOn, extraNum, cb)
  })
})

RegisterCommand(remote.commands.command, remote.commands.enabled ? toggleRemote : () => {}, false)
RegisterCommand(cursor.commands.command, cursor.commands.enabled ? toggleCursor : () => {}, false)

RegisterKeyMapping(remote.commands.command, remote.description, 'keyboard', remote.key)
RegisterKeyMapping(cursor.commands.command, cursor.description, 'keyboard', cursor.key)

onNet('lenix_patrolextras:client:toggleRemote', toggleRemote)
onNet('lenix_patrolextras:client:toggleCursor', toggleCursor)
exports('toggleRemote', toggleRemote)
exports('toggleCursor', toggleCursor)

setImmediate(async () => {
  let lastSirenState
  while (true) {
    const Veh = GetVehiclePedIsIn(PlayerPedId(), false)
    if (Veh != 0) {
      inVehicle = true
      const currentSirenState = IsVehicleSirenOn(Veh)
      if (lastSirenState == null || currentSirenState != lastSirenState) {
        triggerNuiCallback('sirenCheck', currentSirenState)
        lastSirenState = currentSirenState
      }
    } else if (isUiOpen) {
      vehicle = 1
      setTimeout(() => {
        toggleRemote()
      }, 400)
      setTimeout(() => {
        vehicle = 0
      }, 400)
    }
    inVehicle = false
    lastSirenState = null
    await new Promise(resolve => setTimeout(resolve, 200))
  }
})