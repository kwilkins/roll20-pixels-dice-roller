/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary The main app component of the extension.
 */

import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Field, FluentProvider, Input, InputOnChangeData, makeStyles, Persona, tokens, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { SpinnerIosFilled } from "@fluentui/react-icons";
import {
  PixelStatus
} from '@systemic-games/pixels-web-connect';
import { MessageAction } from './types/messageAction';
import { addMessageListener, sendMessageToContentScript } from './chromeMessaging';
import { Dnd5eCharacterSheetBonuses } from './types/dnd5e';

const appWidth = '125px';
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    width: appWidth
  },
  rollBonus: {
    width: appWidth
  }
});

/**
 * @summary Renders the main app display and asks the user to select which pixel to connect.
 */
const App: FunctionComponent = () => {
  const [pixelConnectionStatus, setPixelConnectionStatus] = useState<PixelStatus>('disconnected');
  const [characterSheetData, setCharacterSheetData] = useState<Record<string, Dnd5eCharacterSheetBonuses>>({});

  const sendSelectPixelMessage = useCallback(() => {
    sendMessageToContentScript({
      action: MessageAction.PixelConnectionRequest
    })
  }, []);

  const sendRollBonusValue = useCallback((_ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    const value = Number.parseInt(data.value, 10);

    if (!isNaN(value)) {
      console.log(value);
      sendMessageToContentScript({
        action: MessageAction.RollBonusResponse,
        value
      });
    }
  }, []);

  useEffect(() => {
    // add a listener for extension pixel connection status
    addMessageListener<MessageAction.PixelConnectionResponse>(
      (message) => {
        console.log(message);
        setPixelConnectionStatus(message.status);
      });
    
    // add a listener for extension pixel connection status
    addMessageListener<MessageAction.PixelStatusResponse>(
      (message) => {
        console.log(message);
        setPixelConnectionStatus(message.status);
      });
      
    // add a listener for extension character sheet data
    addMessageListener<MessageAction.CharacterSheetResponse>(
      (message) => {
        console.log(message);
        setCharacterSheetData((value) => {
          return {
            ...value,
            [message.characterName]: message.bonuses
          }
        });
      });

    // send message to confirm pixel status
    sendMessageToContentScript({
      action: MessageAction.PixelStatusRequest
    });

    sendMessageToContentScript({
      action: MessageAction.CharacterSheetRequest
    });
  }, []);

  const styles = useStyles();

  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? webDarkTheme
    : webLightTheme

  return (
    <FluentProvider theme={theme} className={styles.root}>
      <Persona
        name="Pixel"
        secondaryText={pixelConnectionStatus}
        presence={{
          ...((pixelConnectionStatus === 'connecting' || pixelConnectionStatus === 'identifying') && {
            icon: <SpinnerIosFilled />
          }),
          status: pixelConnectionStatus === 'ready' ? 'available' : 'offline'
        }}
      />
      {pixelConnectionStatus === 'disconnected' && (
        <button onClick={sendSelectPixelMessage}>Connect to Pixel</button>
      )}
      {pixelConnectionStatus !== 'disconnected' && (
        <Field label="Roll bonus" hint="A static number bonus to apply to the roll.">
          <Input className={styles.rollBonus} onChange={sendRollBonusValue} type="number" min={0} />
        </Field>
      )}
    </FluentProvider>
  );
};

export default App;