fx_version 'cerulean'
game 'gta5'
lua54 'yes'
dependencies {
  'tr_lib',
  'pma-voice',
  'qb-core',
  'lenix_fusion',
}

author 'Trippler'
docs 'https://docs.trippler.store'
version '1.0.1'

client_scripts {
  'client/main.lua',
}
server_script 'server/main.lua'
files {
  'config/client.lua',
}

escrow_ingore {
  'config/client.lua',
}