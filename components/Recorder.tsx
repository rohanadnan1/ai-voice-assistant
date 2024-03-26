import Image from "next/image";
import { activeGif } from "@/images";

const Recorder = ({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) => {
  return (
    <div className="flex items-center justify-center">
      <Image src={activeGif} alt="Recorder" width={150} height={150} />
    </div>
  );
};

export default Recorder;
