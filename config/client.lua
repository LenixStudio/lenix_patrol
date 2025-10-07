Option = {}

Option.Range = 30.0
Option.Command = 'togglemic'
Option.Key = 'J'
Option.Description = 'Toggle Patrol\'s Mic'
Option.Locales = {
    On = 'Activated',
    Off = 'Deactivated',
    Left = 'You left the emergency vehicle, mic turned off!',
    Refused = 'You must be in an emergency vehicle to use the patrol mic!',
    Unavailable = 'Patrol mic is not available right now!',
}

Option.VehicleClass = {
    [18] = true,
}

Option.VehicleModels = {
    [`ambulance`] = true,
    [`firetruk`] = true,
    [`police`] = true,
    [`police2`] = true,
    [`police3`] = true,
}