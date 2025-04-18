import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import "./PostMain.css";
import video from "./123.mp4";
import subtitles from "./subtitles.json";

const PostMain = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const currentTime = video.currentTime;
      const active = subtitles.find(
        (s) => currentTime >= s.start && currentTime <= s.end
      );
      setCurrentSubtitle(active || null);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = document.getElementById("PostMain-video");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const video = videoRef.current;

        if (!video) return;

        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch((err) => {
              console.warn("Play error:", err);
            });
            setIsPaused(false);
          }
        } else {
          if (!video.paused) {
            setTimeout(() => {
              video.pause();
              setIsPaused(true);
            }, 100);
          }
        }
      },
      { threshold: [0.6] }
    );

    if (target) observer.observe(target);

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.src = '';
      }
      if (target) observer.unobserve(target);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => { });
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleAction = (action) => {
    if (!action) return;

    try {
      // безопасный парсинг — можно заменить на switch
      const fn = action.split("(")[0];
      const param = action.match(/'(.*?)'/)?.[1];

      if (fn === "alert") {
        alert(param);
      } else if (fn === "log") {
        console.log(param);
      }
      // добавь свои функции здесь
    } catch (e) {
      console.error("Invalid action", action);
    }
  };

  return (
    <>
      <div id="PostMain-video" className="post-container">

        {currentSubtitle && (
          <div className="custom-subtitles">
            {currentSubtitle.text.map((wordObj, idx) => (
              <span
                key={idx}
                onClick={() => handleAction(wordObj.action)}
                className={wordObj.action ? "clickable-word" : ""}
              >
                {wordObj.word}&nbsp;
              </span>
            ))}
          </div>
        )}

        <video
          ref={videoRef}
          loop
          muted={isMuted}
          className="post-video"
          src={video}
          onClick={togglePlay}
        />

        {/* Кнопка звука */}
        <button className="volume-button" onClick={toggleMute}>
          <Icon
            icon={isMuted ? "mdi:volume-off" : "mdi:volume-high"}
            width="24"
            color="#fff"
          />
        </button>

        {/* Правая панель */}
        <div className="post-sidebar">
          <div className="avatar-section">
            <div className="avatar">
              <img src="https://i.pravatar.cc/100" alt="avatar" />
            </div>
            <button className="plus-button">
              <Icon icon="mdi:plus" width="14" />
            </button>
          </div>

          <div className="sidebar-icon">
            <Icon icon="mdi:heart" width="28" />
            <span>15.9K</span>
          </div>
          <div className="sidebar-icon">
            <Icon icon="mdi:comment" width="28" />
            <span>2738</span>
          </div>
          <div className="sidebar-icon">
            <Icon icon="mdi:share" width="28" />
            <span>5333</span>
          </div>
        </div>

        {/* Подпись */}
        <div className="post-footer">
          <div className="username">deyzigucci</div>
          <div className="caption">А ну ка интересно почитать ваш опыт ...</div>
          <div className="music">
            <Icon icon="mdi:music" width="16" />
            <span>Dark Thoughts - Lil Tecca</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostMain;
