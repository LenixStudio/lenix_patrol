fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib',
  'qb-core',
  'pma-voice',
}

author 'https://github.com/LenixDev'
version '1.0.5'

client_scripts {
  '@tr_lib/index.lua',
  'client/bridge.lua',
  'client/main.lua',
}
server_script 'server/main.lua'
files {
  'config/client.lua',
}