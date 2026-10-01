# 📋 JobTracker - Guía de Despliegue en GitHub Pages

## Paso a paso completo para tener tu app online

---

### 📦 PASO 1: Preparar tu computadora

#### 1.1 Instalar Node.js
- Andá a [https://nodejs.org](https://nodejs.org)
- Descargá la versión **LTS** (la recomendada)
- Instalalo con las opciones por defecto
- Verificá que funcionó abriendo una terminal y escribiendo:
  ```bash
  node -v
  npm -v
  ```
  Deberías ver números de versión (ej: v20.x.x)

#### 1.2 Instalar Git
- Andá a [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Descargá e instalá con las opciones por defecto
- Verificá escribiendo en la terminal:
  ```bash
  git --version
  ```

#### 1.3 Crear cuenta en GitHub
- Si no tenés, creá una en [https://github.com](https://github.com)

---

### 📁 PASO 2: Crear el proyecto localmente

#### 2.1 Crear la carpeta del proyecto
```bash
mkdir jobtracker
cd jobtracker
```

#### 2.2 Copiar todos los archivos del proyecto
Copiá todos los archivos de este proyecto a la carpeta `jobtracker/`

La estructura debe quedar así:
```
jobtracker/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx
│   │   ├── ImportExport.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobForm.tsx
│   │   └── StatsBar.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

#### 2.3 ⚠️ IMPORTANTE: Modificar vite.config.js
Abrí el archivo `vite.config.js` y **agregá la línea `base`**. Debe quedar así:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/jobtracker/',  // ← AGREGÁ ESTA LÍNEA (usá el nombre de tu repo)
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
```

> ⚠️ **Importante:** El valor de `base` debe coincidir con el nombre exacto de tu repositorio en GitHub. Si tu repo se llama `mi-job-tracker`, poné `base: '/mi-job-tracker/'`.

---

### 🚀 PASO 3: Crear repositorio en GitHub

#### 3.1 Desde la web de GitHub
1. Andá a [https://github.com/new](https://github.com/new)
2. Nombre del repo: `jobtracker` (o el que quieras, pero recordá actualizar el `base` en vite.config.js)
3. Dejaló como **Public** (necesario para GitHub Pages gratis)
4. **NO** marques "Add a README file" (ya tenemos uno)
5. Hacé clic en **Create repository**

#### 3.2 Subir el código desde tu terminal
```bash
cd jobtracker

# Inicializar Git
git init
git add .
git commit -m "Primer commit - JobTracker"

# Conectar con GitHub (reemplazá TU-USUARIO por tu usuario real)
git branch -M main
git remote add origin https://github.com/TU-USUARIO/jobtracker.git
git push -u origin main
```

---

### ⚙️ PASO 4: Activar GitHub Pages

1. Andá a tu repositorio en GitHub
2. Hacé clic en **Settings** (Configuración)
3. En el menú lateral, hacé clic en **Pages**
4. En **Source**, seleccioná **"GitHub Actions"**
5. ¡Listo! El workflow que creamos se va a ejecutar automáticamente

---

### ⏳ PASO 5: Esperar el deploy

1. En tu repo, andá a la pestaña **Actions**
2. Vas a ver el workflow "Deploy to GitHub Pages" corriendo
3. Esperá a que aparezca el ✅ verde (tarda 1-2 minutos)
4. Tu app estará disponible en:

```
https://TU-USUARIO.github.io/jobtracker/
```

---

### 🔄 PASO 6: Actualizaciones futuras

Cada vez que hagas un cambio y lo subas a GitHub:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

GitHub Actions va a reconstruir y redeployar automáticamente tu app. 🎉

---

### 🐛 Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| Página en blanco | Verificá que `base` en vite.config.js coincida con el nombre del repo |
| Error 404 en assets | Mismo problema: revisá el `base` |
| El workflow falla | Revisá la pestaña Actions para ver el error específico |
| No se actualiza | Esperá unos minutos o hacé hard refresh (Ctrl+Shift+R) |

---

### 💡 Tips

- Tus datos se guardan en el navegador (Local Storage)
- Usá el botón **Exportar** para hacer backup regularmente
- Si cambiás de navegador/PC, usá **Importar** para restaurar
