return {
    ignoreVehicleState = false,
    debug = true,
    notify = {
        error = {
            damaged = "Vehicle's sirens are damaged",
        },
        success = {
            closed = "Remote have been successfuly turn off"
        },
    },
    controls = {
        toggleRemote = {
            commands = {
                enabled = true,
                command = 'extra_toggle_remote'
            },
            key = 'J',
            description = 'Toggle Patrol Extra\'s Remote'
        },
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