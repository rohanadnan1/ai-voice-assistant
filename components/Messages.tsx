'use client'

import { ChatMessage } from "@/app/page"
import { ChevronDownCircle } from "lucide-react"
import Loader from "./Loader"
import { useSelector } from "react-redux"

interface Props {
    messages: ChatMessage[]
}

const Messages = ({messages}: Props) => {

  const {displaySettings} = useSelector((state: any) => state.app)

    return(
        <div
      className={`flex flex-col min-h-screen p-5 pt-20 ${
        messages.length > 0 ? "pb-96" : "pb-32"
      }`}
    >

      <Loader/>
      <div className="flex flex-col flex-1">

        {!messages.length && !displaySettings && (
          <div className="flex flex-col space-y-6 flex-1 items-center justify-end">
            <p className="animate-pulse text-black">Start a conversation</p>
            <ChevronDownCircle
              size={50}
              className="animate-bounce text-black"
            />
          </div>
        )}

        <div className="p-5 space-y-5">
          {messages.map((message) => (
            <div key={message.id} className="space-y-5">
              {/* reciever */}
              <div className="pr-48">
                <p className="message bg-gray-800 rounded-bl-none">
                  {message.response}
                </p>
              </div>

              {/* sender */}
              <div className="pl-48">
                <p className="message text-left ml-auto rounded-br-none bg-gray-600">
                  {message.sender}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
}

export default Messages