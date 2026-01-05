import { nuiFocus } from "@trippler/tr_lib/nui"

export const dom = {
  root: document.getElementById('root'),
  get container() { return document.getElementById('draggable-container') },
  get grid() { return document.getElementById('extras-grid') },
  get dragHandle() { return document.getElementById('drag-handle') },
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') nuiFocus(false, false)
})

window.addEventListener('resize', () => {
  const container = dom.container
  if (!container || container.style.display === 'none') return
  
  let newTop = parseInt(container.style.top) || 0
  let newLeft = parseInt(container.style.left) || 0
  
  newTop = Math.max(0, Math.min(newTop, window.innerHeight - container.offsetHeight))
  newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - container.offsetWidth))
  
  container.style.top = `${newTop}px`
  container.style.left = `${newLeft}px`

  storage.save(newTop, newLeft)
})