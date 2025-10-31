lib = exports.tr_lib:require [[ @tr_lib/init ]]
local require<const> = function(arg) return lib.require(arg) end

function print()
    require('@tr_lib/print').print
end