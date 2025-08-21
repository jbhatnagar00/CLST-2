// Simplified API Client for AWS Amplify v6
import { get, post, put, del } from 'aws-amplify/api'
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { uploadData, getUrl } from 'aws-amplify/storage'

class AmplifyApiClient {
  // Authentication methods
  async login(email: string, password: string) {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password
      })
      
      if (isSignedIn) {
        const user = await getCurrentUser()
        const session = await fetchAuthSession()
        
        return {
          user: {
            id: user.userId,
            email: email,
            username: user.username,
            emailVerified: true
          },
          tokens: {
            accessToken: session.tokens?.accessToken?.toString() || '',
            refreshToken: session.tokens?.refreshToken?.toString() || '',
            expiresIn: 3600
          }
        }
      }
      
      throw new Error('Sign in not complete')
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  async signup(data: any) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: data.username,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName
          }
        }
      })
      
      return { 
        user: { userId }, 
        needsVerification: nextStep.signUpStep === 'CONFIRM_SIGN_UP'
      }
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed')
    }
  }

  async logout() {
    await signOut()
  }

  async getCurrentUser() {
    try {
      const { username, userId } = await getCurrentUser()
      const session = await fetchAuthSession()
      
      return {
        id: userId,
        email: session.tokens?.idToken?.payload?.email as string || '',
        username: username,
        emailVerified: true
      }
    } catch (error) {
      throw new Error('No authenticated user')
    }
  }

  // API methods using Amplify v6
  async get(path: string, params?: any) {
    try {
      const restOperation = get({
        apiName: 'ClstAPI',
        path: path,
        options: {
          queryParams: params
        }
      })
      
      const { body } = await restOperation.response
      const response = await body.json()
      return response
    } catch (error) {
      console.error('GET request failed:', error)
      throw error
    }
  }

  async post(path: string, data?: any) {
    try {
      const restOperation = post({
        apiName: 'ClstAPI',
        path: path,
        options: {
          body: data
        }
      })
      
      const { body } = await restOperation.response
      const response = await body.json()
      return response
    } catch (error) {
      console.error('POST request failed:', error)
      throw error
    }
  }

  async put(path: string, data?: any) {
    try {
      const restOperation = put({
        apiName: 'ClstAPI',
        path: path,
        options: {
          body: data
        }
      })
      
      const { body } = await restOperation.response
      const response = await body.json()
      return response
    } catch (error) {
      console.error('PUT request failed:', error)
      throw error
    }
  }

  async delete(path: string) {
    try {
      const restOperation = del({
        apiName: 'ClstAPI',
        path: path
      })
      
      const { body } = await restOperation.response
      const response = await body.json()
      return response
    } catch (error) {
      console.error('DELETE request failed:', error)
      throw error
    }
  }

  // File upload using S3
  async uploadFile(file: File, path: string) {
    try {
      const result = await uploadData({
        key: path,
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              console.log(`Uploaded: ${transferredBytes}/${totalBytes}`)
            }
          }
        }
      }).result
      
      return result
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  async getFileUrl(key: string) {
    try {
      const urlResult = await getUrl({
        key: key,
        options: {
          expiresIn: 3600 // 1 hour
        }
      })
      
      return urlResult.url
    } catch (error) {
      console.error('Get URL failed:', error)
      throw error
    }
  }
}

export const apiClient = new AmplifyApiClient()
