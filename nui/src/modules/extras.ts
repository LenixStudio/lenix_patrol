import { dom } from "../dom"
import { state } from "../states"

const storage = {
  save(top: number, left: number) {
    try {
      const position = { top, left }
      localStorage.setItem('panel-position', JSON.stringify(position))
    } catch (error) {
      console.error('Failed to save position:', error)
    }
  },

  load() {
    try {
      const saved = localStorage.getItem('panel-position')
      if (saved) {
        return JSON.parse(saved)
      }
      return { top: null, left: null }
    } catch (error) {
      console.error('Failed to load position:', error)
      return { top: null, left: null }
    }
  }
}
const makeDraggable = () => {
  const container = dom.container
  const dragHandle = dom.dragHandle
  if (!dragHandle || !container) return

  let pos = { x1: 0, y1: 0, x2: 0, y2: 0 }

  dragHandle.onmousedown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    state.isDragging = true
    pos.x2 = e.clientX
    pos.y2 = e.clientY

    dragHandle.style.cursor = 'grabbing'
    container.style.userSelect = 'none'

    document.onmousemove = handleDrag
    document.onmouseup = stopDrag
  }

  const handleDrag = (e: MouseEvent) => {
    if (!state.isDragging) return

    e.preventDefault()
    pos.x1 = pos.x2 - e.clientX
    pos.y1 = pos.y2 - e.clientY
    pos.x2 = e.clientX
    pos.y2 = e.clientY

    let newTop = container.offsetTop - pos.y1
    let newLeft = container.offsetLeft - pos.x1

    newTop = Math.max(0, Math.min(newTop, window.innerHeight - container.offsetHeight))
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - container.offsetWidth))

    container.style.top = `${newTop}px`
    container.style.left = `${newLeft}px`
  }

  const stopDrag = () => {
    if (state.isDragging) {
      const top = parseInt(container.style.top) || 0
      const left = parseInt(container.style.left) || 0
      storage.save(top, left)
    }

    state.isDragging = false
    document.onmouseup = null
    document.onmousemove = null
    dragHandle.style.cursor = 'grab'
    container.style.userSelect = ''
  }
}

const createExtraButton = (extraNum: number) => {
  const button = document.createElement('button')
  button.className = 'extra-button'
  button.id = `extra-${extraNum}`

  const content = document.createElement('span')
  content.className = 'button-content'
  content.innerHTML = `${extraNum}`
  button.appendChild(content)

  const isUnavailable = state.unAvailableExtras[extraNum - 1]
  const isActive = state.activeExtras[extraNum - 1]
  const isInactive = state.inActiveExtras[extraNum - 1]

  if (isUnavailable) {
    button.classList.add('unavailable')
    button.disabled = true
  } else {
    if (isActive) {
      button.classList.add('active')
      if (state.isSirenOn) button.classList.add('siren-mode')
    } else if (isInactive) {
      button.classList.add('inactive', 'pulse-inactive')
    }
    button.addEventListener('click', () => toggleExtra(extraNum))
  }

  return button
}

const toggleExtra = (extraNum: number) => {
  if (state.isDragging) return

  fetch(`https://${GetParentResourceName()}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num: extraNum })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) return

      const button = document.getElementById(`extra-${extraNum}`)
      const index = extraNum - 1
      if (!button) return
      if (data.isActive) {
        button.classList.remove('inactive', 'pulse-inactive')
        button.classList.add('active')
        if (state.isSirenOn) button.classList.add('siren-mode')

        state.activeExtras[index] = true
        state.inActiveExtras[index] = false
      } else {
        button.classList.remove('active', 'siren-mode')
        button.classList.add('inactive', 'pulse-inactive')

        state.activeExtras[index] = false
        state.inActiveExtras[index] = true
      }

      updateStatusCounts()
    })
    .catch(err => console.error('Error toggling extra:', err))
}

export const updateSirenIndicators = () => {
  document.querySelectorAll('.extra-button.active').forEach(button => {
    button.classList.toggle('siren-mode', state.isSirenOn)
  })
}

const updateStatusCounts = () => {
  const inactiveCount = state.inActiveExtras.filter((isInactive, index) => {
    return isInactive && !state.unAvailableExtras[index]
  }).length
  const activeCount = document.getElementById('active-count')
  const inActiveCount = document.getElementById('inactive-count')
  const unavailableCount = document.getElementById('unavailable-count')

  if (!activeCount || !inActiveCount || !unavailableCount) return
  activeCount.textContent = `${state.activeExtras.filter(Boolean).length} Active`
  inActiveCount.textContent = `${inactiveCount} Inactive`
  unavailableCount.textContent = `${state.unAvailableExtras.filter(Boolean).length} Unavailable`
}

const setContainerPosition = () => {
  const container = dom.container
  if (!container) return
  const savedPos = storage.load()

  // Always validate bounds, even for saved positions
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const containerHeight = container.offsetHeight
  const containerWidth = container.offsetWidth

  let top, left

  if (savedPos.top !== null && savedPos.left !== null) {
    // Use saved position but validate it's within bounds
    top = Math.max(0, Math.min(savedPos.top, viewportHeight - containerHeight - 20))
    left = Math.max(0, Math.min(savedPos.left, viewportWidth - containerWidth - 20))
  } else {
    // Default to bottom-right corner with padding
    top = viewportHeight - containerHeight - 420
    left = viewportWidth - containerWidth - 340
  }

  // Final safety check - ensure values are valid
  top = Math.max(0, top)
  left = Math.max(0, left)

  container.style.top = `${top}px`
  container.style.left = `${left}px`
}

export const initializeUI = () => {
  const grid = dom.grid
  if (grid) {
    grid.innerHTML = ''
    for (let i = 1; i <= 12; i++) {
      grid.appendChild(createExtraButton(i))
    }
  }

  updateStatusCounts()

  setContainerPosition()
  makeDraggable()
}

export const fadeIn = () => {
  if (!dom.root) return
  const element = dom.root
  if (!element) return
  element.style.display = 'flex'
  element.style.opacity = '0'
  element.style.transition = 'opacity 0.3s ease'

  requestAnimationFrame(() => {
    element.style.opacity = '1'
  })
}

export const fadeOut = () => {
  if (!dom.root) return
  const element = dom.root
  element.style.transition = 'opacity 0.3s ease'
  element.style.opacity = '0'

  setTimeout(() => {
    element.style.display = 'none'
    element.style.transition = ''
  }, 300)
}