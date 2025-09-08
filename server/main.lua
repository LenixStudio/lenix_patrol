AddEventHandler('entityCreated', function(handle)
  if GetEntityType(handle) == 2 and GetVehicleClass(handle) == 18 then
    TriggerClientEvent('tr_patrolextras:client:checkVehicleExtras')
  end
end)