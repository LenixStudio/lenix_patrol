fx_version 'cerulean'
game 'gta5'

author 'https://github.com/LenixDev'
version '3.0.1'

dependencies {
  'qb-core',
  'pma-voice',
  'tr_lib'
}

shared_script '@tr_lib/index.lua'

client_script 'client/index.lua'
server_script 'server/index.lua'

ui_page 'nui/public/index.html'

files {
  'nui/public/index.html',
  'build/nui.js',
  'client/**/*.lua',
  'server/**/*.lua',
  'shared/**/*.lua'
}