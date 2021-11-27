import {BaseEmoji, NimbleEmoji, NimblePicker} from 'emoji-mart';
import React, {FC, Fragment, useEffect, useState} from 'react';
import {usePopper} from 'react-popper';

import data from '../assets/emoji-mart-data.json';
import {isHTMLElement} from '../helpers/domHelpers';
import {getEmojiSheetUrl} from '../helpers/emojiHelpers';
import {useTweetdeckTheme} from '../helpers/hookHelpers';
import {HandlerOf} from '../helpers/typeHelpers';

export const nimbleEmojiBaseProps = {
  sheetRows: 60,
  sheetColumns: 60,
  data: data as any,
};

export const EmojiButton: FC<{onClick: HandlerOf<string>}> = (props) => {
  const [isPickerShown, setIsPickerShown] = useState(false);
  const theme = useTweetdeckTheme();
  const color = '#1da1f2';
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const {styles, attributes} = usePopper(referenceElement, popperElement, {
    placement: 'right-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          boundary: document.body,
        },
      },
      {
        name: 'preventOverflow',
        options: {
          mainAxis: true,
        },
      },
    ],
  });

  useEffect(() => {
    setReferenceElement(document.querySelector<HTMLElement>('.compose-text-container'));
  }, []);

  return (
    <Fragment>
      {isPickerShown && (
        <div
          id="emojiPickerWrapper"
          onClick={(e) => {
            if (isHTMLElement(e.target) && e.target.closest('.emoji-mart')) {
              return;
            }

            setIsPickerShown(false);
          }}>
          <div ref={setPopperElement} {...attributes.popper} style={styles.popper}>
            <NimblePicker
              set="twitter"
              autoFocus
              onSelect={(emoji: BaseEmoji) => {
                props.onClick(emoji.native);
              }}
              color={color}
              emoji="sparkles"
              useButton={false}
              emojiSize={20}
              {...nimbleEmojiBaseProps}
              perLine={7}
              backgroundImageFn={getEmojiSheetUrl}
              title=""
              theme={theme}
            />
          </div>
        </div>
      )}
      <div
        className="btd-emoji-button-wrapper"
        style={{
          height: 20,
          position: 'absolute',
          top: 10,
          right: 10,
          width: 20,
          display: 'block',
        }}>
        <NimbleEmoji
          {...nimbleEmojiBaseProps}
          emoji="joy"
          size={20}
          onClick={() => setIsPickerShown(true)}
          set="twitter"
          backgroundImageFn={getEmojiSheetUrl}
        />
      </div>
    </Fragment>
  );
};
