"use client";

import { useUrlParams } from "@/utils/useUrlParams";
import { TrulienceAvatar } from "@trulience/react-sdk";
import { useRef, useState } from "react";

const enum ConnectionState {
  CONNECTING = 1,
  CONNECTED = 2,
  DISCONNECTED = 0
}

type AvatarQuery = {
  avatarId: string;
};

export default function Home() {
  const avatarRef = useRef<TrulienceAvatar>(null);
  const { avatarId } = useUrlParams<AvatarQuery>();
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED)

  const handleOnConnect = () => {
    const trulienceObj = avatarRef.current?.getTrulienceObject();
    setConnectionState(ConnectionState.CONNECTING)
    trulienceObj?.connectGateway();
  };

  if ( !avatarId ) {
    return (
      <div className="w-screen h-screen relative overflow-hidden flex justify-center items-center text-xl">
        Please pass the avatarId through the URL using a query parameter, like ?avatarId=xxxxx
      </div>
    )
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Wrapper to control height responsively */}
      <div className="w-full h-1/2 md:h-full">
        <TrulienceAvatar
          ref={avatarRef}
          avatarId={avatarId}
          url="https://trulience.com/sdk/trulience.sdk.js"
          autoConnect={false}
          prefetchAvatar={true}
          eventCallbacks={{
            "websocket-connect": () => {
              setConnectionState(ConnectionState.CONNECTED)
            }
          }}
          avatarParams={{
            NativeBar: {
              enabled: true,
              style: {
                bar: {
                  background: "orange",
                },
                container: {
                  background: "#e0e0de",
                  "border-radius": "10px",
                  height: "10px",
                },
              },
            },
          }}
        />
      </div>

      {/* Connect Button */}
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 cursor-pointer
      absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        onClick={handleOnConnect}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5l2 2a16 16 0 0014 14l2-2a2 2 0 00-1-3l-4-1a2 2 0 00-2 1l-1 2a12 12 0 01-6-6l2-1a2 2 0 001-2l-1-4a2 2 0 00-3-1z"
          />
        </svg>
        {connectionState === ConnectionState.DISCONNECTED ? "Join Call" : connectionState === ConnectionState.CONNECTING ? "Joining...": "End Call" }
      </button>
    </div>
  );
}
