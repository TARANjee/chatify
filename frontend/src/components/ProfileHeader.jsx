import { useState, useRef } from "react"
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

function ProfileHeader() {
    const { authUser, logout, updateProfile } = useAuthStore()
    const [selectedImage, setSelectedImage] = useState(null)
    const fileInputRef = useRef(null)
    

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onloadend =async () => {
            const base64Image=reader.result
            setSelectedImage(base64Image)
            await updateProfile({ profilepic: base64Image})
        }
     }
     
    return (
        <div className="p-6 border-b border-slate-700/50 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="avatar online">

                        <button className="size-14 rounded-full overflow-hidden relative group"
                            onClick={() => fileInputRef.current.click()}>
                            <img src={selectedImage || authUser?.user?.profilepic || "/avatar.png"}
                                alt="avatar"
                                className="object-cover size-full"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm">Change</span>
                            </div>

                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                    </div>
                    {/* USERNAME & Online text*/}
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                            {authUser?.user?.username}
                        </h3>
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                {/* BUTTON */}
                <div className="flex gap-4 items-center ">
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors "
                        onClick={logout}
                    >
                        <LogOutIcon className="size-5" />
                    
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader