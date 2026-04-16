local extrasMod<const> = require 'client/modules/extras'

local function getVehicleClass()
  return GetVehicleClass(GetVehiclePedIsIn(PlayerPedId(), false))
end

lib.onPromise('getVehicleClass', function()
  return getVehicleClass()
end)

RegisterNetEvent('lenix_patrolextras:client:checkVehicleExtras', function()
  extrasMod.checkVehicleExtras()
end)

RegisterNetEvent('lenix_patrolextras:client:toggleRemote', function()
  extrasMod.toggleRemote()
end)

RegisterNetEvent('lenix_patrolextras:client:toggleCursor', function()
  extrasMod.toggleCursor()
end)

exports('toggleRemote', extrasMod.toggleRemote)
exports('toggleCursor', extrasMod.toggleCursor)

return {
  getVehicleClass = getVehicleClass
}