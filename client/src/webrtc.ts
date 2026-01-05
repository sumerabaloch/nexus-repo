// client/src/webrtc.ts

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const createPeerConnection = () => {
  const pc = new RTCPeerConnection(rtcConfig);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("ICE candidate:", event.candidate);
    }
  };

  pc.ontrack = (event) => {
    console.log("Remote track received", event.streams);
  };

  return pc;
};