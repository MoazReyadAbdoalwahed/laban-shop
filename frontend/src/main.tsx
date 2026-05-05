import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import AppRoutes from './routes/Routes.tsx'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import globalStore from './store/store.tsx'

// Initialize theme before React renders to prevent flash
const savedTheme = localStorage.getItem('theme')
const initialTheme = savedTheme === 'dark' ? 'dark' : 'light'
document.documentElement.setAttribute('data-theme', initialTheme)

createRoot(document.getElementById('root')!).render(
  <Provider store={globalStore.store}>
    <PersistGate loading={null} persistor={globalStore.persistor}>
      <AppRoutes />
    </PersistGate>
  </Provider>
)
