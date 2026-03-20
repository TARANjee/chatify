import { useState, useRef } from "react";
import { LogOutIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";

function ProfileHeader() {
    const { authUser, logout, updateProfile } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    console.log("Auth User in ProfileHeader:", authUser);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_SIZE = 3.75 * 1024 * 1024;

        if (file.size > MAX_SIZE) {
            toast.error("Image size must be less than 3.75MB");
            return;
        }

        const reader = new FileReader();

        reader.onerror = () => {
            toast.error("Failed to read image file");
        };

        reader.onloadend = async () => {
            try {
                const base64Image = reader.result;

                setSelectedImage(base64Image);

                await updateProfile({ profilepic: base64Image });
            } catch (error) {
                console.error(error);
                toast.error("Failed to update profile image");
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    {/* AVATAR */}
                    <div className="avatar online">
                        <button
                            className="size-14 rounded-full overflow-hidden relative group"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <img
                                src={
                                    selectedImage ||
                                    authUser?.profilepic ||
                                    "/avatar.png"
                                }
                                alt="avatar"
                                className="object-cover size-full"
                                onError={(e) => (e.target.src = "/avatar.png")}
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

                    {/* USER INFO */}
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                            {authUser?.username || "User"}
                        </h3>
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-4 items-center">
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={logout}
                    >
                        <LogOutIcon className="size-5" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ProfileHeader;