// Simplified API Client for AWS Amplify
import { API, Auth, Storage } from 'aws-amplify'

class AmplifyApiClient {
  // Authentication methods
  async login(email: string, password: string) {
    try {
      const user = await Auth.signIn(email, password)
      return {
        user: {
          id: user.attributes.sub,
          email: user.attributes.email,
          username: user.username,
          emailVerified: user.attributes.email_verified
        },
        tokens: {
          accessToken: user.signInUserSession.accessToken.jwtToken,
          refreshToken: user.signInUserSession.refreshToken.token,
          expiresIn: 3600
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  async signup(data: any) {
    try {
      const { user } = await Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: {
          email: data.email,
          given_name: data.firstName,
          family_name: data.lastName
        }
      })
      return { user, needsVerification: true }
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed')
    }
  }

  async logout() {
    await Auth.signOut()
  }

  async getCurrentUser() {
    const user = await Auth.currentAuthenticatedUser()
    return {
      id: user.attributes.sub,
      email: user.attributes.email,
      username: user.username,
      emailVerified: user.attributes.email_verified
    }
  }

  // API methods using Amplify
  async get(path: string, params?: any) {
    const response = await API.get('ClstAPI', path, { queryStringParameters: params })
    return response
  }

  async post(path: string, data?: any) {
    const response = await API.post('ClstAPI', path, { body: data })
    return response
  }

  async put(path: string, data?: any) {
    const response = await API.put('ClstAPI', path, { body: data })
    return response
  }

  async delete(path: string) {
    const response = await API.del('ClstAPI', path, {})
    return response
  }

  // File upload using S3
  async uploadFile(file: File, path: string) {
    const result = await Storage.put(path, file, {
      contentType: file.type,
      progressCallback: (progress) => {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`)
      }
    })
    return result
  }

  async getFileUrl(key: string) {
    const url = await Storage.get(key)
    return url
  }
}

export const apiClient = new AmplifyApiClient()
