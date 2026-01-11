import { useState, useRef } from "react";

import "./App.css";

function App() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  // This function will start the recording.
  const startRecording = async () => {
    // This will ask the use to select a screen or a window to capture.
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    
    // This is to detect when the user stops the screen sharing from the browser UI.
    const videoTrack = stream.getVideoTracks()[0];

    videoTrack.onended = () => {
      stopRecording();
    };
    
    // This will create a MediaRecorder instance which will record the stream.
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    
    // This event is fired whenever the recorder has some data available.
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
        console.log(chunksRef.current);
      }
    };
   
    // This event is fired when the recording is stopped.
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      console.log(blob);
      const url = URL.createObjectURL(blob);
      console.log(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();

      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // This function will stop the recording.
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };  

  

   return (
    <div style={{ padding: 40 }}>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <h3>Click on stop sharing button to stop recording.....</h3>
      )}
    </div>
  );
}

export default App;