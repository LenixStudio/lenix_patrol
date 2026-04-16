AddEventHandler('entityCreated', function(handle)
  local source<const> = NetworkGetEntityOwner(handle)
  
  CreateThread(function()
    local success, vehicleClass = lib.triggerPromise('getVehicleClass', source)
    local entityType<const> = GetEntityType(handle)

    if entityType == 2 and vehicleClass == 18 then
      SetTimeout(500, function()
        TriggerClientEvent('lenix_patrolextras:client:checkVehicleExtras', source, handle, vehicleClass)
      end)
    end
  end)
end)