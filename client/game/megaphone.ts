import { megaphone } from "../../shared/constants"
import { createMicFilter } from "../modules/megaphone"

setImmediate(() => {
  createMicFilter()
})

RegisterCommand(megaphone.command, () => {
  emit('lenix_patrolmegaphone:client:toggle')
}, false)

RegisterKeyMapping(megaphone.command, megaphone.description, 'keyboard', megaphone.key)