RegisterNetEvent('lenix_patrolmegaphone:applySubmix', function(bool)
  local src<const> = source
  TriggerClientEvent('lenix_patrolmegaphone:updateSubmixStatus', -1, bool, src)
end)