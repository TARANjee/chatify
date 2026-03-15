import { useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { ImageIcon, SendIcon, XIcon } from 'lucide-react'
function MessageInput() {
  const [text, setText] = useState('')
  const [imagePreview, setimagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessage } = useChatStore()

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    sendMessage({
      text: text.trim(),
      image: imagePreview
    })
    setText("")
    setimagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = "";

  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => setimagePreview(reader.result)
    reader.readAsDataURL(file)

  }

  const removeImage = () => {
    setimagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className='p-4 border-t border-slate-700/50'>
      {imagePreview && (
        <div className='max-w-3xl mx-auto mb-3 flex items-center'>
          <div className='relative'>
            <img
              src={imagePreview}
              alt="preview"
              className='w-20 h-20 object-cover rounded-md border border-slate-700'
            />
            <button
              onClick={removeImage}
              className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200  hoverbg-slate-700'
              type='button'
            >
              <XIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='max-w-3xl mx-auto flex space-x-4'>
        <input
          type="text"
          placeholder='Type your message...'
          className='flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className='hidden'
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type='button'
          onClick={() => fileInputRef.current.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""
            }`}
        >
          <ImageIcon className='w-5 h-5' />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput