import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import styles from "./listSong.module.css";
import IconPlay from "../icon/play";
import IconPause from "../icon/Pause";
import IconBackward from "../icon/backward";
import IconForward from "../icon/forward";
import PropTypes from "prop-types";
import IconRandom from "../icon/random";
import IconRepeatCheck from "../icon/repeatCheck";
import IconRepeat from "../icon/repeat";
import IconRandomCheck from "../icon/randomCheck";
import IconRepeatOne from "../icon/repeatOne";
import { formatTime } from "../../helper";
import { getRamdom } from "../../helper";

function ListSong(props) {
  const { items } = props;

  const [songs, setSongs] = useState(items);

  const audioRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [progress, setProgress] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [currentItem, setCurrentItem] = useState(1);

  const [randomItem, setRandomItem] = useState(false);

  const [repeatItem, setRepeatItem] = useState(1);

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    function getTrackLength() {
      audioRef.current.addEventListener("loadedmetadata", function () {
        setDuration(audioRef.current.duration);
      });
    }

    getTrackLength();
  }, []);

  const onSelectItem = useCallback((event) => {
    setCurrentItem(parseInt(event.target.value));
  }, []);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleBackward = useCallback(() => {
    if (currentItem > 1) {
      setCurrentItem(currentItem - 1);
    } else {
      setCurrentItem(songs.length);
    }
  }, [currentItem, songs.length]);

  const handleForward = useCallback(() => {
    if (currentItem < songs.length) {
      setCurrentItem(currentItem + 1);
    } else {
      setCurrentItem(1);
    }
  }, [currentItem, songs.length]);

  const handleAudioEnded = useCallback(() => {
    if (repeatItem === 3) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatItem === 2) {
      if (randomItem) {
        const randomNumber = getRamdom(1, songs.length, currentItem);
        setCurrentItem(randomNumber);
      } else {
        if (currentItem < songs.length) {
          setCurrentItem(currentItem + 1);
        } else {
          setCurrentItem(1);
        }
      }
    } else {
      if (randomItem) {
        const randomNumber = getRamdom(1, songs.length, currentItem);
        setCurrentItem(randomNumber);
      } else {
        if (currentItem < songs.length) {
          setCurrentItem(currentItem + 1);
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [currentItem, songs.length, randomItem, repeatItem]);

  const handleRandom = useCallback(() => {
    setRandomItem((random) => !random);
  }, []);

  const handleRepeat = useCallback(() => {
    if (repeatItem === 1) {
      setRepeatItem(2);
    } else if (repeatItem === 2) {
      setRepeatItem(3);
    } else {
      setRepeatItem(1);
    }
  }, [repeatItem]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(audioRef.current.currentTime);

      const duration = audioRef.current.duration;
      const calculatedProgress =
        (audioRef.current.currentTime / duration) * 100;
      setProgress(calculatedProgress);
    }, 1);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleProgressBarClick = useCallback((event) => {
    const progressBar = event.target;
    const rect = progressBar.getBoundingClientRect();
    const totalWidth = rect.width;
    const clickX = event.nativeEvent.offsetX;
    const calculatedTime = (clickX / totalWidth) * audioRef.current.duration;
    audioRef.current.currentTime = calculatedTime;

    const duration = audioRef.current.duration;
    const calculatedProgress = (audioRef.current.currentTime / duration) * 100;
    setProgress(calculatedProgress);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    audioRef.current.pause();
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    audioRef.current.play();
  }, []);

  const handleDrag = useCallback(
    (event) => {
      if (!isDragging) return;
      const progressBar = event.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const totalWidth = rect.width;
      const clickX = event.nativeEvent.offsetX;
      const calculatedTime = (clickX / totalWidth) * audioRef.current.duration;
      audioRef.current.currentTime = calculatedTime;

      const duration = audioRef.current.duration;
      const calculatedProgress =
        (audioRef.current.currentTime / duration) * 100;
      setProgress(calculatedProgress);
    },
    [isDragging]
  );

  const handleLike = useCallback(
    (event, index) => {
      event.stopPropagation();
      const updatedSongs = [...songs];
      updatedSongs[index].isLike = !updatedSongs[index].isLike;
      setSongs(updatedSongs);
    },
    [songs]
  );

  const displayImage = useMemo(() => {
    const images = items.find((t) => t.num === currentItem).image;
    return images;
  }, [currentItem, items]);

  const displaySongName = useMemo(() => {
    const name = items.find((t) => t.num === currentItem).name;
    return name;
  }, [currentItem, items]);

  const displayBand = useMemo(() => {
    const band = items.find((t) => t.num === currentItem).band;
    return band;
  }, [currentItem, items]);

  const playAudio = useMemo(() => {
    const audio = items.find((t) => t.num === currentItem).path;
    return audio;
  }, [currentItem, items]);

  const keyItem = useMemo(() => {
    const key = items.find((t) => t.num === currentItem).num;
    return key;
  }, [currentItem, items]);

  return (
    <div className={styles.listBlock}>
      <div className={styles.numOfSong}>
        <div className={styles.mostPopular}>
          <div className={styles.textPopular}>Popular</div>

          <div className={styles.numPopular}>{songs.length} Songs</div>
        </div>

        <div className={styles.nowPlaying}>
          <div className={styles.textPlaying}>Now Playing</div>

          <div className={styles.numPlaying}>
            {currentItem}/{songs.length} Items on the list
          </div>
        </div>
      </div>

      <div className={styles.listSong}>
        {songs.map((song, index) => {
          return (
            <button
              key={song.num}
              value={parseInt(song.num)}
              className={`${styles.itemSong} ${
                currentItem === song.num ? styles.itemSongActive : ""
              }`}
              onClick={onSelectItem}
            >
              <span className={styles.numSong}>{song.num}</span>

              <img className={styles.itemImage} src={song.image} alt="01" />

              {currentItem === song.num && isPlaying ? (
                <div className={styles.playSong}>
                  <i
                    className="fa-solid fa-volume-high fa-xl"
                    style={{ color: "#9e9e9e" }}
                  ></i>
                </div>
              ) : (
                <div className={styles.playSong}>
                  <i
                    className="fa-solid fa-caret-right fa-2xl"
                    style={{ color: "#9e9e9e" }}
                  />
                </div>
              )}

              <span className={styles.nameSong}>{song.name}</span>

              <span className={styles.nameBand}>{song.band}</span>

              <span className={styles.time}>{song.time}</span>

              <i
                id={parseInt(song.num)}
                value={parseInt(song.num)}
                onClick={(event) => handleLike(event, index)}
                className={`fa-solid fa-heart fa-2xl ${styles.heart}`}
                style={song.isLike ? { color: "#fe3448" } : { color: "gray" }}
              />
            </button>
          );
        })}
      </div>

      <div className={styles.selectedSong}>
        <div className={styles.playingSong}>
          <div className={styles.coverDisk}>
            <img
              key={keyItem}
              className={`${styles.selectedImage} ${
                isPlaying ? "" : styles.paused_animation
              }`}
              src={displayImage}
              alt="01"
            />

            <div className={styles.circle}></div>

            <div className={styles.circleSmall}></div>
          </div>

          <span className={styles.song}>{displaySongName}</span>

          <span className={styles.band}>{displayBand}</span>

          <audio
            ref={audioRef}
            className={styles.audio}
            src={playAudio}
            autoPlay
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleAudioEnded}
          >
            html5 audio not supported
          </audio>

          <div
            className={styles.coverProgress}
            onClick={handleProgressBarClick}
            onMouseMove={handleDrag}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
          >
            <div
              className={styles.progress_bar_dot}
              style={{ left: `${progress - 1.5}%` }}
            ></div>

            <progress
              className={styles.time_progress}
              value={progress}
              max={100}
            ></progress>
          </div>

          <div className={styles.timeSongInPlay}>
            <div className={styles.currentTime}>{formatTime(currentTime)}</div>

            <div className={styles.totalTime}>{formatTime(duration)}</div>
          </div>
        </div>

        <div className={styles.coverButton}>
          <button className={styles.btnRandom} onClick={handleRandom}>
            {randomItem ? <IconRandomCheck /> : <IconRandom />}
          </button>

          <button className={styles.btnBackward} onClick={handleBackward}>
            <IconBackward />
          </button>

          <button className={styles.btnPlay} onClick={toggleAudio}>
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          <button className={styles.btnForward} onClick={handleForward}>
            <IconForward />
          </button>

          <button className={styles.btnRepeat} onClick={handleRepeat}>
            {repeatItem === 1 ? (
              <IconRepeat />
            ) : repeatItem === 2 ? (
              <IconRepeatCheck />
            ) : repeatItem === 3 ? (
              <IconRepeatOne />
            ) : (
              ""
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

ListSong.propTypes = {
  items: PropTypes.arrayOf(String).isRequired,
};

export default ListSong;
