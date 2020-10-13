import React from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

const host = process.env.REACT_APP_MEDIA_SERVER_HOST;
const port = process.env.REACT_APP_MEDIA_SERVER_PORT;

class VideoPlayer extends React.Component<Props, State> {
  private player: VideoJsPlayer | null = null;
  private videoNode: React.RefObject<HTMLVideoElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      stream: false,
      videoJsOptions: {}
    }

    this.videoNode = React.createRef();
  }

  componentDidMount() {
    const { streamKey } = this.props;

    this.setState({
      stream: true,
      videoJsOptions: {
        autoplay: false,
        controls: true,
        sources: [{
          src: `${host}:${port}/live/${streamKey}/index.m3u8`,
          type: 'application/x-mpegURL'
        }],
        fluid: true,
      }
    }, () => {
      this.player = videojs(this.videoNode.current, this.state.videoJsOptions, () => {
        if (this.player) {
          this.player.play();
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    return this.state.stream ? (
      <div data-vjs-player>
        <video ref={this.videoNode} className="video-js vjs-big-play-centered"/>
      </div>
    ) : ' Loading ... ';
  }
}

type Props = {
  streamKey: string,
}

type State = {
  stream: boolean,
  videoJsOptions: VideoJsPlayerOptions
}

export default VideoPlayer;