lib = exports.tr_lib:require [[@tr_lib/init]]

lib.callback.register('getVehicleClass', function()
    return GetVehicleClass(GetVehiclePedIsIn(PlayerPedId(), false))
end)

function notify(text, type)
    SetNotificationTextEntry("STRING")
    AddTextComponentString(text)
    DrawNotification(false, false)
end