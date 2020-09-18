import React from 'react';
import {Caption, Button, Text, Title, Separator} from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import PanelHeaderBack from "@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";

const Post = ({ id, post, goToPanel }) => {
  const { title, description, audioTitle, preview, timecodes} = post;

  const handlePublishClick = () => {
    goToPanel('final');
  }

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => {}} />}>
        Новый подкаст
      </PanelHeader>

      <Div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className="PostPreview" style={{marginRight: 12}}>
            <img src={preview} />
          </div>
          <div>
            <Title level="3" weight="bold" style={{marginBottom: 4}}>{title}</Title>
            <Caption level="2" style={{color: '#4986CC', marginBottom: 4}}>Автор подкаста</Caption>
            <Caption level="2" style={{color: '#818C99'}}>Длительность: 32:31</Caption>
          </div>
        </div>
      </Div>

      <Separator />

      <Div>
        <Title level="3" weight="bold" style={{marginBottom: 8, marginTop: 8}}>Описание</Title>
        <Text style={{marginBottom: 8}}>{description}</Text>
      </Div>

      <Separator />

      <Div>
        <Title level="3" weight="bold" style={{marginBottom: 16, marginTop: 8}}>Содержание</Title>
        {timecodes.length === 0 && (
          <Text>Вы не создали таймкоды для подкаста</Text>
        )}

        {timecodes.map(({id, time, description}) => (
          <div key={id} style={{display: 'flex', alignItems: 'center', marginBottom: 16}}>
            <Caption style={{color: '#4986CC', marginRight: 6}}>{time}</Caption> — <Caption style={{marginLeft: 6}}>{description}</Caption>
          </div>
        ))}
      </Div>

      <Separator />

      <Div>
        <Button style={{marginTop: 16}} size="xl" onClick={handlePublishClick}>Опубликовать подкаст</Button>
      </Div>
    </Panel>
  );
}

export default Post;
