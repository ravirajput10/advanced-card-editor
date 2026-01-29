import { useEffect } from 'react';
import { EditorLayout } from '@/components/layout';
import { EditorCanvas } from '@/components/canvas';
import { LayerPanel, PropertiesPanel, Toolbar } from '@/components/panels';
import { useEditorStore } from '@/store/useEditorStore';
import { useKeyboard } from '@/hooks';
import './App.css';

function App() {
  const theme = useEditorStore((state) => state.theme);

  // Enable keyboard shortcuts
  useKeyboard();

  // Initialize dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <EditorLayout
      toolbar={<Toolbar />}
      layerPanel={<LayerPanel />}
      canvas={<EditorCanvas />}
      propertiesPanel={<PropertiesPanel />}
    />
  );
}

export default App;
