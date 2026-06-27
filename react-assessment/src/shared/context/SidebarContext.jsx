import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'

const SidebarContext = createContext(null)

const initialState = {
  stack: [], // Array of { title, content (React element), props }
}

function sidebarReducer(state, action) {
  switch (action.type) {
    case 'PUSH':
      return { ...state, stack: [...state.stack, action.payload] }
    case 'POP':
      return { ...state, stack: state.stack.slice(0, -1) }
    case 'CLOSE_ALL':
      return { ...state, stack: [] }
    case 'NAVIGATE_TO':
      return { ...state, stack: state.stack.slice(0, action.payload + 1) }
    default:
      return state
  }
}

export function SidebarProvider({ children }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState)

  const openSidebar = useCallback((title, content) => {
    dispatch({ type: 'PUSH', payload: { title, content } })
  }, [])

  const closeSidebar = useCallback(() => {
    dispatch({ type: 'POP' })
  }, [])

  const closeAllSidebars = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL' })
  }, [])

  const navigateTo = useCallback((index) => {
    dispatch({ type: 'NAVIGATE_TO', payload: index })
  }, [])

  const value = useMemo(() => ({
    stack: state.stack,
    isOpen: state.stack.length > 0,
    depth: state.stack.length,
    currentEntry: state.stack[state.stack.length - 1] ?? null,
    title: state.stack[state.stack.length - 1]?.title ?? '',
    openSidebar,
    closeSidebar,
    closeAllSidebars,
    navigateTo,
  }), [state.stack, openSidebar, closeSidebar, closeAllSidebars, navigateTo])

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
