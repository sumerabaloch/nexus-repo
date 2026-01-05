import { useEffect, useRef } from "react";
import socket from "../../socket";

interface Props {
  roomId: string;
}

const VideoCall = ({ roomId }: Props) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // 1️⃣ Join room
    socket.emit("join-room", roomId);

    // 2️⃣ Init camera + peer connection
    const initCall = async () => {
      // Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = pc;

      // Send local tracks
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Receive remote tracks
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };
    };

    initCall();

    // 3️⃣ When second user joins → create OFFER
    socket.on("user-joined", async () => {
      if (!peerRef.current) return;

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socket.emit("offer", { roomId, offer });
    });

    // 4️⃣ Receive OFFER → create ANSWER
    socket.on("offer", async (offer) => {
      if (!peerRef.current) return;

      await peerRef.current.setRemoteDescription(offer);

      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socket.emit("answer", { roomId, answer });
    });

    // 5️⃣ Receive ANSWER
    socket.on("answer", async (answer) => {
      if (!peerRef.current) return;

      await peerRef.current.setRemoteDescription(answer);
    });

    // 6️⃣ Receive ICE
    socket.on("ice-candidate", async (candidate) => {
      if (!peerRef.current) return;

      await peerRef.current.addIceCandidate(candidate);
    });

    // 7️⃣ Cleanup
    return () => {
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());

      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <video ref={localVideoRef} autoPlay muted playsInline width={300} />
      <video ref={remoteVideoRef} autoPlay playsInline width={300} />
    </div>
  );
};

export default VideoCall;