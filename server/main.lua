local lib = exports.tr_lib:require [[ @tr_lib/init ]]

AddEventHandler('entityCreated', function(handle)
  local source<const> = NetworkGetEntityOwner(handle)
  local vehicleClass = lib.callback.await('getVehicleClass', source, 1000)

  if GetEntityType(handle) == 2 and vehicleClass == 18 then
    Wait(500)
    TriggerClientEvent('tr_patrolextras:client:checkVehicleExtras', source, handle, vehicleClass)
  end
end)