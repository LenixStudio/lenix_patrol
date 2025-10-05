fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'pma-voice',
  'qb-core',
  'tr_fusion'
}

author 'Trippler hub'
description 'An enhanced script that make the game more realistic when a patrol hit the mic button to speak to the outside of the car'
version '1.0.0'

client_scripts {
  'client/main.lua',
  'client/config.lua',
}
server_script 'server/main.lua'

escrow_ingore {
  'config/*.lua'
}