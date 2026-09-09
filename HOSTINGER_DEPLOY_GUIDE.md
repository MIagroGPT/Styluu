# Guía de Despliegue en Hostinger — www.styluu.com

Esta guía te explica paso a paso cómo subir y activar **Styluu** en tu hosting de Hostinger con tu dominio **www.styluu.com**.

---

## Opción 1: Subida mediante el Administrador de Archivos de Hostinger (Recomendado y más rápido)

1. **Generar la carpeta de producción**:
   En tu terminal local, corre:
   ```bash
   npm run build
   ```
   Esto creará la carpeta `dist/` optimizada con todo el código, imágenes y el archivo `.htaccess`.

2. **Comprimir el contenido de `dist/`**:
   - Entra a la carpeta `c:\Users\Alejandro\Desktop\Styluu\dist`
   - Selecciona todos los archivos que están adentro (`index.html`, `.htaccess`, carpeta `assets/`, `logo.jpeg`)
   - Haz clic derecho -> **Comprimir en archivo ZIP** (ejemplo: `styluu_build.zip`).

3. **Ingresar a Hostinger hPanel**:
   - Ve a [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Ve a **Sitios Web** -> Selecciona tu dominio **styluu.com**
   - Haz clic en **Administrador de Archivos (File Manager)**.
   - Entra a la carpeta `public_html`.
   - Si hay un archivo `default.php` o `index.php` antiguo de bienvenida, elimínalo o cámbiale el nombre.

4. **Subir y Extraer**:
   - Haz clic en el botón **Subir (Upload)** y sube `styluu_build.zip`.
   - Haz clic derecho sobre el ZIP en Hostinger y selecciona **Extraer (Extract)** en `public_html`.
   - Verifica que el archivo `.htaccess` esté presente en la raíz de `public_html`.

5. **¡Listo!**:
   - Abre tu navegador y visita [https://www.styluu.com](https://www.styluu.com) o [https://styluu.com](https://styluu.com).

---

## Opción 2: Despliegue automático mediante Git / GitHub en Hostinger

1. Sube tu código a un repositorio privado o público en GitHub.
2. En Hostinger hPanel, busca la sección **Avanzado** -> **Git**.
3. Pega la URL de tu repositorio y la rama `main`.
4. Define el directorio de despliegue en `public_html`.
5. Si tu plan de Hostinger soporta Node.js o Build Commands, configura:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

---

## Archivo `.htaccess` incluido

El archivo `.htaccess` ya está configurado para:
- Redireccionar todas las rutas de la app a `index.html` sin errores 404 (soporte para Single Page Application).
- Habilitar compresión GZIP/Deflate para máxima velocidad de carga en navegadores de USA e internacionales.
- Caching optimizado de imágenes y fuentes tipográficas.
