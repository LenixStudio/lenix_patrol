# lenix_patrolmegaphone
Patrol microphone designed for police officers

# About
### Introduction
Welcome to Patrol Megaphone.

This script is designed to enhance your server's gameplay by:
* A Microphone comes integrated with your patrol vehicle so your officers can talk to anyone loudly just from the their patrol.

### Instructions
* Installation: drag and drop
* Environment: QB
* Support: available

> Enjoy your improved gaming experience with Patrol Megaphone!

# Config

## Configuration

```lua
return {
    ---@field Range number Voice transmission range in units when microphone is active
    range = 30.0,
    ---@field Command string Chat command to toggle microphone on/off
    command = 'togglemic',
    ---@field Key string Default keybind for microphone toggle
    key = 'K',
    ---@field Description string Help text displayed for the keybind/command
    description = 'Toggle Patrol\'s Mic',
    ---field Locales in string update your translation
    locales = {
        on = 'Activated',
        off = 'Deactivated',
        left = 'You left the emergency vehicle, mic turned off!',
        refused = 'You must be in an emergency vehicle to use the patrol mic!',
        unavailable = 'Patrol mic is not available right now!',
    },
    
    vehicleClass = {
        [18] = true, -- Emergency vehicles
    },
    -- or
    vehicleClass = {}  -- Disable class-based authorization
    
    ---@field VehicleModels table Specific vehicle models eligible for microphone system (by hash)
    vehicleModels = {
        [`ambulance`] = true,
        [`firetruk`] = true,
        [`police`] = true,
        [`police2`] = true,
        [`police3`] = true,
    }
}
```
