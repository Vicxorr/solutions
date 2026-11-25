# solutions.exe

Sitio web de **solutions.exe**, un estudio conceptual de ingeniería de software, infraestructura cloud, inteligencia artificial y diseño de sistemas.

## Características principales

- **Diseño minimalista y editorial** basado en tipografía limpia, retícula con líneas finas y alto contraste.
- **Modo claro / oscuro** monocromático con persistencia en `localStorage`.
- **Diseño responsive** adaptado a escritorio, tablet y móvil.
- **Filtro interactivo de proyectos** por categoría (`Web & SaaS`, `Cloud`, `IA`, `Mobile`) y **modal de detalles**.
- **Selector de planes Mensual / Anual** con cálculo dinámico de descuento (-20%).
- **Acordeón de preguntas frecuentes (FAQ)** accesible con atributos ARIA.
- **Formulario de contacto** con validación en tiempo real, preselección de servicio/plan y notificación toast.

## Estructura del proyecto

```text
solutionsexe/
├── index.html      # Estructura semántica HTML5
├── css/
│   └── style.css   # Sistema de diseño minimalista, temas claro/oscuro y responsive
├── jss/
│   └── main.js     # Interactividad en JavaScript puro
└── README.md       # Documentación del proyecto
```

## Tecnologías utilizadas

- **HTML5** semántico y accesible
- **CSS3** (Custom Properties, Grid, Flexbox, `prefers-reduced-motion`)
- **JavaScript (ES6+)** vanilla

## Cómo visualizarlo

Abre `index.html` directamente en tu navegador o inicia un servidor local:

```bash
# Con Python
python -m http.server 8000

# O con Node.js (npx)
npx serve .
```

Luego abre `http://localhost:8000` en tu navegador.
