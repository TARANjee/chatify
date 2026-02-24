import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  authUser:null,
  isCheckingAuth:true,
  isSigningUp:false,

  checkAuth: async () => {
    try {
      const res= await axiosInstance.get('/auth/check')
      set({authUser:res.data.user})
    } catch (error) {
      console.error('Error checking auth:', error)
      set({authUser:null})
    } finally {
      set({isCheckingAuth:false})
    } 
  },

  signUp: async (data) => {
    set({isSigningUp:true})
    console.log('Signing up with data:', data)
    try {
      const res= await axiosInstance.post('/auth/signup',data)
      set({authUser:res.data.user})

      //toast success
      toast.success('Account created successful!') 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
    }
      finally {
      set({isSigningUp:false})
      }
  }


}))