import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:"./",plugins:[react()],build:{outDir:"../forest",emptyOutDir:false,rollupOptions:{output:{manualChunks:{three:['three'],fiber:['@react-three/fiber','@react-three/drei']}}}}});
