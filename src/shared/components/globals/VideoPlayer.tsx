import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heading as BoostHeading, Column, styled } from '@8base/boost';
import { fetchGamePlaylist } from '../../../modules/game/game-actions';
import Hls from 'hls.js';
import Logger from 'js-logger';
import tvStatic from '../../assets/images/static.gif';

const Video = styled.video`
  width: 100%;
  border-radius: .5rem;
`;

const Heading = styled(BoostHeading)`
  color: #fff;
`;

const StaticSignal = styled.div`
  width: 100%;
  height: 450px;
  background-image: url(${tvStatic});
  background-repeat: repeat;
  border-radius: .5rem;
  overflow: hidden;
`;

const Shadow = styled(Column)`
  background-image: linear-gradient(rgba(0,0,0, 0.3), #000);
  padding: 24px;
`;

const host = process.env.REACT_APP_MEDIA_SERVER_HOST;

export const VideoPlayer: React.FC<Props> = ({ streamKey }) => {
  const [hls, setHls] = useState<Hls>();
  const [error, setError] = useState(false);
  const [, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faults = useRef<number>(0);

  const setup = useCallback(async () => {
    setError(false);
    setLoading(true);

    const [err] = await fetchGamePlaylist(streamKey);

    if (err) {
      return setError(true);
    }

    setLoading(false);

    if (Hls.isSupported()) {
      const stream = new Hls();
    
      if (videoRef.current) {
        stream.attachMedia(videoRef.current);
      }
    
      setHls(stream);
    }
  }, [streamKey]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    if (hls) {
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(`${host}/${streamKey}.m3u8`);

        Logger.debug('Media Attached');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play();

        Logger.debug('Manifest parsed');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        Logger.debug('Hls error', event, data);
        
        if (data.fatal) {
          if (faults.current > 0) {
            setError(true);
          } else {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
  
              case Hls.ErrorTypes.MEDIA_ERROR:
                if (faults.current === 1)
                  hls.swapAudioCodec();
  
                if (faults.current > 1) {
                  setError(true);
                } else {
                  hls.recoverMediaError();
                }              
                break;              
              default:
                setError(true);
                hls.destroy();
                break;
            }
          }

          faults.current = faults.current + 1;
        }
      });
    }
  }, [hls, streamKey]);

  if (error) {
    return (
      <StaticSignal>
        <Shadow stretch justifyContent="end" alignItems="start" gap="xs">
          <Heading type="h1" weight="bold">
            No se pudo reproducir el stream <span role="img" aria-label="Sad Face">😓</span>
          </Heading>
          <Heading type="h3" weight="bold">
            Por favor recargue la página para intentarlo de nuevo
          </Heading>
        </Shadow>
      </StaticSignal>
    );
  }

  return (
    <Video ref={videoRef} autoPlay={false} controls={true}>
      <h1>Video not Supported</h1>
    </Video>
  );
}

type Props = {
  streamKey: string,
}