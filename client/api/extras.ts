import { onPromise } from "@trippler/tr_lib/client"

const getVehicleClass = () => GetVehicleClass(GetVehiclePedIsIn(PlayerPedId(), false))

onPromise('getVehicleClass', () => {
  return getVehicleClass
})

export type VehicleClass = ReturnType<typeof getVehicleClass>