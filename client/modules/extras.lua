local shared<const> = require '@trippler/tr_lib/shared'
local lib<const> = require '@trippler/tr_lib/client'
local config<const> = require 'shared/constants/index'
local state<const> = require 'client/states'

local UnAvailableExtras = {}
local ActiveExtras = {}
local InActiveExtras = {}

local function openDamageCheck()
  if config.ignoreVehicleState then return false end
  if IsVehicleDamaged(state.getState.vehicleHandle) then
    if state.getState.remoteBusy then
      lib.triggerNuiCallback('close', false)
      SetNuiFocus(false, false)
      state.setState.remoteBusy(false)
      return 1
    else 
      return 2 
    end
  else 
    return false 
  end
end

local function notify(text, type)
  SetNotificationTextEntry("STRING")
  AddTextComponentString(text)
  DrawNotification(false, false)
end

local function ToggleDamageCheck(isExtraOn, extraNum, cb)
  if not config.ignoreVehicleState and IsVehicleDamaged(state.getState.vehicleHandle) then
    if not isExtraOn then
      notify(config.notify.error.damaged, 'error')
      cb({ success = false, error = "Veh damaged" })
    else
      SetVehicleExtra(state.getState.vehicleHandle, extraNum, isExtraOn and 1 or 0)
      local newState<const> = not isExtraOn
      shared.trace(('Extra %d %s'):format(extraNum, isExtraOn and "disabled" or "enabled"))
      cb({ success = true, extraNum = extraNum, isActive = newState })
    end
  else
    SetVehicleExtra(state.getState.vehicleHandle, extraNum, isExtraOn and 1 or 0)
    local newState<const> = not isExtraOn
    shared.trace(('Extra %d %s'):format(extraNum, isExtraOn and "disabled" or "enabled"))
    cb({ success = true, extraNum = extraNum, isActive = newState })
  end
end

local function checkVehicleExtras()
  local veh<const> = state.getState.vehicleHandle
  for i = 1, 12 do
    ActiveExtras[i] = IsVehicleExtraTurnedOn(veh, i) == 1
    InActiveExtras[i] = not ActiveExtras[i]
    UnAvailableExtras[i] = not DoesExtraExist(veh, i)
  end
end

local function toggleRemote()
  if not state.getState.vehicleBusy then return end
  local check<const> = openDamageCheck()
  
  if check == 1 then return notify(config.notify.success.closed, 'success') end
  if check == 2 then return notify(config.notify.error.damaged, 'error') end
  
  if check == false then
    state.setState.remoteBusy(not state.getState.remoteBusy)
    if state.getState.remoteBusy then
      checkVehicleExtras()
      lib.triggerNuiCallback('open', {
        unAvailableExtras = UnAvailableExtras,
        activeExtras = ActiveExtras,
        inActiveExtras = InActiveExtras,
        sirenOn = true
      })
      state.setState.remoteBusy(true)
    else
      SetNuiFocus(false, false)
      lib.triggerNuiCallback('close', false)
      state.setState.remoteBusy(false)
    end
  else 
    shared.fatal('Something unexpected happened') 
  end
end

local function toggleCursor()
  SetTimeout(200, function()
    if state.getState.remoteBusy then SetNuiFocus(true, true)
    else SetNuiFocus(false, false) end
  end)
end

return {
  ToggleDamageCheck = ToggleDamageCheck,
  checkVehicleExtras = checkVehicleExtras,
  toggleRemote = toggleRemote,
  toggleCursor = toggleCursor,
  notify = notify
}