// State management
const state = {
    unAvailableExtras: [],
    activeExtras: [],
    inActiveExtras: [],
    isSirenOn: false,
    isDragging: false
};

// DOM Cache
const dom = {
    root: document.getElementById('root'),
    get container() { return document.getElementById('draggable-container'); },
    get grid() { return document.getElementById('extras-grid'); },
    get dragHandle() { return document.getElementById('drag-handle'); }
};

// Storage utilities using localStorage
const storage = {
    save(top, left) {
        try {
            const position = { top, left };
            localStorage.setItem('panel-position', JSON.stringify(position));
        } catch (error) {
            console.error('Failed to save position:', error);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('panel-position');
            if (saved) {
                return JSON.parse(saved);
            }
            return { top: null, left: null };
        } catch (error) {
            console.error('Failed to load position:', error);
            return { top: null, left: null };
        }
    }
};

// UI Creation
function createHTML() {
    const container = dom.container;
    if (!container) return;
    
    container.innerHTML = `
        <div class="drag-handle" id="drag-handle"></div>
        <div class="extras-grid" id="extras-grid"></div>
        <div class="status-bar">
            <div class="status-item">
                <div class="status-dot active"></div>
                <span id="active-count">0 Active</span>
            </div>
            <div class="status-item">
                <div class="status-dot inactive"></div>
                <span id="inactive-count">0 Inactive</span>
            </div>
            <div class="status-item">
                <div class="status-dot unavailable"></div>
                <span id="unavailable-count">0 Unavailable</span>
            </div>
        </div>
    `;
    
    injectStyles(container);
}

