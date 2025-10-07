RegisterNetEvent('tr_patrolmegaphone:applySubmix', function(bool)
    TriggerClientEvent('tr_patrolmegaphone:updateSubmixStatus', -1, bool, source)
end)