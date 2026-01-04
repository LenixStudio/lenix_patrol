# lenix_patrolextras
Remote to control the patrol's extras, designed for cars that has configurable siren from the extras

## About
<img width="321" height="408" alt="patrolextras1" src="https://github.com/user-attachments/assets/d489bb74-db72-41cc-921a-573da6001d53" />
<img width="321" height="405" alt="patrolextras2" src="https://github.com/user-attachments/assets/e5f95b00-c4c2-40b7-b5af-9465197c9305" />

## Imports

### Exports
### toggleRemote
```lua
exports.lenix_patrolextras:toggleRemote()
```

### toggleCursor
```lua
exports.lenix_patrolextras:toggleCursor()
```

### Events
### toggleRemote
```lua
TriggerEvent('lenix_patrolextras:client:toggleRemote')
```

### toggleCursor
```lua
TriggerEvent('lenix_patrolextras:client:toggleCursor')
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
