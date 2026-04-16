local config<const> = require 'shared/constants/index'
local megaphoneMod<const> = require 'client/modules/megaphone'

SetTimeout(0, function()
  megaphoneMod.createMicFilter()
end)

RegisterCommand(config.megaphone.command, function()
  TriggerEvent('lenix_patrolmegaphone:client:toggle')
end, false)

RegisterKeyMapping(config.megaphone.command, config.megaphone.description, 'keyboard', config.megaphone.key)