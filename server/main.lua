RegisterNetEvent('lenix_patrolmegaphone:applySubmix', function(bool)
    TriggerClientEvent('lenix_patrolmegaphone:updateSubmixStatus', -1, bool, source)
end)