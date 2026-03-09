import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";

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
}));
