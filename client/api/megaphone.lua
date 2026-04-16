local megaphoneMod<const> = require 'client/modules/megaphone'

local Bridge<const> = {
  drawtext = {
    show = function(key, text)
      lib.info('you haven\'t set your drawtext function yet :(')
    end,
    hide = function()
      lib.info('you haven\'t set your drawtext function yet :(')
    end,
  },
  voice = {
    clearProximityOverride = function()
      exports["pma-voice"]:clearProximityOverride()
    end,
    overrideProximityRange = function(range, _)
      exports["pma-voice"]:overrideProximityRange(range, _)
    end
  },
  notify = function(message, type, duration)
    exports['qb-core']:Notify(message, type, duration)
  end
}

RegisterNetEvent('lenix_patrolmegaphone:client:toggle', function()
  megaphoneMod.toggleMegaphone()
end)

return Bridge