fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib'
}

author 'https://github.com/LenixDev'
version '1.0.4'

client_scripts {
  'client/bridge.lua',
  'config/client.lua',
  'client/main.lua',
}
server_script 'server/main.lua'
ui_page 'web/index.html'
file 'web/**'