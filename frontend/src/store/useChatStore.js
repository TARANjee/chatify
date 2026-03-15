import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") == true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContact: async () => {
    set({ isUsersLoading: true });
    try {
      const req = await axiosInstance.get("/messages/contacts");
      set({ allContacts: req.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getAllChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const req = await axiosInstance.get("/messages/chats");
      set({ chats: req.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch chat partners");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ messages: [], isMessagesLoading: true });
    try {
      const req = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: req.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData)=>{
    const {selectedUser,messages}=get()
    const {authUser}=useAuthStore.getState()

const tempId=`temp-${Date.now()}`
const optimisticMessage={
  _id:tempId,
  senderId:authUser.user._id,
  receiverId:selectedUser._id,
  text:messageData.text,
  image:messageData.image,
  createdAt:new Date().toISOString(),
  isOptimistic:true
}
// Add the optimistic message to the UI immediately
set({messages:[...messages,optimisticMessage]})
    try {
      const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
      set({messages:messages.concat(res.data)})
    } catch (error) {
       toast.error(error.response?.data?.message || "Something went wrong");
        // Remove the optimistic message from the UI
        set({messages:messages})
      }

  }
}));
