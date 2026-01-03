# lenix_patrolextras
Remote to control the patrol's extras, designed for cars that has configurable siren from the extras

## Imports

### Exports
### toggleRemote
```lua
exports.tr_patrolextras:toggleRemote()
```

### toggleCursor
```lua
exports.tr_patrolextras:toggleCursor()
```

### Events
### toggleRemote
```lua
TriggerEvent('tr_patrolextras:client:toggleRemote')
```

### toggleCursor
```lua
TriggerEvent('tr_patrolextras:client:toggleCursor')
```

## Config
```lua
  return {
      -- false: if the patrol is damaged, the officer won't be able to use some buttons
      ignoreVehicleState = false,
      -- enable the debuging command mode
      debug = false,
      -- notification locales
      notify = {
          error = {
              damaged = "Vehicle's sirens are damaged",
          },
          success = {
              closed = "Remote has been successfully turned off"
          },
      },
      -- user interactions
      controls = {
          toggleRemote = {
              commands = {
                  enabled = true,
                  command = 'extra_toggle_remote'
              },
              key = 'J',
              description = 'Toggle Patrol Extra\'s Remote'
          },
          -- configure the keybinds settings
          toggleCursor = {
              commands = {
                  enabled = true,
                  command = 'extra_toggle_cursor'
              },
              key = 'F11',
              description = 'Toggle Patrol Extra Cursor',
          }
      }
  }
```
