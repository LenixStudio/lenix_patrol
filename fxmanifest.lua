fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'

client_scripts {
  'config/client.lua',
  'client/main.lua',
}
server_script 'server/main.lua'
ui_page 'web/build/index.html'
file 'web/build/*.*'

escrow_ignore {
  'config/*.lua'
}