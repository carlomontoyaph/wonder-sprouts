import { Viewport } from '../types'

export interface ResponsiveValues {
  vp: Viewport
  isMobile: boolean
  shellMaxW: string
  shellHeight: string
  shellRadius: string
  shellShadow: string
  gridTemplate: string
  contentMaxW: string
  topicsMaxW: string
  navMaxW: string
}

export function useResponsive(vw: number): ResponsiveValues {
  const isMobile = vw < 700
  const isTablet = vw >= 700 && vw < 1100
  const vp: Viewport = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

  return {
    vp,
    isMobile,
    shellMaxW: isMobile ? '100%' : isTablet ? '760px' : '1080px',
    shellHeight: isMobile ? '100dvh' : 'min(960px, 94dvh)',
    shellRadius: isMobile ? '0px' : '30px',
    shellShadow: isMobile
      ? '0 0 0 rgba(0,0,0,0)'
      : '0 30px 70px rgba(74,58,40,0.20)',
    gridTemplate: isMobile
      ? 'repeat(2, 1fr)'
      : isTablet
        ? 'repeat(3, 1fr)'
        : 'repeat(4, 1fr)',
    contentMaxW: isMobile ? '100%' : '600px',
    topicsMaxW: vw >= 1100 ? '980px' : '100%',
    navMaxW: isMobile ? '100%' : '720px',
  }
}
