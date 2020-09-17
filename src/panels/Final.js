import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import { Icon56CheckCircleOutline } from "@vkontakte/icons";

const Final = ({ id, goToPanel }) => {
  return (
    <Panel id={id} stretched>
      <PanelHeader>Подкасты</PanelHeader>
  
      <Placeholder
        stretched
        header="Подкаст добавлен"
        icon={<Icon56CheckCircleOutline fill="#3F8AE0" />}
        action={<Button size="m" onClick={() => { alert('Это всё ^_^\nМожете обновить страничку') }}>Поделиться подкастом</Button>}
      >
        Раскажите своим подписчикам о новом подкасте, чтобы получить больше слушателей.
      </Placeholder>
    </Panel>
  );
}

export default Final;
