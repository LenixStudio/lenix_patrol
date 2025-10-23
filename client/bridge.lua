local lib = exports.tr_lib

function notify(text, type)
    SetNotificationTextEntry("STRING")
    AddTextComponentString(text)
    DrawNotification(false, false)
end

lib.callback().register('getVehicleClass', function(handle)
    return GetVehicleClass(handle)
end)