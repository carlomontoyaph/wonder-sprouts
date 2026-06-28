import { useGame } from './context/GameContext'
import { useResponsive } from './hooks/useResponsive'
import { BottomNav } from './components/BottomNav/BottomNav'
import { HomeScreen } from './screens/HomeScreen/HomeScreen'
import { TopicsScreen } from './screens/TopicsScreen/TopicsScreen'
import { TriviaScreen } from './screens/TriviaScreen/TriviaScreen'
import { SummaryScreen } from './screens/SummaryScreen/SummaryScreen'
import { ProgressScreen } from './screens/ProgressScreen/ProgressScreen'
import { ParentsScreen } from './screens/ParentsScreen/ParentsScreen'
import { SettingsScreen } from './screens/SettingsScreen/SettingsScreen'
import { LandingScreen } from './screens/LandingScreen/LandingScreen'

const SCREENS_WITH_NAV = ['home', 'topics', 'progress', 'parents', 'settings']

export default function App() {
  const { state, dispatch } = useGame()
  const resp = useResponsive(state.vw)

  // First visit: show landing page
  if (!state.hasSeenLanding) {
    return <LandingScreen />
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
        {state.screen === 'home' && <HomeScreen />}
        {state.screen === 'topics' && <TopicsScreen />}
        {state.screen === 'trivia' && <TriviaScreen />}
        {state.screen === 'summary' && <SummaryScreen />}
        {state.screen === 'progress' && <ProgressScreen />}
        {state.screen === 'parents' && <ParentsScreen />}
        {state.screen === 'settings' && <SettingsScreen />}
        {state.screen === 'landing' && <LandingScreen />}

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
