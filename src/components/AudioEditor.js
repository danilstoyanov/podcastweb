import React, { useEffect, useRef, useState } from "react";
import cn from 'classnames';

import { Icon28Play, Icon28Pause } from '@vkontakte/icons';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import { nanoid } from "nanoid";

export const AudioEditor = (props) => {
  const { audio, audioDuration, waveForm } = props;

  const [isPlaying, setIsPlaying] = useState(false);

  const trackRef = useRef();
  const waveFormRef = useRef();
  const timelineRef = useRef();
  const visorRef = useRef();

  useEffect(() => {
    waveFormRef.current.addEventListener('scroll', event => {
      const {target} = event;
      timelineRef.current.scrollLeft = target.scrollLeft;
    })

    timelineRef.current.addEventListener('scroll', event => {
      const {target} = event;
      waveFormRef.current.scrollLeft = target.scrollLeft;
    })
  }, [])

  const drawTimeLine = () => {
    const ticks = [];

    let minutes = 0;
    let seconds = 0;

    for(let i = 0; i < audioDuration; i++) {
      const tick = {
        value: i,
      };

      seconds += 1;

      if(seconds === 60) {
        minutes += 1;
        seconds = 0;
      }

      if(i % 10 === 0) {
        tick.type = 'Tick--Large';

        if(i !== 0) {
          tick.time = `${minutes > 10 ? minutes : '0' + minutes}:${seconds < 9 ? '0' + seconds - 1 : seconds - 1}`
        }
      } else if(i % 2 === 0) {
        tick.type = 'Tick--Medium';
      } else {
        tick.type = 'Tick--Small';
      }

      ticks.push(tick)
    }

    return <div className="Timeline" ref={timelineRef}>
      {ticks.map(tick => {
        return <div key={nanoid()} className={cn("Tick", tick.type)}>
          {tick.type === "Tick--Large" && (
            <span className="TickTime">{tick.time}</span>
          )}
        </div>
      })}
    </div>
  }

  const drawWaveForm = () => {
    return <div className="WaveForm" ref={waveFormRef}>
      {waveForm.map(item => {
        return <div key={nanoid()} className="WaveItem" style={{height: item}}></div>
      })}
    </div>
  }

  const playAudio = (event) => {
    const context = new AudioContext();
    const source = context.createBufferSource();

    context.decodeAudioData(audio, (decodedAudioBuffer) => {
      source.buffer = decodedAudioBuffer;
      source.connect(context.destination);
      source.start(0);

      setIsPlaying(true);

      // грязные хаки с глобальным контекстом
      window.currentAudio = source;
      window.playInterval = setInterval(() => {
        const prev = Number(visorRef.current.style.left.replace('px', ''));
        visorRef.current.style.left = (prev + 4) + 'px';
      }, 300)
    })
  }

  const stopAudio = () => {
    if(!window.currentAudio) {
      return;
    }

    window.currentAudio.stop();

    clearInterval(window.playInterval);
    setIsPlaying(false);
  }

  return (
    <Div>
      <div className="TrackWrapper" ref={trackRef}>
        <div className="Visor" ref={visorRef} style={{ left: "16px" }}></div>

        <div className="TrackContent">
          {drawTimeLine()}
          {drawWaveForm()}
        </div>

        <div className="Controls">
          <button
            className="Controls_Play"
            onClick={() => {
              if (isPlaying) {
                stopAudio();
                return;
              }

              playAudio();
            }}
          >
            {isPlaying ? (
              <Icon28Pause fill="#fff" />
            ) : (
              <Icon28Play fill="#fff" />
            )}
          </button>
        </div>
      </div>
    </Div>
  );
};
