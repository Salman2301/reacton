import { toggleTheme } from '@src/toggleTheme';
import { type MessageRawType } from '@extension/schema';

console.log('content script loaded');

void toggleTheme();

function sendKeystroke(key: string) {
  const message: MessageRawType = { type: 'KEYSTROKE', data: key };
  sendMessage(message);
}

function sendScroll() {
  const message: MessageRawType = { type: 'SCROLL', data: window.scrollY };
  sendMessage(message);
}

function sendMouseMove(event: MouseEvent) {
  const message: MessageRawType = { type: 'MOUSE_MOVE', data: { x: event.clientX, y: event.clientY } };
  sendMessage(message);
}

function sendMessage(message: MessageRawType) {
  const msgStr = JSON.stringify(message);
  chrome.runtime.sendMessage(msgStr);
}

const handleKeydown = (event: KeyboardEvent) => sendKeystroke(event.key);
const handleScroll = () => sendScroll();
const handleMouseMove = (event: MouseEvent) => sendMouseMove(event);

document.addEventListener('keydown', handleKeydown);
document.addEventListener('scroll', handleScroll);
document.addEventListener('mousemove', handleMouseMove);

window.addEventListener('unload', () => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('scroll', handleScroll);
  document.removeEventListener('mousemove', handleMouseMove);
});