function injectStyles(container) {
    const style = document.createElement('style');
    style.textContent = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #root {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: transparent;
        min-height: 100vh;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 20px;
        margin: 0;
        overflow: hidden;
    }

    .container {
        background: rgba(0, 0, 0, 0.8);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 320px;
        width: auto;
        transform: translateX(5px);
        animation: slideIn 0.6s ease-out forwards;
        position: absolute;
        user-select: none;
    }

    .drag-handle {
        width: 100%;
        height: 20px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border-radius: 10px;
        margin-bottom: 15px;
        cursor: grab;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .drag-handle:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
        transform: translateY(-1px);
    }

    .drag-handle:active {
        cursor: grabbing;
        transform: translateY(0);
    }

    .drag-handle::before {
        content: '';
        width: 30px;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        position: relative;
    }

    .drag-handle::after {
        content: '';
        position: absolute;
        width: 30px;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateY(4px);
    }

    @keyframes slideIn {
        to {
            transform: translateX(0);
        }
    }

    .extras-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 15px;
    }

    .extra-button {
        position: relative;
        width: 100%;
        height: 60px;
        border: 2px solid #ffffff00;
        outline: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .extra-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .extra-button:hover::before {
        left: 100%;
    }

    .extra-button.active {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(69, 160, 73, 0.4));
        color: rgba(9, 255, 0, 0.8);
        transform: translateY(-2px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 20px rgba(76, 175, 80, 0.2);
        position: relative;
    }

    .extra-button.active:hover {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.6), rgba(69, 160, 73, 0.6));
        color: rgba(9, 255, 0, 1);
        transform: translateY(-4px) scale(1.02);
        border: 2px solid rgba(76, 175, 80, 0.5);
        box-shadow: 0 12px 30px rgba(76, 175, 80, 0.4), 0 0 20px rgba(76, 175, 80, 0.3);
    }

    .extra-button.active::after {
        content: '🟢';
        position: absolute;
        top: 4px;
        right: 6px;
        font-size: 8px;
        z-index: 10;
        animation: greenPulse 1.5s ease-in-out infinite;
    }

    @keyframes greenPulse {
        0% {
            filter: brightness(1.2) drop-shadow(0 0 2px rgba(0, 255, 0, 0.6));
            transform: scale(1);
        }
        50% {
            filter: brightness(1.8) drop-shadow(0 0 6px rgba(0, 255, 0, 1));
            transform: scale(1.05);
        }
        100% {
            filter: brightness(1.2) drop-shadow(0 0 2px rgba(0, 255, 0, 0.6));
            transform: scale(1);
        }
    }

    .extra-button.active.siren-mode {
        background: #1a1a1a;
        color: white;
        transform: translateY(-2px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
    }

    .extra-button.active.siren-mode::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
            rgba(255, 21, 21, 0.3) 0%, 
            rgba(0, 38, 255, 0.4) 25%, 
            rgba(255, 21, 21, 0.5) 50%, 
            rgba(0, 38, 255, 0.3) 75%, 
            rgba(255, 21, 21, 0.4) 100%
        );
        background-size: 400% 400%;
        animation: smoothConflictingSiren 2.5s ease-in-out infinite;
        z-index: 1;
        border-radius: 12px;
    }

    .extra-button.active.siren-mode .button-content {
        position: relative;
        z-index: 2;
    }

    .extra-button.active.siren-mode:hover {
        transform: translateY(-4px) scale(1.02);
        border: 2px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 12px 30px rgba(255, 0, 0, 0.3), 0 0 20px rgba(0, 0, 255, 0.2);
    }

    .extra-button.active.siren-mode:hover::before {
        animation: smoothConflictingSiren 1.5s ease-in-out infinite;
        filter: brightness(1.3) saturate(1.5);
    }

    @keyframes smoothConflictingSiren {
        0% {
            background-position: 0% 50%;
            filter: hue-rotate(0deg) saturate(1.2);
        }
        20% {
            background-position: 100% 50%;
            filter: hue-rotate(15deg) saturate(1.5);
        }
        40% {
            background-position: 0% 100%;
            filter: hue-rotate(-10deg) saturate(1.8);
        }
        60% {
            background-position: 100% 0%;
            filter: hue-rotate(25deg) saturate(1.3);
        }
        80% {
            background-position: 50% 100%;
            filter: hue-rotate(-5deg) saturate(1.6);
        }
        100% {
            background-position: 0% 50%;
            filter: hue-rotate(0deg) saturate(1.2);
        }
    }

    .extra-button.inactive {
        background: linear-gradient(135deg, #f5f5f59c, #e0e0e09d);
        color: #666;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .extra-button.inactive::after {
        content: '🔴';
        position: absolute;
        top: 4px;
        right: 6px;
        font-size: 7px;
        z-index: 2;
    }

    .extra-button.inactive.pulse-inactive {
        animation: pulseInactive 2s infinite;
    }

    .extra-button.inactive:hover {
        background: linear-gradient(135deg, #e8e8e8, #d5d5d5);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .extra-button.unavailable {
        background: linear-gradient(135deg, #424242, #303030);
        color: #888;
        cursor: not-allowed;
        opacity: 0.6;
    }

    .extra-button.unavailable:hover {
        transform: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .extra-button.unavailable::after {
        content: '🔘';
        position: absolute;
        top: 4px;
        right: 6px;
        font-size: 7px;
        color: #888;
    }

    .status-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        min-width: 17rem;
        border-radius: 12px;
        padding: 12px 15px;
        margin-top: 15px;
    }

    .status-item {
        display: flex;
        align-items: center;
        gap: 5px;
        margin: 0 0.3rem;
        color: white;
        font-size: 12px;
        font-weight: 500;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .status-dot.active {
        background: #4CAF50;
        box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
    }

    .status-dot.inactive {
        background: #e0e0e0;
    }

    .status-dot.unavailable {
        background: #424242;
    }

    @keyframes pulseInactive {
        0% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        50% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(224, 224, 224, 0.4);
        }
        100% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    }

    @media (max-width: 480px) {
        .extras-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        
        .container {
            padding: 15px;
            max-width: 280px;
        }
        
        #root {
            padding: 15px;
        }
    }
    `;
    container.appendChild(style);
}

// Drag functionality
function makeDraggable(container) {
    const dragHandle = dom.dragHandle;
    if (!dragHandle) return;
    
    let pos = { x1: 0, y1: 0, x2: 0, y2: 0 };
    
    dragHandle.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        state.isDragging = true;
        pos.x2 = e.clientX;
        pos.y2 = e.clientY;
        
        dragHandle.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
        
        document.onmousemove = handleDrag;
        document.onmouseup = stopDrag;
    };
    
    function handleDrag(e) {
        if (!state.isDragging) return;
        
        e.preventDefault();
        pos.x1 = pos.x2 - e.clientX;
        pos.y1 = pos.y2 - e.clientY;
        pos.x2 = e.clientX;
        pos.y2 = e.clientY;
        
        let newTop = container.offsetTop - pos.y1;
        let newLeft = container.offsetLeft - pos.x1;
        
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - container.offsetHeight));
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - container.offsetWidth));
        
        container.style.top = `${newTop}px`;
        container.style.left = `${newLeft}px`;
    }
    
    function stopDrag() {
        if (state.isDragging) {
            const top = parseInt(container.style.top) || 0;
            const left = parseInt(container.style.left) || 0;
            storage.save(top, left);
        }
        
        state.isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        dragHandle.style.cursor = 'grab';
        container.style.userSelect = '';
    }
}

function createExtraButton(extraNum) {
    const button = document.createElement('button');
    button.className = 'extra-button';
    button.id = `extra-${extraNum}`;
    
    const content = document.createElement('span');
    content.className = 'button-content';
    content.textContent = extraNum;
    button.appendChild(content);
    
    const isUnavailable = state.unAvailableExtras[extraNum - 1];
    const isActive = state.activeExtras[extraNum - 1];
    const isInactive = state.inActiveExtras[extraNum - 1];

    if (isUnavailable) {
        button.classList.add('unavailable');
        button.disabled = true;
    } else {
        if (isActive) {
            button.classList.add('active');
            if (state.isSirenOn) button.classList.add('siren-mode');
        } else if (isInactive) {
            button.classList.add('inactive', 'pulse-inactive');
        }
        button.addEventListener('click', () => toggleExtra(extraNum));
    }

    return button;
}

function toggleExtra(extraNum) {
    if (state.isDragging) return;
    
    fetch(`https://${GetParentResourceName()}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num: extraNum })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        
        const button = document.getElementById(`extra-${extraNum}`);
        const index = extraNum - 1;
        
        if (data.isActive) {
            button.classList.remove('inactive', 'pulse-inactive');
            button.classList.add('active');
            if (state.isSirenOn) button.classList.add('siren-mode');
            
            state.activeExtras[index] = true;
            state.inActiveExtras[index] = false;
        } else {
            button.classList.remove('active', 'siren-mode');
            button.classList.add('inactive', 'pulse-inactive');
            
            state.activeExtras[index] = false;
            state.inActiveExtras[index] = true;
        }
        
        updateStatusCounts();
    })
    .catch(err => console.error('Error toggling extra:', err));
}

