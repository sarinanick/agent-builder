# 🤖 Agent Builder

A visual AI Agent workflow builder, inspired by OpenAI Agent Builder. Build complex multi-agent workflows with a drag-and-drop canvas editor.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React Flow](https://img.shields.io/badge/React_Flow-v12-ff6b6b?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vitest](https://img.shields.io/badge/Vitest-4-6e9f17?logo=vitest)

## ✨ Features

### 🎨 Visual Canvas Editor
- **Drag & drop** nodes from sidebar to canvas
- **Zoom, pan, and minimap** for navigating large workflows
- **Animated edges** showing data flow between nodes
- **Snap-to-grid** alignment
- **Lock canvas** to prevent accidental edits
- **Grid toggle** for visual alignment

### 🧩 12 Custom Node Types

| Category | Nodes | Color |
|----------|-------|-------|
| **Start/End** | Start, End | 🟢 Green |
| **Agent** | Agent (model, instructions, tools) | 🟣 Purple |
| **Tools** | File Search, Guardrails, MCP | 🟡 Yellow |
| **Logic** | If/Else, While, Human Approval | 🟠 Orange |
| **Data** | Transform, Set State | 🔵 Blue |
| **Utility** | Sticky Note | ⬜ Stone |

### ⚙️ Properties Panel
Click any node to configure it:
- **Agent**: Model selection, system instructions, tools, temperature
- **Condition**: CEL expression editor, branch labels
- **While**: Loop condition, max iterations
- **Transform**: Input/output schemas, transform code
- **Set State**: Global variable management
- **File Search**: Vector store ID, top-K, score threshold
- **Guardrails**: Check type (input/output/both), regex patterns
- **MCP**: Server URL, tool name, parameters
- **Human Approval**: Instructions, timeout
- **Note**: Text content (rich text)

### 🎭 Theme System
- **Dark mode** (default) - Professional dark theme
- **Light mode** - Clean minimal theme
- Toggle with one click in the toolbar

### 🌐 Bilingual Support
- **English** (LTR)
- **Persian/Farsi** (RTL)
- Toggle with globe icon in navbar

### 🔧 Developer Tools
- **Undo/Redo** (Ctrl+Z / Ctrl+Shift+Z)
- **Keyboard shortcuts** (Delete to remove nodes)
- **Code export** (ChatKit + Agents SDK)
- **Preview mode** (simulated chat interface)
- **Deploy options** (Vercel, self-hosted, download)
- **Error boundary** with recovery UI

### 🛒 Marketplace
- **Masonry grid** with artwork cards
- **Avatar groups** with hover expand + tooltips
- **Filmstrip modal** with zoom, slideshow, navigation
- **Command palette** (Ctrl+K)
- **Compare tray** for side-by-side comparison
- **Infinite scroll** with load more

### 🎵 Sonora
- **AI music studio** concept page
- **Waveform visualization**
- **Track list** with play/pause
- **Genre selection**

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/sarinanick/agent-builder.git
cd agent-builder

# Install
npm install

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Testing

```bash
# Run all tests
npx vitest run

# Run specific test
npx vitest run src/__tests__/audit/001-project-setup.test.ts

# Type check
npm run typecheck

# Full QA
npm run qa
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with ThemeProvider
│   ├── page.tsx                  # Main editor page
│   ├── globals.css               # Global styles + tokens
│   └── marketplace/              # Marketplace pages
│       ├── page.tsx             # Marketplace main
│       ├── FilmstripModal.tsx   # Image viewer
│       ├── Sonora.tsx           # Music studio
│       └── data.ts              # Data generation
├── components/
│   ├── canvas/                  # Canvas components
│   │   ├── EditorCanvas.tsx     # Main ReactFlow wrapper
│   │   ├── CanvasControls.tsx   # Zoom/lock/grid controls
│   │   └── LazyModals.tsx       # Lazy loaded modals
│   ├── sidebar/                 # Left node palette
│   │   └── Sidebar.tsx         # Searchable node list
│   ├── toolbar/                 # Top bar
│   │   ├── TopToolbar.tsx       # Project name, version, actions
│   │   └── ThemeToggle.tsx      # Dark/light switch
│   ├── panel/                   # Right properties panel
│   │   ├── PropertiesPanel.tsx  # Node config panel
│   │   └── panels/              # Per-node-type forms
│   ├── nodes/                   # 12 custom node components
│   │   ├── NodeWrapper.tsx      # Shared wrapper
│   │   ├── StartNode.tsx
│   │   ├── EndNode.tsx
│   │   ├── AgentNode.tsx
│   │   ├── ConditionNode.tsx
│   │   ├── FileSearchNode.tsx
│   │   ├── GuardrailsNode.tsx
│   │   ├── McpNode.tsx
│   │   ├── WhileNode.tsx
│   │   ├── HumanApprovalNode.tsx
│   │   ├── TransformNode.tsx
│   │   ├── SetStateNode.tsx
│   │   └── NoteNode.tsx
│   ├── layout/                  # Shared layout
│   │   └── Navbar.tsx           # Navigation with i18n
│   └── ui/                      # Shared UI components
│       ├── Button.tsx           # Shared button
│       ├── FormField.tsx        # Form fields
│       ├── Badge.tsx            # Badge component
│       ├── Tooltip.tsx          # Tooltip component
│       ├── ErrorBoundary.tsx    # Error handling
│       ├── Modal.tsx            # Base modal
│       ├── CodeModal.tsx        # Code export
│       ├── PreviewModal.tsx     # Preview mode
│       └── DeployModal.tsx      # Deploy options
├── store/                       # Zustand state management
│   ├── flowStore.ts            # Nodes, edges, undo/redo
│   └── uiStore.ts              # UI state
├── types/                       # TypeScript types
├── constants/                   # Node registry & templates
├── lib/                         # Utilities
│   ├── i18n.tsx                # Internationalization
│   ├── nodeRegistry.ts         # Central node registry
│   └── utils.ts                # Utility functions
├── styles/                      # Design tokens
│   └── tokens.css              # CSS custom properties
└── __tests__/audit/            # 80 test suites (400 items)
```

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **React Flow v12** | Node-based visual editor |
| **Zustand** | Lightweight state management |
| **Tailwind CSS v4** | Utility-first styling |
| **next-themes** | Dark/light theme toggle |
| **Radix UI** | Accessible primitives |
| **Lucide React** | Icon library |
| **Vitest** | Testing framework |

## 📊 Audit Coverage

| Category | Items | Status |
|----------|-------|--------|
| Architecture | 1-10 | ✅ Covered |
| State Management | 11-30 | ✅ Covered |
| CSS Architecture | 31-60 | ✅ Covered |
| UI/UX | 61-100 | ✅ Covered |
| Accessibility | 101-150 | ✅ Covered |
| RTL/i18n | 151-200 | ✅ Covered |
| Testing | 201-300 | ✅ Covered |
| Performance | 301-400 | ✅ Covered |

**Total: 80 test suites, 200+ tests**

## 📝 License

MIT
