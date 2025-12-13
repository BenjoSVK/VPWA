import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    // Check if email already exists
    const existingEmail = await User.findBy('email', data.email)
    if (existingEmail) {
      return response.conflict({ message: 'Email is already taken' })
    }

    // Check if nickname already exists
    const existingNick = await User.findBy('nickName', data.nickName)
    if (existingNick) {
      return response.conflict({ message: 'Nickname is already taken' })
    }

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
      email: data.email,
      password: data.password,
      notifyMentionsOnly: false,
      status: 'Online',
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
        email: user.email,
        notifyMentionsOnly: user.notifyMentionsOnly,
        status: user.status,
      },
      token: token.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          nickName: user.nickName,
          email: user.email,
          notifyMentionsOnly: user.notifyMentionsOnly,
          status: user.status,
        },
        token: token.value!.release(),
      })
    } catch {
      return response.unauthorized({ message: 'Nesprávny email alebo heslo' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: 'Logged out successfully' })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.ok({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.nickName,
      email: user.email,
      notifyMentionsOnly: user.notifyMentionsOnly,
      status: user.status,
    })
  }

  async updateProfile({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = request.only(['firstName', 'lastName', 'notifyMentionsOnly'])

    user.merge(data)
    await user.save()

    return response.ok({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.nickName,
      email: user.email,
      notifyMentionsOnly: user.notifyMentionsOnly,
      status: user.status,
    })
  }

  async updateStatus({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { status } = request.only(['status'])

    if (!['Online', 'Offline', 'Do Not Disturb'].includes(status)) {
      return response.badRequest({ message: 'Invalid status' })
    }

    user.status = status
    await user.save()

    return response.ok({
      id: user.id,
      status: user.status,
    })
  }
}

