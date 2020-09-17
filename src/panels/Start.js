import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';

import { Icon56AddCircleOutline, Icon12Cancel } from "@vkontakte/icons";

const Start = ({ id, goToPanel }) => {
  const handleCreateButtonClick = () => {
    goToPanel('create')
  }

  return (
    <Panel id={id}>
      <PanelHeader>Подкасты</PanelHeader>
  
      <Placeholder
        stretched
        header="Добавьте первый подкаст"
        icon={<Icon56AddCircleOutline />}
        action={<Button size="m" onClick={handleCreateButtonClick}>Добавить подкаст</Button>}
      >
        Добавляйте, редактируйте и делитесь подкастами вашего сообщества
      </Placeholder>
    </Panel>
  );
}

export default Start;
