local extras<const> = require 'client/modules/extras'
local state<const> = require 'client/states'

lib.onNuiCallback('toggle', function(data, cb)
  if not state.getState.vehicleBusy then return end

  SetTimeout(0, function()
    local extraNum<const> = data.num or 1
    local isExtraOn<const> = IsVehicleExtraTurnedOn(state.getState.vehicleHandle, extraNum)
    extras.ToggleDamageCheck(isExtraOn, extraNum, cb)
  end)
end)