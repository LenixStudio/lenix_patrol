local config<const> = require 'shared/constants/index'
local extras<const> = require 'client/modules/extras'
local state<const> = require 'client/states'

local remote<const> = config.controls.toggleRemote
local cursor<const> = config.controls.toggleCursor

RegisterCommand('lenix_patrolextras_debug', function()
  if state.getState.vehicleBusy then 
    extras.checkVehicleExtras()
  else 
    extras.notify('get in a vehicle') 
  end
end, not config.debug)

RegisterCommand(remote.commands.command, function()
  if remote.commands.enabled then extras.toggleRemote() end
end, false)

RegisterCommand(cursor.commands.command, function()
  if cursor.commands.enabled then extras.toggleCursor() end
end, false)

RegisterKeyMapping(remote.commands.command, remote.description, 'keyboard', remote.key)
RegisterKeyMapping(cursor.commands.command, cursor.description, 'keyboard', cursor.key)

CreateThread(function()
  local lastSirenState = nil
  while true do
    local ped<const> = PlayerPedId()
    local veh<const> = GetVehiclePedIsIn(ped, false)
    
    if veh ~= 0 then
      state.setState.vehicleBusy(true)
      state.setState.vehicleHandle(veh)
      local currentSirenState<const> = IsVehicleSirenOn(veh)
      
      if lastSirenState == nil or currentSirenState ~= lastSirenState then
        lib.triggerNuiCallback('sirenCheck', currentSirenState)
        lastSirenState = currentSirenState
      end
    else
      if state.getState.remoteBusy then
        state.setState.vehicleHandle(1) -- Temporary handle for logic
        SetTimeout(400, function()
          extras.toggleRemote()
          state.setState.vehicleHandle(0)
        end)
      end
      state.setState.vehicleBusy(false)
      lastSirenState = nil
    end
    Wait(200)
  end
end)