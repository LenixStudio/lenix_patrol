import { triggerPromise } from '@trippler/tr_lib/server'
import { VehicleClass } from '../../shared/types'

on('entityCreated', async (handle: number) => {
  const source = NetworkGetEntityOwner(handle)
  const vehicleClass = await triggerPromise<VehicleClass>('getVehicleClass', source)

  const entityType = GetEntityType(handle) != null ? GetEntityType(handle) : null
  if (entityType && entityType == 2 && vehicleClass && vehicleClass == 18) {
    setTimeout(() => {
      emitNet('lenix_patrolextras:client:checkVehicleExtras', source, handle, vehicleClass)
    }, 500)
  }
})