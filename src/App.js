import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';

import Start from './panels/Start';
import Create from './panels/Create';
import Post from './panels/Post';
import Final from './panels/Final';

import './main.css';

const App = () => {
  const [activePanel, setActivePanel] = useState('start');
  const [post, setPostState] = useState({
    title: '',
    description: '',
    audioTitle: '',
    preview: null,
    timecodes: []
  })

  const goToPanel = panelName => {
    setActivePanel(panelName);
  };

  return (
    <View activePanel={activePanel}>
      <Start
        id="start"
        goToPanel={goToPanel}
      />

      <Create
        id="create"
        goToPanel={goToPanel}
        post={post}
        setPostState={setPostState}
      />

      <Post
        id="post"
        goToPanel={goToPanel}
        post={post}
      />

      <Final
        id="final"
        goToPanel={goToPanel}
      />
    </View>
  );
}

export default App;

