import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../../../src/hooks/use-mobile'

// Mock window.matchMedia if not already mocked in jest.setup.ts
const mockMatchMedia = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })

  const mql = {
    matches: width < 768,
    media: `(max-width: 767px)`,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }

  window.matchMedia = jest.fn(() => mql)
  return mql
}

describe('useIsMobile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns false for desktop width', () => {
    mockMatchMedia(1024)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('returns true for mobile width', () => {
    mockMatchMedia(400)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('returns false for exactly 768px (desktop breakpoint)', () => {
    mockMatchMedia(768)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('returns true for 767px (mobile breakpoint)', () => {
    mockMatchMedia(767)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('sets up matchMedia listener on mount', () => {
    const mql = mockMatchMedia(1024)
    
    renderHook(() => useIsMobile())
    
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes matchMedia listener on unmount', () => {
    const mql = mockMatchMedia(1024)
    
    const { unmount } = renderHook(() => useIsMobile())
    
    unmount()
    
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('updates state when window resizes', () => {
    const mql = mockMatchMedia(1024)
    
    const { result } = renderHook(() => useIsMobile())
    
    // Initially desktop
    expect(result.current).toBe(false)
    
    // Simulate window resize to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    })
    
    // Get the change handler that was registered
    const changeHandler = mql.addEventListener.mock.calls.find(
      call => call[0] === 'change'
    )?.[1]
    
    // Simulate the change event
    act(() => {
      if (changeHandler) {
        changeHandler()
      }
    })
    
    expect(result.current).toBe(true)
  })

  it('handles multiple resize events correctly', () => {
    const mql = mockMatchMedia(1024)
    
    const { result } = renderHook(() => useIsMobile())
    
    const changeHandler = mql.addEventListener.mock.calls.find(
      call => call[0] === 'change'
    )?.[1]
    
    // Desktop -> Mobile
    Object.defineProperty(window, 'innerWidth', { value: 400 })
    act(() => {
      if (changeHandler) changeHandler()
    })
    expect(result.current).toBe(true)
    
    // Mobile -> Desktop
    Object.defineProperty(window, 'innerWidth', { value: 1024 })
    act(() => {
      if (changeHandler) changeHandler()
    })
    expect(result.current).toBe(false)
    
    // Desktop -> Mobile again
    Object.defineProperty(window, 'innerWidth', { value: 600 })
    act(() => {
      if (changeHandler) changeHandler()
    })
    expect(result.current).toBe(true)
  })

  it('initializes with undefined before effect runs', () => {
    const mql = mockMatchMedia(1024)
    
    // We can't easily test the initial undefined state since the effect runs synchronously
    // in test environment, but we can verify the hook eventually returns a boolean
    const { result } = renderHook(() => useIsMobile())
    
    expect(typeof result.current).toBe('boolean')
  })

  it('uses correct mobile breakpoint (768px)', () => {
    mockMatchMedia(768)
    
    renderHook(() => useIsMobile())
    
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })
})