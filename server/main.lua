local lib = exports.tr_lib:require [[@tr_lib/get]]

AddEventHandler('entityCreated', function(handle)
  local source<const> = NetworkGetEntityOwner(handle)
  local vehicleClass = lib.callback.await('getVehicleClass', nil, source, 1000)

  local entityType = GetEntityType(handle) ~= nil and GetEntityType(handle) or nil
  if entityType and entityType == 2 and vehicleClass and vehicleClass == 18 then
    Wait(500)
    TriggerClientEvent('lenix_patrolextras:client:checkVehicleExtras', source, handle, vehicleClass)
  end
end)