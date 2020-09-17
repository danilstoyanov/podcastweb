import React, { useState, useRef } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';

import PanelHeaderBack from "@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";

const Post = ({ id, eventState }) => {
  const { preview, title } = eventState;

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => {}} />}>
        Новый подкаст
      </PanelHeader>

      
    </Panel>
  );
}

export default Post;
