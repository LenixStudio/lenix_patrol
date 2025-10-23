local lib = exports.tr_lib
AddEventHandler('entityCreated', function(handle)
  local vehicleClass = lib.callback().awaitClient('getVehicleClass', NetworkGetEntityOwner(handle), 1000, handle)
  if GetEntityType(handle) == 2 and vehicleClass == 18 then
    TriggerClientEvent('tr_patrolextras:client:checkVehicleExtras')
  end
end)