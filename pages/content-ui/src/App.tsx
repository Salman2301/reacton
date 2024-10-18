import { Button } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { useEffect } from 'react';
import { useStorage } from '@extension/shared';

export default function App() {
  const theme = useStorage(exampleThemeStorage);

  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return (
    <div className="absolute top-0 mb-10 hidden items-center justify-between gap-2 rounded bg-blue-100 px-2 py-1">
      <div className="flex gap-1 text-blue-500">
        Edit <strong className="text-blue-700">pages/content-ui/src/app. 1tsx</strong> and save to reload.
      </div>
      <Button theme={theme} onClick={exampleThemeStorage.toggle}>
        Toggle Theme
      </Button>
    </div>
  );
}
