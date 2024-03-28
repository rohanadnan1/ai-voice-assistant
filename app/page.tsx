'use client'

import Messages from "@/components/Messages";
import Recorder from "@/components/Recorder";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { myPic } from "@/images";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useFormState } from "react-dom";
import transcript from "@/actions/transcript";

interface ChatMessage {
  sender: string;
  response: string;
  id: string;
}

export const initialState = {
  sender: "",
  response: "",
  id: "",
};

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);


  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const file = new File([blob], "audio.webm", { type: blob.type});

    if(inputRef.current){
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;

      if(btnRef.current){
        btnRef.current.click();
      }
    }

  }

  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((prev) => [
        {
          sender: state.sender || '',
          response: state.response || '',
          id: state.id || ''
        },
        ...prev
      ]);
    }
  }, [state]);

  return (
    <main className="bg-black h-screen overflow-y-scroll">
    <header className="flex fixed top-0 justify-between text-white w-full p-5">
      <Image
        src={myPic}
        alt="Logo"
        width={30}
        height={30}
        className="rounded-full object-cover"
      />

      <SettingsIcon
        className="p-2 m-2 rounded-full cursor-pointer bg-purple-600 text-black transition-all ease-in-out duration-150 hover:bg-purple-700 hover:text-white"
        size={40}
      />
    </header>

    <form action={formAction} className="flex flex-col bg-black">
      <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
        <Messages/>
      </div>

      <input type="file" name="audio" hidden ref={inputRef} />
      <button type="submit" hidden ref={btnRef} />

      <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
        <Recorder uploadAudio={uploadAudio} />
      </div>
    </form>
  </main>
  );
}
