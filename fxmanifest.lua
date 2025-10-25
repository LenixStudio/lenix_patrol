fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'pma-voice',
  'qb-core',
  'lenix_fusion',
  'tr_lib'
}

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.0.0'

client_scripts {
  'client/utils.lua',
  'client/main.lua',
}
server_script 'server/main.lua'
files {
  'config/client.lua',
}

escrow_ingore {
  'config/client.lua',
}