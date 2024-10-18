import '@src/Panel.css';

import { useEffect, useState } from 'react';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { type MessageRawType, type MessageType, messageRawSchema } from '@extension/schema';
import { cn } from '@extension/ui';
import { KeyboardIcon, MousePointer2Icon, ScrollTextIcon } from 'lucide-react';

const Panel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<MessageType[]>([]);

  useEffect(() => {
    const handleMessage = (unknownMessage: unknown) => {
      const { data: message, success, error } = messageRawSchema.safeParse(JSON.parse(unknownMessage as string));
      console.log({ message });
      if (!success) {
        console.error({
          error,
          message,
        });
        return;
      }

      console.log({ message });

      setEvents(prev => {
        console.log;
        const lastEvent: MessageType | undefined = prev[prev.length - 1];
        const rest = prev.slice(0, -1);

        console.log({ lastEvent });
        if (lastEvent && lastEvent.type === message.type) {
          const updateEvent = [
            ...rest,
            {
              ...lastEvent,
              action: [
                ...(lastEvent.action || []),
                {
                  actionData: message.data,
                  actionAt: new Date(),
                },
              ],
              str: renderKeyStrokes(lastEvent, message),
            },
          ] as MessageType[];
          console.log({ updateEvent });
          return updateEvent;
        } else {
          const newEvent: MessageType[] = [
            ...prev,
            {
              id: crypto.randomUUID(),
              type: message.type,
              str: renderKeyStrokes(lastEvent, message),
              action: [
                {
                  actionData: message.data,
                  actionAt: new Date(),
                },
              ],
            },
          ] as MessageType[];
          console.log({ newEvent });
          return newEvent;
        }
      });
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const renderKeyStrokes = (lastMessage?: MessageType, newMessage?: MessageRawType) => {
    if (!lastMessage || !newMessage) return [];
    if (lastMessage.type !== 'KEYSTROKE') return [];
    if (newMessage.type !== 'KEYSTROKE') return [];

    if (!newMessage?.data) return [];
    const newStr = newMessage.data[0];
    if (typeof newStr !== 'string') return [];

    if (newStr === 'Backspace') {
      lastMessage.str.pop();
      return lastMessage.str;
    } else if (
      [
        'Enter',
        'Tab',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
        'Backspace',
        'Shift',
        'Control',
        'Alt',
        'Meta',
        'CapsLock',
        'NumLock',
        'ScrollLock',
        'Pause',
        'Insert',
        'Home',
        'PageUp',
        'PageDown',
        'End',
        'PrintScreen',
        'ScrollLock',
        'Break',
        'Unidentified',
      ].includes(newStr)
    ) {
      // skip for now...
      return [];
    } else {
      lastMessage.str.push(newStr);
      return lastMessage.str;
    }
  };

  return (
    <div className="flex size-full flex-col p-4">
      <div className="mb-4 flex gap-2">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white" onClick={() => setIsPlaying(a => !a)}>
          {isPlaying ? 'Playing' : 'Play'}
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white"
          disabled={!isPlaying}
          onClick={() => setIsPlaying(false)}>
          Replay
        </button>
        <button
          className="rounded-md bg-green-500 px-4 py-2 text-white"
          disabled={!isPlaying}
          onClick={() => setIsPlaying(false)}>
          Stop
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col-reverse gap-2">
          {[...events].map((event, index) => (
            <li
              key={index}
              className={cn('rounded p-2', {
                'bg-red-400': event.type === 'SCROLL',
                'bg-blue-400': event.type === 'KEYSTROKE',
                'bg-green-400': event.type === 'MOUSE_MOVE',
              })}>
              <ListItem event={event} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function ListItem({ event, index }: { event: MessageType; index: number }) {
  if (!event) return null;
  console.log({ event });
  if (event.type === 'KEYSTROKE') {
    return (
      <div className="p-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <KeyboardIcon className="size-4" />
            <span>{index + 1}. User typed: </span>
          </div>
          <span>{(event.str || []).join('')}</span>
          {/* <span>{JSON.stringify(event)}</span> */}
        </div>
      </div>
    );
  }
  if (event.type === 'SCROLL') {
    return (
      <div className="p-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <ScrollTextIcon className="size-4" />
            <span>{index + 1}. User scroll from </span>
          </div>
          <span>{event.action[event.action.length - 1].actionData - event.action[0].actionData}</span>
        </div>
      </div>
    );
  }
  if (event.type === 'MOUSE_MOVE') {
    return (
      <div className="p-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <MousePointer2Icon className="size-4" />
            <span>{index + 1}. User moved the mouse</span>
          </div>
          <span>
            x: {event.action[event.action.length - 1].actionData.x} y:{' '}
            {event.action[event.action.length - 1].actionData.y}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
