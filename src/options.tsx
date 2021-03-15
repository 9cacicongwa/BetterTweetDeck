import {isEmpty} from 'lodash';
import React, {FC, useEffect, useState} from 'react';
import {render} from 'react-dom';

import {SettingsModal} from './components/settings/settingsModal';
import {ExtensionSettings} from './helpers/browserHelpers';
import {minifyCss, prettifyCss} from './helpers/cssHelpers';
import {getValidatedSettings} from './services/backgroundSettings';
import {BTDSettings} from './types/btdSettingsTypes';

const App: FC = () => {
  const [settings, setSettings] = useState<BTDSettings>({} as any);

  useEffect(() => {
    getValidatedSettings().then((newSettings) => {
      setSettings({
        ...newSettings,
        customCss: prettifyCss(newSettings.customCss),
      });
      console.timeEnd('set settings');
    });
  }, []);

  if (isEmpty(settings)) {
    return null;
  }

  return (
    <SettingsModal
      onSettingsUpdate={async (newSettings) => {
        const compressedCss = minifyCss(newSettings.customCss);

        await ExtensionSettings.set({
          ...newSettings,
          customCss: compressedCss,
        });
        console.timeEnd('saveSettings');
      }}
      btdSettings={settings}></SettingsModal>
  );
};

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
render(<App></App>, root);