function updateSirenIndicators() {
    document.querySelectorAll('.extra-button.active').forEach(button => {
        button.classList.toggle('siren-mode', state.isSirenOn);
    });
}

function updateStatusCounts() {
    // Count inactive that are NOT also unavailable
    const inactiveCount = state.inActiveExtras.filter((isInactive, index) => {
        return isInactive && !state.unAvailableExtras[index];
    }).length;

    document.getElementById('active-count').textContent = `${state.activeExtras.filter(Boolean).length} Active`;
    document.getElementById('inactive-count').textContent = `${inactiveCount} Inactive`;
    document.getElementById('unavailable-count').textContent = `${state.unAvailableExtras.filter(Boolean).length} Unavailable`;
}

// Position management
function setContainerPosition(container) {
    const savedPos = storage.load();
    
    // Always validate bounds, even for saved positions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const containerHeight = container.offsetHeight;
    const containerWidth = container.offsetWidth;
    
    let top, left;
    
    if (savedPos.top !== null && savedPos.left !== null) {
        // Use saved position but validate it's within bounds
        top = Math.max(0, Math.min(savedPos.top, viewportHeight - containerHeight - 20));
        left = Math.max(0, Math.min(savedPos.left, viewportWidth - containerWidth - 20));
    } else {
        // Default to bottom-right corner with padding
        top = viewportHeight - containerHeight - 420;
        left = viewportWidth - containerWidth - 340;
    }
    
    // Final safety check - ensure values are valid
    top = Math.max(0, top);
    left = Math.max(0, left);
    
    container.style.top = `${top}px`;
    container.style.left = `${left}px`;
}

// Initialize UI
function initializeUI() {
    const grid = dom.grid;
    grid.innerHTML = '';
    
    for (let i = 1; i <= 12; i++) {
        grid.appendChild(createExtraButton(i));
    }
    
    updateStatusCounts();
    
    const container = dom.container;
    setContainerPosition(container);
    makeDraggable(container);
}

// Fade animations
function fadeIn(element) {
    element.style.display = 'flex';
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s ease';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
    });
}

function fadeOut(element) {
    element.style.transition = 'opacity 0.3s ease';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.display = 'none';
        element.style.transition = '';
    }, 300);
}

// Event listeners
document.addEventListener('DOMContentLoaded', createHTML);

window.addEventListener('message', (event) => {
    const { action, unAvailableExtras, activeExtras, inActiveExtras, sirenOn } = event.data;
    
    if (action === 'open') {
        state.unAvailableExtras = unAvailableExtras || [];
        state.activeExtras = activeExtras || [];
        state.inActiveExtras = inActiveExtras || [];
        
        initializeUI();
        fadeIn(dom.root);
    } else if (action === 'close') {
        fadeOut(dom.root);
    } else if (sirenOn !== undefined) {
        state.isSirenOn = sirenOn;
        updateSirenIndicators();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        fetch(`https://${GetParentResourceName()}/unfocus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
});

window.addEventListener('resize', () => {
    const container = dom.container;
    if (!container || container.style.display === 'none') return;
    
    let newTop = parseInt(container.style.top) || 0;
    let newLeft = parseInt(container.style.left) || 0;
    
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - container.offsetHeight));
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - container.offsetWidth));
    
    container.style.top = `${newTop}px`;
    container.style.left = `${newLeft}px`;

    storage.save(newTop, newLeft);
});

// Initialize
dom.root.style.display = 'none';