import "./styles.scss";
import sample from "./data/sample.json";
import { useEffect, useRef, useState } from "react";
import BrightcovePlayer from "@brightcove/react-player-loader";
import demoVideo from "./data/demo.mp4";

export default function App() {
  const videoPlayer = useRef<any>(null);
  const [videoPlaybackTime, setVideoPlaybackTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const setVideoToTextPos = (playbackPos: number) => {
    if (!videoPlayer || !videoPlayer.current) return;

    videoPlayer.current.currentTime(playbackPos);
    if (!isVideoPlaying) {
      videoPlayer.current.play();
      setIsVideoPlaying(true);
    }
  };

  const highlightTextStyle = (start: number, end: number) => {
    let highlightPercentage = 0;
    let basicPercentage = 0;

    if (videoPlaybackTime < start) {
      highlightPercentage = 0;
      basicPercentage = 0;
    } else if (videoPlaybackTime > end) {
      highlightPercentage = 100;
      basicPercentage = 100;
    } else {
      highlightPercentage = 0;
      basicPercentage = ((videoPlaybackTime - start) / (end - start)) * 100;
    }

    return {
      backgroundImage: `-webkit-linear-gradient(
        left,
        var(--color-highlight) ${highlightPercentage}%,
        var(--color-basic) ${basicPercentage}%
      )`,
    };
  };

  const text = () => {
    return sample.words.map((word, index) => (
      <span
        className="selectable-text"
        style={highlightTextStyle(word.start, word.end)}
        key={word.id}
        onClick={() => setVideoToTextPos(word.start)}
      >
        {word.forceAlignment}
        {index < sample.words.length - 1 ? "，" : "。"}
      </span>
    ));
  };

  const onSuccess = (player: any) => {
    videoPlayer.current = player.ref;
    if (videoPlayer && videoPlayer.current) {
      videoPlayer.current.on("timeupdate", () =>
        setVideoPlaybackTime(videoPlayer.current.currentTime())
      );

      videoPlayer.current.on("play", () => setIsVideoPlaying(true));
      videoPlayer.current.on("pause", () => setIsVideoPlaying(false));
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="App">
      <div>
        <h1>Demo Video</h1>
        <div className="reference">
          <video controls>
            <source src={demoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <hr />
      <div>
        <h1>Tasks</h1>
        <ul>
          <li>
            Align the text with the audio timing (approximate alignment is
            acceptable).
          </li>
          <li>
            When the text is clicked, it will jump to a specific point in the
            audio and play continuously.
          </li>
          <li>If the audio is paused, the text effect will also stop.</li>
          <small>
            (In sample json, the start and end times are based on the specific
            sentence and its corresponding audio timestamps.)
          </small>
        </ul>
      </div>
      <div>
        <h1>Requirements</h1>
        <ul>
          <li>Fork this project.</li>
          <li>Code in TypeScript, React but no jQuery .</li>
          <li>Keep the code simple and clean.</li>
          <li>
            Run in latest Chrome. No need to worry about browser compatibility.
          </li>
          <li>
            The test is suggested to take around 30 - 45 minutes to complete.
          </li>
        </ul>
      </div>
      <div>
        <h1>Implementation</h1>
        <BrightcovePlayer
          accountId="6144772950001"
          videoId="6299964659001"
          onSuccess={onSuccess}
          preload="none"
        />
        <div className="content">{text()}</div>
      </div>
    </div>
  );
}
