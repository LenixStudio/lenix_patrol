fx_version 'cerulean'
game 'gta5'
dependencies {
  'qb-core',
  'pma-voice',
}

author 'https://github.com/LenixDev'
version '3.0.0'

client_script 'build/client.js'
server_script 'build/server.js'

ui_page 'nui/public/index.html'
files {
  'nui/public/index.html',
  'build/nui.js'
}