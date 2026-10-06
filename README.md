# Solicitud de Viáticos — BNH Medical

Arquitectura:

- `public/index.html` → frontend (Vercel)
- `api/gas.js` → proxy serverless hacia Apps Script (oculta URL y secreto)
- `api/config.js` → entrega la API key de Maps (navegador) desde variables de entorno
- `apps-script/Api.gs` → archivo NUEVO para tu proyecto de Apps Script (expone la API JSON)
- Tu `Code.gs` actual NO se modifica.

## 1. Apps Script
1. Abre tu proyecto vinculado a la hoja de cálculo.
2. Archivos **+ → Script**, nómbralo `Api` y pega el contenido de `apps-script/Api.gs`.
3. Ejecuta la función `generarApiSecret` una vez (autoriza permisos) y copia el valor
   que aparece en el registro de ejecución.
4. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   Copia la URL que termina en `/exec`.
5. Cada vez que cambies código: **Gestionar implementaciones → Editar → Nueva versión**.

## 2. GitHub
```bash
git init
git add .
git commit -m "Viáticos BNH: frontend Vercel + backend Apps Script"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/viaticos-bnh.git
git push -u origin main
```

## 3. Vercel
1. **Add New → Project** e importa el repositorio.
2. Framework Preset: **Other** (sin build command ni output directory).
3. Variables de entorno:
   | Variable | Valor |
   |---|---|
   | `GAS_URL` | URL `/exec` de la implementación de Apps Script |
   | `GAS_SECRET` | El valor generado por `generarApiSecret()` |
   | `MAPS_BROWSER_KEY` | API key de Google Maps para navegador (Maps JavaScript + Places), restringida por referrer a tu dominio de Vercel |
4. Deploy.

## Notas
- La key de Distance Matrix (servidor) sigue en la hoja `Config_Aprobacion`; use una key distinta a la del navegador.
- Los enlaces de Aprobar/Rechazar de los correos siguen apuntando a la URL de Apps Script.
- Nunca subas secretos al repositorio.
