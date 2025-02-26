import React from "react";
import { FormSection } from "../sections/form-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    // PersonalComment: if required change max-w-screen-2xl to max-w-screen-xl
    <div className="px-4 pt-2.5 max-w-screen-2xl"> 
      <FormSection videoId={videoId} />
    </div>
  );
};

export default VideoView;
