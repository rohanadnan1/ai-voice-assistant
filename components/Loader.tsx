import { useFormStatus } from "react-dom";
import { SyncLoader } from "react-spinners";

const Loader = () => {
  const { pending } = useFormStatus();
  return (
    pending && (
      <div className="message m-auto">
        <SyncLoader color="black" />
      </div>
    )
  );
};

export default Loader;
