import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import transmit from '@adonisjs/transmit/services/main'

const AuthController = () => import('#controllers/auth_controller')
const ChannelsController = () => import('#controllers/channels_controller')
const MessagesController = () => import('#controllers/messages_controller')

// Health check
router.get('/', async () => {
  return { status: 'ok', message: 'Nexus API is running' }
})

// Auth routes
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth')

// Protected routes
router.group(() => {
  // Auth
  router.post('/auth/logout', [AuthController, 'logout'])
  router.get('/auth/me', [AuthController, 'me'])
  router.patch('/auth/profile', [AuthController, 'updateProfile'])

  // Channels
  router.get('/channels', [ChannelsController, 'index'])
  router.post('/channels/join', [ChannelsController, 'join'])
  router.get('/channels/:id/members', [ChannelsController, 'members'])
  router.post('/channels/:id/invite', [ChannelsController, 'invite'])
  router.post('/channels/:id/revoke', [ChannelsController, 'revoke'])
  router.post('/channels/:id/kick', [ChannelsController, 'kick'])
  router.post('/channels/:id/leave', [ChannelsController, 'leave'])
  router.delete('/channels/:id', [ChannelsController, 'destroy'])

  // Messages
  router.get('/channels/:channelId/messages', [MessagesController, 'index'])
  router.post('/channels/:channelId/messages', [MessagesController, 'store'])

  // Typing indicator
  router.post('/channels/:channelId/typing', [ChannelsController, 'setTyping'])
  router.get('/channels/:channelId/typing', [ChannelsController, 'getTyping'])
}).use(middleware.auth())

// Transmit routes for realtime
transmit.registerRoutes()
