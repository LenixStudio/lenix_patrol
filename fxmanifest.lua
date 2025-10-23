fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler'
docs 'https://docs.trippler.store'

client_scripts {
  'config/client.lua',
  'client/main.lua',
}
shared_script 'shared/utils.lua'
server_script 'server/main.lua'
ui_page 'web/index.html'
file 'web/**'

escrow_ignore {
  'config/main.lua'
}