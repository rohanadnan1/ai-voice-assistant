"use client";

import Messages from "@/components/Messages";
import Recorder from "@/components/Recorder";
import { SettingsIcon, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { myPic } from "@/images";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useFormState } from "react-dom";
import transcript from "@/actions/transcript";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettings, setRecording } from "@/store/app_slice";


export interface ChatMessage {
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
  const dispatch = useDispatch();
  const { displaySettings } = useSelector((state: any) => state.app);
  const [state, formAction] = useFormState(transcript, initialState);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [accessDenied, setAccessDenied] = useState(true);

  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const file = new File([blob], "audio.webm", { type: blob.type });

    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;

      if (btnRef.current) {
        btnRef.current.click();
      }
    }
  };

  const denyMicrophonePermission =async () => {
    if('MediaRecorder' in window){
      setAccessDenied(true);
      dispatch(setRecording(true));
    } 
  }

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
        dispatch(setRecording(false));
        setAccessDenied(false)
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("Your browser does not support MediaRecorder");
    }
  };

  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((prev) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...prev,
      ]);
    }
  }, [state]);

  return (
    <main className="bg-black h-screen">
      <header className="flex fixed top-0 justify-between text-white w-full p-5">
       {
        accessDenied ? (
          <MicOff
            className="p-2 m-2 rounded-full cursor-pointer bg-gray-600 text-slate transition-all ease-in-out duration-150 hover:bg-gray-700 hover:text-slate-200"
            size={40}
            onClick={getMicrophonePermission}
          />
        ) : (
          <Mic
            className="p-2 m-2 rounded-full cursor-pointer bg-gray-600 text-slate transition-all ease-in-out duration-150 hover:bg-gray-700 hover:text-slate-200"
            size={40}
            onClick={denyMicrophonePermission}
          />
        )
       }
        <SettingsIcon
          className="p-2 m-2 rounded-full cursor-pointer bg-gray-600 text-slate transition-all ease-in-out duration-150 hover:bg-gray-700 hover:text-slate-200"
          size={40}
          onClick={() => dispatch(toggleSettings())}
        />
      </header>

      <form action={formAction} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-slate-300 to-black">
          <Messages messages={messages} />
        </div>

        <input type="file" name="audio" hidden ref={inputRef} />
        <button type="submit" hidden ref={btnRef} />

        <div className="fixed bottom-4 w-full overflow-hidden rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio} getMicrophonePermission={getMicrophonePermission} stream={stream} accessDenied={accessDenied}/>
          <VoiceSynthesizer state={state} displaySettings={displaySettings} />
        </div>
      </form>
    </main>
  );
}
