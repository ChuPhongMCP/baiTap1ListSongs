import React, { useState, useRef, useEffect } from "react";
import { formatTime } from "../../helper";

function GetTimeSong(props) {
  const { path } = props;

  const [duration, setDuration] = useState(0);

  const audioRef = useRef();

  useEffect(() => {
    function getTrackLength() {
      audioRef.current.addEventListener("loadedmetadata", function () {
        setDuration(audioRef.current.duration);
      });
    }

    getTrackLength();
  }, []);

  return (
    <>
      <audio ref={audioRef} src={path}>
        html5 audio not supported
      </audio>
      {formatTime(duration)}
    </>
  );
}

export default GetTimeSong;
