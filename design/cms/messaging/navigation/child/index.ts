// Export navigation messaging functionality for child (iframe)
export { 
  createNavigationMessageHandlers,
  useNavigationMessageListener,
  sendNavigationUpdateToParent,
  type NavigationMessageHandlers 
} from './navigationMessaging'; 