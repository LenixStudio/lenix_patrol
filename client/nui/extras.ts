import { onNuiCallback } from "@trippler/tr_lib/client"
import { ToggleDamageCheck } from "../modules/extras"
import { getState } from "../states"

onNuiCallback<{ num: number }>('toggle', (data, cb) => {
  if (!getState.vehicleBusy) return
  setTimeout(() => {
    const extraNum = data.num || 1
    const isExtraOn = IsVehicleExtraTurnedOn(getState.vehicleHandle, extraNum)
    ToggleDamageCheck(isExtraOn, extraNum, cb)
  })
})