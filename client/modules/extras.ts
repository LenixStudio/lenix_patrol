import { fatal, trace } from '@trippler/tr_lib/shared'
import { triggerNuiCallback } from '@trippler/tr_lib/client'
import { config } from '../../shared/constants'
import { getState, setState } from '../states'

const UnAvailableExtras: boolean[] = []
const ActiveExtras: boolean[] = []
const InActiveExtras: boolean[] = []

const openDamageCheck = () => {
  if (config.ignoreVehicleState) return false
  if (IsVehicleDamaged(getState.vehicleHandle)) {
    if (getState.remoteBusy) {
      triggerNuiCallback('close', false)
      SetNuiFocus(false, false)
      setState.remoteBusy(false)
      return 1
    } else return 2
  } else return false
}

export const notify = (text: string, type?: string) => {
  SetNotificationTextEntry("STRING")
  AddTextComponentString(text)
  DrawNotification(false, false)
}

export const ToggleDamageCheck = (isExtraOn: boolean, extraNum: number, cb: Function) => {
  if (!config.ignoreVehicleState && IsVehicleDamaged(getState.vehicleHandle)) {
    if (!isExtraOn) {
      notify(config.notify.error.damaged, 'error')
      cb({
        success: false,
        error: "Veh damaged"
      })
    } else {
      SetVehicleExtra(getState.vehicleHandle, extraNum, isExtraOn)
      const newState = !isExtraOn
      trace(`Extra ${extraNum} ${isExtraOn ? "disabled" : "enabled"}`)
      cb({
        success: true,
        extraNum: extraNum,
        isActive: newState
      })
    }
  } else {
    SetVehicleExtra(getState.vehicleHandle, extraNum, isExtraOn)
    const newState = !isExtraOn
    trace(`Extra ${extraNum} ${isExtraOn ? "disabled" : "enabled"}`)
    cb({
      success: true,
      extraNum: extraNum,
      isActive: newState
    })
  }
}

export const checkVehicleExtras = () => {
  for (let i = 1; i <= 12; i++) {
    ActiveExtras[i] = IsVehicleExtraTurnedOn(getState.vehicleHandle, i) ? true : false
    InActiveExtras[i] = !IsVehicleExtraTurnedOn(getState.vehicleHandle, i)
    UnAvailableExtras[i] = !DoesExtraExist(getState.vehicleHandle, i)
  }
}

export const toggleRemote = (): void => {
  if (!getState.vehicleBusy) return
  if (openDamageCheck() == 1) return notify(config.notify.success.closed, 'success')
  if (openDamageCheck() == 2) return notify(config.notify.error.damaged, 'error')
  if (openDamageCheck() == false) {
    setState.remoteBusy(!getState.remoteBusy)
    if (getState.remoteBusy) {
      checkVehicleExtras()
      triggerNuiCallback('open', {
        unAvailableExtras: UnAvailableExtras,
        activeExtras: ActiveExtras,
        inActiveExtras: InActiveExtras,
        sirenOn: true
      })
      setState.remoteBusy(true)
    } else {
      SetNuiFocus(false, false)
      triggerNuiCallback('close', false)
      setState.remoteBusy(false)
    }
  } else fatal('Something unexpected happend')
}

export const toggleCursor = () => {
  setTimeout(() => {
    if (getState.remoteBusy) SetNuiFocus(true, true)
    else SetNuiFocus(false, false)
  }, 200)
}