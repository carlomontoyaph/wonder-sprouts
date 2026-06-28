import { lazy, Suspense } from 'react'
import { useGame } from './context/GameContext'
import { useResponsive } from './hooks/useResponsive'
import { BottomNav } from './components/BottomNav/BottomNav'

const HomeScreen = lazy(() => import('./screens/HomeScreen/HomeScreen').then(m => ({ default: m.HomeScreen })))
const TopicsScreen = lazy(() => import('./screens/TopicsScreen/TopicsScreen').then(m => ({ default: m.TopicsScreen })))
const TriviaScreen = lazy(() => import('./screens/TriviaScreen/TriviaScreen').then(m => ({ default: m.TriviaScreen })))
const SummaryScreen = lazy(() => import('./screens/SummaryScreen/SummaryScreen').then(m => ({ default: m.SummaryScreen })))
const ProgressScreen = lazy(() => import('./screens/ProgressScreen/ProgressScreen').then(m => ({ default: m.ProgressScreen })))
const ParentsScreen = lazy(() => import('./screens/ParentsScreen/ParentsScreen').then(m => ({ default: m.ParentsScreen })))
const SettingsScreen = lazy(() => import('./screens/SettingsScreen/SettingsScreen').then(m => ({ default: m.SettingsScreen })))
const LandingScreen = lazy(() => import('./screens/LandingScreen/LandingScreen').then(m => ({ default: m.LandingScreen })))
const ArtGalleryScreen = lazy(() => import('./screens/ArtGalleryScreen/ArtGalleryScreen').then(m => ({ default: m.ArtGalleryScreen })))

const SCREENS_WITH_NAV = ['home', 'topics', 'progress', 'parents', 'settings']

function ScreenFallback() {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100%', color:'#8a7c68', fontFamily:'Nunito, system-ui, sans-serif',
      fontSize:14, fontWeight:600,
    }}>
      Loading…
    </div>
  )
}

export default function App() {
  const { state, dispatch } = useGame()
  const resp = useResponsive(state.vw)

  // First visit: show landing page
  if (!state.hasSeenLanding) {
    return (
      <Suspense fallback={<ScreenFallback />}>
        <LandingScreen />
      </Suspense>
    )
  }

  // Debug: ?art-gallery renders all 81 illustrations for visual comparison (dev only)
  if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.search.includes('art-gallery')) {
    return (
      <Suspense fallback={<ScreenFallback />}>
        <ArtGalleryScreen />
      </Suspense>
    )
  }

  const shellClass = [
    state.reduceMotion ? 'ft-reduce' : '',
    state.textBig ? 'ft-big' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      style={{
        height: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(1200px 600px at 50% -10%, #FBF7F0 0%, #EFE7D8 90%)',
        fontFamily: 'Nunito, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        className={shellClass}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: resp.shellMaxW,
          height: resp.shellHeight,
          background: '#FBF7F0',
          borderRadius: resp.shellRadius,
          boxShadow: resp.shellShadow,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Render screen based on state.screen */}
        <Suspense fallback={<ScreenFallback />}>
          {state.screen === 'home' && <HomeScreen />}
          {state.screen === 'topics' && <TopicsScreen />}
          {state.screen === 'trivia' && <TriviaScreen />}
          {state.screen === 'summary' && <SummaryScreen />}
          {state.screen === 'progress' && <ProgressScreen />}
          {state.screen === 'parents' && <ParentsScreen />}
          {state.screen === 'settings' && <SettingsScreen />}
          {state.screen === 'landing' && <LandingScreen />}
        </Suspense>

        {/* Bottom nav */}
        {SCREENS_WITH_NAV.includes(state.screen) && (
          <BottomNav
            currentScreen={state.screen}
            onNavigate={(screen) => {
              if (window.FTSound) window.FTSound.tap()
              if (screen === 'home') dispatch({ type: 'GO_HOME' })
              else if (screen === 'progress')
                dispatch({ type: 'SET_SCREEN', screen: 'progress' })
              else if (screen === 'parents')
                dispatch({ type: 'GO_PARENTS' })
              else if (screen === 'settings')
                dispatch({ type: 'SET_SCREEN', screen: 'settings' })
            }}
          />
        )}
      </div>
    </div>
  )
}
