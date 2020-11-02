import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@8base/boost';
import Hls from 'hls.js';

const Video = styled.video`
  width: 100%;
`;

const host = process.env.REACT_APP_MEDIA_SERVER_HOST;

export const VideoPlayer: React.FC<Props> = ({ streamKey }) => {
  const [hls, setHls] = useState<Hls>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const stream = new Hls();

      if (videoRef.current) {
        stream.attachMedia(videoRef.current);
      }

      setHls(stream);
    } else {

    }
  }, []);

  useEffect(() => {
    if (hls) {
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(`${host}/${streamKey}.m3u8`);

        console.log('Media Attached');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play();

        console.log('Manifest parsed');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('Error', event, data);
      });
    }
  }, [hls])

  return (
    <Video ref={videoRef} autoPlay={false} controls={true}>
      <h1>Video not Supported</h1>
    </Video>
  );
}

type Props = {
  streamKey: string,
}