"use client"

import ReactPlayer from "react-player"

interface VideoPlayerProps {
  url: string
  onEnded?: () => void
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="100%"
        onEnded={onEnded}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />
    </div>
  )
}
