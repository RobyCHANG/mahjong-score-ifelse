import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/mahjong-score-ifelse/', // GitHub Pages 部署路徑
})
