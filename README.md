Error: Incorrect arguments to mysqld_stmt_execute
    at PromisePool.execute (D:\scholar\backend\node_modules\mysql2\lib\promise\pool.js:54:22)
    at Object.findMany (D:\scholar\backend\domains\user\repository.js:173:28)       
    at Object.getUsers (D:\scholar\backend\domains\user\service.js:101:16)
    at getUsers (D:\scholar\backend\domains\user\controller.js:122:34)
    at Layer.handleRequest (D:\scholar\backend\node_modules\router\lib\layer.js:152:17)
    at next (D:\scholar\backend\node_modules\router\lib\route.js:157:13)
    at requireAdmin (D:\scholar\backend\shared\middleware\auth.middleware.js:56:3)  
    at Layer.handleRequest (D:\scholar\backend\node_modules\router\lib\layer.js:152:17)
    at next (D:\scholar\backend\node_modules\router\lib\route.js:157:13)
    at authenticate (D:\scholar\backend\shared\middleware\auth.middleware.js:24:5)  
 GET /scholar-api/users?limit=10&offset=0 - 500 - 19ms
[2026-01-28T09:21:32.267Z] Error Response: {
  method: 'GET',
  path: '/scholar-api/users?limit=10&offset=0',
  statusCode: 500,
  ip: '::1',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
  body: undefined,
  query: [Object: null prototype] { limit:
 '10', offset: '0' },
  params: {}
}

# Scholar Frontend

A modern Next.js TypeScript application for the Scholar academic ecosystem platform.

## Features

- **Login/Join Page** - User authentication interface
- **Home Dashboard** - Grid layout with content discovery
- **Content Detail Page** - Full content view with reactions and sharing
- **Research Lab** - Research projects and collaboration
- **Scoop** - Latest news and updates
- **Environment** - Connect with other schools and institutions
- **Community Operations** - Community management and activities
- **Scholink** - Academic resource linking
- **Account** - User profile and settings

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Material Symbols** - Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/
│   ├── account/          # Account settings page
│   ├── community/        # Community operations page
│   ├── content/[id]/     # Content detail page
│   ├── environment/      # Environment/institutions page
│   ├── login/            # Login/join page
│   ├── research-lab/     # Research lab page
│   ├── scholink/         # Scholink page
│   ├── scoop/            # Scoop/news page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── Sidebar.tsx       # Navigation sidebar component
└── package.json
```

## Design

The application uses a modern blue color scheme with:
- Primary color: Blue (#2563eb)
- Clean, minimalist design
- Responsive layout
- Dark mode support

## Pages

- `/` - Home dashboard
- `/login` - Login/join page
- `/research-lab` - Research lab
- `/scoop` - News and updates
- `/environment` - Institutions and partnerships
- `/community` - Community operations
- `/scholink` - Academic linking
- `/account` - Account settings
- `/content/[id]` - Content detail view



