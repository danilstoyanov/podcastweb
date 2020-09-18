import React, { useState } from "react";
import { nanoid } from "nanoid";
import WaveformData from "waveform-data";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import File from "@vkontakte/vkui/dist/components/File/File";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import {
  FormLayout,
  Input,
  Text,
  Caption,
  Textarea,
  Placeholder,
  Button,
  Separator,
  Checkbox,
} from "@vkontakte/vkui";

import { AudioEditor } from "../components/AudioEditor";

import {
  Icon12Cancel,
  Icon28PictureOutline,
  Icon28PodcastOutline,
} from "@vkontakte/icons";

import PanelHeaderBack from "@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack";

const ImagePreview = ({ imageSrc, onResetPreviewClick }) => {
  return (
    <div className="ImagePreview">
      <button onClick={onResetPreviewClick}>
        <Icon12Cancel fill="#FFF" />
      </button>

      <img src={imageSrc} />
    </div>
  );
};

const Create = ({ id, goToPanel, post, setPostState }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  const [audio, setAudio] = useState(null);
  const [audioTitle, setAudioTitle] = useState(post.audioTitle);
  const [audioStepActive, setAudioStepActive] = useState(false);

  const [preview, setPreview] = useState(post.preview);
  const [waveForm, setWaveForm] = useState([]);
  const [audioDuration, setAudioDuration] = useState(0);

  const [isBadWords, setIsBadWords] = useState(false);
  const [isExcludeEpisode, setIsExcludeEpisode] = useState(false);
  const [isTrailer, setIsTrailer] = useState(false);

  const [timecodes, setTimecodes] = useState(post.timecodes);

  const handleBackClick = () => {
    if (audioStepActive) {
      setAudioStepActive(false);

      return;
    }

    goToPanel("start");
  };

  const handleAudioUpload = (file) => {
    if (!file.type.startsWith("audio/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const audioContext = new AudioContext();

      const binaryAudioData = event.target.result;
      const bufferCopy = binaryAudioData.slice(0);

      audioContext
        .decodeAudioData(binaryAudioData)
        .then((audioBuffer) => {
          const options = {
            audio_context: audioContext,
            audio_buffer: audioBuffer,
            scale: 512,
          };

          return new Promise((resolve, reject) => {
            WaveformData.createFromAudio(options, (err, waveform) => {
              if (err) {
                reject(err);
              } else {
                resolve(waveform);
              }
            });
          });
        })
        .then((waveform) => {
          const reasmpledWaveForm = waveform.resample({
            width: waveform.duration,
          });
          const channel = reasmpledWaveForm.channel(0);
          const arr = [];

          for (let x = 0; x < reasmpledWaveForm.length; x++) {
            let val = 0;

            if (channel.max_sample(x) < 1) {
              arr.push(2);
              continue;
            }

            // Для лучшего контраста
            if (x % 3 === 0) {
              val = channel.max_sample(x) / 4;
            } else {
              val = channel.max_sample(x) / 3;
            }

            arr.push(val);
          }

          setWaveForm(arr);
          setAudioDuration(Math.floor(waveform.duration));
          setAudioTitle(file.name);
        });

      setAudio(bufferCopy);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImageUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setPreview(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleImageResetClick = () => {
    setPreview(null);
  };

  const handleTimecodeAdd = () => {
    if (timecodes.some((item) => item.time === "" && item.description === "")) {
      alert("Заполните предидущий таймкод");

      return;
    }

    setTimecodes([...timecodes, { id: nanoid(), time: "", description: "" }]);
  };

  const handleTimecodeRemove = (id) => {
    setTimecodes(timecodes.filter((item) => item.id !== id));
  };

  const handleTimecodeInputChange = (id, field, value) => {
    setTimecodes(
      timecodes.map((item) => {
        if (item.id !== id) {
          return item;
        }

        item[field] = value;

        return item;
      })
    );
  };

  console.log(post, 'post')

  const handleFormSubmit = () => {
    setPostState({
      title,
      description,
      audioTitle,
      preview,
      timecodes
    })

    goToPanel("post")
  }

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={handleBackClick} />}>
        {audioStepActive ? "Редактирование" : "Новый подкаст"}
      </PanelHeader>

      {!audioStepActive && (
        <React.Fragment>
          <Div>
            <div className="PreviewSection">
              {preview ? (
                <ImagePreview
                  imageSrc={preview}
                  onResetPreviewClick={handleImageResetClick}
                />
              ) : (
                <File
                  className="FileInputWrapper"
                  controlSize="xl"
                  mode="tertiary"
                  name="preview"
                  before={<Icon28PictureOutline />}
                  onChange={(event) => {
                    handleImageUpload(event.target.files[0]);
                  }}
                />
              )}

              <FormLayout>
                <Input
                  top="Название"
                  name="title"
                  value={title}
                  onChange={({ target }) => {
                    setTitle(target.value);
                  }}
                  placeholder="Введите название подкаста"
                />
              </FormLayout>
            </div>
          </Div>

          <FormLayout>
            <Textarea
              placeholder=""
              top="Описание подкаста"
              value={description}
              onChange={({ target }) => {
                setDescription(target.value);
              }}
            />
          </FormLayout>

          {audio ? (
            <Div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F2F3F5",
                    marginRight: 12,
                    padding: 12,
                    flexGrow: 0,
                    borderRadius: 12,
                  }}
                >
                  <Icon28PodcastOutline fill="#99A2AD" />
                </div>
                <Text weight="medium">{audioTitle}</Text>
              </div>

              <Text
                style={{
                  color: "#818C99",
                  fontSize: "13px",
                  marginTop: "8px",
                  marginBottom: "16px",
                }}
              >
                Вы можете добавить таймкоды и скорректировать подкаст в режиме
                редактирования
              </Text>

              <Button
                size="xl"
                mode="outline"
                style={{ marginBottom: "4px" }}
                onClick={() => {
                  setAudioStepActive(true);
                }}
              >
                Редактировать аудиозапись
              </Button>
            </Div>
          ) : (
            <Placeholder
              header="Загрузите ваш подкаст"
              action={
                <File
                  size="m"
                  mode="outline"
                  top="Загрузите подкаст"
                  before={null}
                  onChange={(event) => {
                    handleAudioUpload(event.target.files[0]);
                  }}
                />
              }
            >
              Выберите готовый аудиофайл из вашего телефона и добавьте его
            </Placeholder>
          )}

          <Separator />

          <div className="SettingsSection">
            <FormLayout>
              <Checkbox
                value={isBadWords}
                onChange={() => {
                  setIsBadWords(!isBadWords);
                }}
              >
                Ненормативный контент
              </Checkbox>
              <Checkbox
                value={isExcludeEpisode}
                onChange={() => {
                  setIsExcludeEpisode(!isExcludeEpisode);
                }}
              >
                Исключить эпизод из экспорта
              </Checkbox>
              <Checkbox
                value={isTrailer}
                onChange={() => {
                  setIsTrailer(!isTrailer);
                }}
              >
                Трейлер подкаста
              </Checkbox>
            </FormLayout>
          </div>

          <Div
            onClick={() => {
              alert("Заглушчека ^_^");
            }}
          >
            <Text weight="medium" style={{ marginBottom: 4 }}>
              Кому доступен данный подкаст
            </Text>
            <Caption level="3" style={{ color: "#818C99" }}>
              Всем пользователям
            </Caption>

            <Caption level="1" style={{ marginTop: 16, color: "#818C99" }}>
              При публикации записи с эпизодом, он становится доступным для всех
              пользователей
            </Caption>
          </Div>

          <Div>
            <Button size="xl" onClick={handleFormSubmit}>Далее</Button>
          </Div>
        </React.Fragment>
      )}

      {audioStepActive && (
        <React.Fragment>
          <AudioEditor
            audio={audio}
            audioDuration={audioDuration}
            waveForm={waveForm}
          />

          <Div>
            <Caption
              level="1"
              weight="semibold"
              caps
              style={{ marginBottom: 16, color: "#818C99" }}
            >
              Таймкоды
            </Caption>

            {timecodes.map(({ id, time, description }) => {
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                  className="TimecodeItem"
                >
                  <div
                    onClick={() => {
                      handleTimecodeRemove(id);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0ZM16 10H6C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12H16C16.5523 12 17 11.5523 17 11C17 10.4477 16.5523 10 16 10Z"
                        fill="#E64646"
                      />
                    </svg>
                  </div>

                  <Input
                    value={description}
                    placeholder="Описание"
                    style={{ marginRight: 8, flexGrow: 1 }}
                    onChange={({ target }) => {
                      handleTimecodeInputChange(
                        id,
                        "description",
                        target.value
                      );
                    }}
                  />

                  <Input
                    value={time}
                    type="text"
                    maxLength="5"
                    placeholder="00:00"
                    style={{ marginLeft: 8, flexShrink: 1 }}
                    onChange={({ target }) => {
                      handleTimecodeInputChange(id, "time", target.value);
                    }}
                  />
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
              onClick={handleTimecodeAdd}
            >
              <div>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0ZM11 5C10.4477 5 10 5.44772 10 6V10H6C5.48716 10 5.06449 10.386 5.00673 10.8834L5 11C5 11.5523 5.44772 12 6 12H10V16C10 16.5128 10.386 16.9355 10.8834 16.9933L11 17C11.5523 17 12 16.5523 12 16V12H16C16.5128 12 16.9355 11.614 16.9933 11.1166L17 11C17 10.4477 16.5523 10 16 10H12V6C12 5.48716 11.614 5.06449 11.1166 5.00673L11 5Z"
                    fill="#3F8AE0"
                  />
                </svg>
              </div>

              <Text style={{ color: "#3F8AE0", fontSize: 16, marginLeft: 12 }}>
                Добавить таймкод
              </Text>
            </div>

            <Caption level="1" style={{ color: "#818C99" }}>
              Отметки времени с названием темы. Позволяют слушателям легче
              путешествовать по подкасту.
            </Caption>
          </Div>
        </React.Fragment>
      )}
    </Panel>
  );
};

export default Create;
