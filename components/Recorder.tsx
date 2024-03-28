"use client";

import Image from "next/image";
import { activeGif, inactiveGif } from "@/images";
import { useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

const Recorder = ({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const { pending } = useFormStatus();

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
    if (pending) return;

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

  const stopRecording = () => {
    if (mediaRecorder === null) return;
    if (pending) return;
    mediaRecorder.current?.stop();
    setRecordingStatus("inactive");
    if (mediaRecorder.current !== null) {
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        uploadAudio(blob);
        setChunks([]);
      };
    }
  };

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  return (
    <div className="flex items-center justify-center">
      {/* {!recording && (
        <button onClick={getMicrophonePermission} type="button">
          Get Microphone
        </button>
      )} */}
      {pending && (
        <div
          className="bg-black rounded-full overflow-hidden object-contain flex items-center"
          style={{ width: "90px", height: "90px" }}
        >
          <Image
            src={activeGif}
            alt="Recording"
            width={150}
            height={150}
            onClick={stopRecording}
            priority={true}
            className="assistant grayscale"
          />
        </div>
      )}
      {recordingStatus === "inactive" && !pending ? (
        <div
          className="bg-black rounded-full overflow-hidden object-contain flex items-center"
          style={{ width: "90px", height: "90px" }}
        >
          <Image
            src={inactiveGif}
            alt="Recording"
            width={150}
            height={150}
            onClick={startRecording}
            priority={true}
            className="assistant cursor-pointer hover:scale-110 duration-150 border-2 border-black  transition-all ease-in-out"
          />
        </div>
      ) : null}
      {recordingStatus === "recording" ? (
        <div
          className="bg-black rounded-full overflow-hidden object-contain flex items-center"
          style={{ width: "90px", height: "90px" }}
        >
          <Image
            src={activeGif}
            alt="Recording"
            width={150}
            height={150}
            onClick={stopRecording}
            priority={true}
            className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Recorder;
