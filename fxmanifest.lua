fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler Hub'

client_scripts {
  'config/client.lua',
  'client/main.lua',
}
server_script 'server/main.lua'

ui_page 'web/index.html'
file 'web/src/*.*'

escrow_ignore {
  'config/*.lua'
}