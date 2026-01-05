fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib'
}

author 'https://github.com/LenixDev'
version '1.0.5'

shared_scripts {
  '@tr_lib/index.lua',
}

client_scripts {
  'client/bridge.lua',
  'config/client.lua',
  'client/main.lua',
}
server_script 'server/main.lua'
ui_page 'web/index.html'
file 'web/**'