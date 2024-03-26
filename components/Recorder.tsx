"use client";

import Image from "next/image";
import { activeGif } from "@/images";
import { useState, useEffect, useRef } from "react";
import { useFormState } from "react-dom";

const Recorder = ({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  //   const {pending} = useFormState();

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
        setRecording(true);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("Your browser does not support MediaRecorder");
    }
  };

  const startRecording = () => {
    if (mediaRecorder === null || stream === null) return;
    // if(pending) return;

    setRecordingStatus("recording");
    const media = new MediaRecorder(stream);
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    const audioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size === 0) return;
      if (typeof event.data === "undefined") return;
      audioChunks.push(event.data);
    };
    setChunks(audioChunks);
  };

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  return (
    <>
      {!recording && (
        <button onClick={getMicrophonePermission} type="button">
          Get Microphone
        </button>
      )}
      <div className="flex items-center justify-center">
        <Image src={activeGif} alt="Recorder" width={150} height={150} />
      </div>
    </>
  );
};

export default Recorder;
