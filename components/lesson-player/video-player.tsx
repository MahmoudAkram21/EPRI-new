"use client"

import ReactPlayer from "react-player"

interface VideoPlayerProps {
  url: string
  onEnded?: () => void
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  return (
    <div className="w-full h-full bg-black">
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="100%"
        playing={false}
        onEnded={onEnded}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
        style={{
          backgroundColor: "#000",
        }}
      />
    </div>
  )
}
