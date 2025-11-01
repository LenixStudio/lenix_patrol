fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib'
}

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.0.2'

client_scripts {
  'client/bridge.lua',
  'config/client.lua',
  'client/main.lua',
}
server_script 'server/main.lua'
ui_page 'web/index.html'
file 'web/**'

escrow_ignore {
  'config/main.lua'
}