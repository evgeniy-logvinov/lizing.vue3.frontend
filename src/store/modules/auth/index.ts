import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { authService } from '~/services'
import { RootState } from '~/store/types'
import {
  AuthUserInfo,
  ConfirmEmail,
  Permissions,
  ResetPassword,
  ResetRequired,
  SignInInfo,
} from '~/types'

const user = authService.getUser()

export const state = (): AuthState => {
  return user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null }
}

export interface AuthState {
  status: {
    loggedIn: boolean
  }
  user: AuthUserInfo | null
}

export const actions: ActionTree<AuthState, RootState> = {
  async signIn({ commit }, user: SignInInfo) {
    try {
      const res = await authService.signIn(user)
      commit('signInSuccess', res)
      return Promise.resolve(res)
    } catch (err) {
      commit('signInFailure')
      return Promise.reject(err)
    }
  },
  async confirmEmail({ commit }, confirmEmail: ConfirmEmail) {
    try {
      const res = await authService.confirmEmail(confirmEmail)
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async resetRequired({ commit }, resetPequired: ResetRequired) {
    try {
      const res = await authService.resetRequired(resetPequired)
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async resetPassword({ commit }, resetPassword: ResetPassword) {
    try {
      const res = await authService.resetPassword(resetPassword)
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  signOut({ commit }) {
    authService.signOut()
    commit('signOut')
  },
  async signUp({ commit }, user) {
    try {
      const res = await authService.signUp(user)
      commit('signUpSuccess')
      return Promise.resolve(res)
    } catch (err) {
      commit('signUpFailure')
      return Promise.reject(err)
    }
  },
}

export const mutations: MutationTree<AuthState> = {
  signInSuccess(state: AuthState, user: AuthUserInfo) {
    state.status.loggedIn = true
    state.user = user
  },
  signInFailure(state: AuthState) {
    state.status.loggedIn = false
    state.user = null
  },
  signOut(state: AuthState) {
    state.status.loggedIn = false
    state.user = null
  },
  signUpSuccess(state: AuthState) {
    state.status.loggedIn = false
  },
  signUpFailure(state: AuthState) {
    state.status.loggedIn = false
  },
}

export const getters: GetterTree<AuthState, RootState> = {
  loggedIn: (state: AuthState): boolean => {
    return state.status.loggedIn
  },
  permissions: (state: AuthState): Permissions[] | undefined => {
    return state.user?.permissions
  },
}

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
