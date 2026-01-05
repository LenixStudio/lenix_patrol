import { onPromise } from "@trippler/tr_lib/client"
import { checkVehicleExtras, toggleRemote, toggleCursor } from "../modules/extras"

const getVehicleClass = () => GetVehicleClass(GetVehiclePedIsIn(PlayerPedId(), false))

onPromise('getVehicleClass', getVehicleClass)

onNet('lenix_patrolextras:client:checkVehicleExtras', checkVehicleExtras)

onNet('lenix_patrolextras:client:toggleRemote', toggleRemote)
onNet('lenix_patrolextras:client:toggleCursor', toggleCursor)
exports('toggleRemote', toggleRemote)
exports('toggleCursor', toggleCursor)

export type VehicleClass = ReturnType<typeof getVehicleClass>