# Design Document

## Overview

Este documento descreve o design da interface de usuário para o Sistema de Gerenciamento de Apostas Esportivas. O design segue uma abordagem mobile-first, utilizando apenas TailwindCSS para estilização, aproveitando o design system já estabelecido no projeto. A interface será construída com componentes React reutilizáveis que integram com o store Zustand existente.

## Architecture

### Component Architecture

```
src/components/
├── layout/
│   ├── Header.tsx          # Header com saldo e navegação
│   ├── Navigation.tsx      # Navegação principal
│   └── Layout.tsx          # Layout wrapper
├── ui/
│   ├── Button.tsx          # Componente de botão reutilizável
│   ├── Card.tsx            # Componente de card
│   ├── Modal.tsx           # Modal genérico
│   ├── Input.tsx           # Input com validação
│   ├── LoadingSpinner.tsx  # Indicador de loading
│   └── Badge.tsx           # Badge para status
├── forms/
│   ├── BetForm.tsx         # Formulário de apostas
│   └── DepositForm.tsx     # Formulário de depósito
└── features/
    ├── EventList.tsx       # Lista de eventos
    ├── EventCard.tsx       # Card individual de evento
    ├── BetList.tsx         # Lista de apostas
    ├── BetCard.tsx         # Card individual de aposta
    └── StatsCard.tsx       # Card de estatísticas
```

### Page Architecture

```
src/pages/
├── HomePage.tsx            # Página principal com eventos
├── BetsPage.tsx           # Página de apostas do usuário
├── StatsPage.tsx          # Página de estatísticas
└── BalancePage.tsx        # Página de gerenciamento de saldo
```

### State Integration

O design integra diretamente com o store Zustand existente através dos hooks customizados:
- `useBetting()` - Hook principal para todas as operações
- `useEvents()` - Específico para eventos
- `useBets()` - Específico para apostas
- `useUser()` - Específico para dados do usuário

## Components and Interfaces

### Layout Components

#### Header Component
```typescript
interface HeaderProps {
  balance: number;
  isLoading: boolean;
}
```

**Funcionalidades:**
- Exibe saldo atual do usuário
- Botão de depósito rápido
- Indicador de loading quando necessário
- Design responsivo com logo/título

#### Navigation Component
```typescript
interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
```

**Funcionalidades:**
- Navegação entre seções (Eventos, Apostas, Estatísticas, Saldo)
- Indicador visual da seção ativa
- Design responsivo (tabs em desktop, bottom nav em mobile)

### UI Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

#### Input Component
```typescript
interface InputProps {
  label: string;
  type: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}
```

### Feature Components

#### EventCard Component
```typescript
interface EventCardProps {
  event: SportEvent;
  onBetClick: (event: SportEvent, prediction: BetPrediction) => void;
}
```

**Design:**
- Card com informações do evento (times, data, esporte)
- Badges para status (upcoming, live, finished)
- Botões de odds clicáveis para cada predição
- Indicador visual para eventos ao vivo

#### BetCard Component
```typescript
interface BetCardProps {
  bet: Bet;
  showEvent?: boolean;
}
```

**Design:**
- Card com detalhes da aposta
- Status visual (ativa, ganha, perdida)
- Informações do evento associado
- Valores destacados (aposta, ganho potencial/real)

## Data Models

### UI State Models

```typescript
interface UIState {
  activeSection: 'events' | 'bets' | 'stats' | 'balance';
  modals: {
    betForm: boolean;
    depositForm: boolean;
  };
  selectedEvent: SportEvent | null;
}

interface FormState {
  betForm: {
    amount: number;
    prediction: BetPrediction;
    isValid: boolean;
    errors: Record<string, string>;
  };
  depositForm: {
    amount: number;
    isValid: boolean;
    errors: Record<string, string>;
  };
}
```

## Error Handling

### Error Display Strategy

1. **Toast Notifications**: Para feedback imediato de ações
2. **Inline Errors**: Para validação de formulários
3. **Error States**: Para falhas de carregamento de dados
4. **Fallback UI**: Para estados sem dados

### Error Types

```typescript
interface ErrorDisplayProps {
  type: 'toast' | 'inline' | 'page' | 'card';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Testing Strategy

### Component Testing

1. **Unit Tests**: Cada componente isoladamente
2. **Integration Tests**: Componentes com hooks/store
3. **Visual Tests**: Snapshots para consistência visual
4. **Accessibility Tests**: Conformidade com WCAG

### Test Structure

```typescript
// Exemplo de estrutura de teste
describe('EventCard', () => {
  it('should display event information correctly');
  it('should handle bet button clicks');
  it('should show loading state');
  it('should display error state');
  it('should be accessible');
});
```

## Design System Implementation

### Color Palette (já definida)
- Primary: Blue (#3b82f6, #2563eb, #1d4ed8)
- Success: Green (#10b981, #059669, #047857)
- Danger: Red (#ef4444, #dc2626, #b91c1c)
- Warning: Yellow (#f59e0b, #d97706, #b45309)

### Typography Scale
```css
.text-xs     /* 12px - Labels, captions */
.text-sm     /* 14px - Body text small */
.text-base   /* 16px - Body text */
.text-lg     /* 18px - Subheadings */
.text-xl     /* 20px - Headings */
.text-2xl    /* 24px - Page titles */
.text-3xl    /* 30px - Main title */
```

### Spacing Scale
```css
.space-1     /* 4px */
.space-2     /* 8px */
.space-3     /* 12px */
.space-4     /* 16px */
.space-6     /* 24px */
.space-8     /* 32px */
```

### Component Variants

#### Cards
- `card-base`: Base card styling
- `card-hover`: Hover effects
- `card-selected`: Selected state
- `card-disabled`: Disabled state

#### Buttons
- `btn-primary`: Primary actions
- `btn-secondary`: Secondary actions
- `btn-danger`: Destructive actions
- `btn-ghost`: Minimal styling

### Responsive Breakpoints

```css
/* Mobile First Approach */
.sm:    /* 640px+ - Small tablets */
.md:    /* 768px+ - Tablets */
.lg:    /* 1024px+ - Desktops */
.xl:    /* 1280px+ - Large desktops */
```

### Layout Patterns

#### Mobile Layout
- Bottom navigation
- Full-width cards
- Stacked content
- Touch-friendly buttons (min 44px)

#### Desktop Layout
- Side navigation or top tabs
- Grid layouts for cards
- Hover states
- Larger content areas

### Animation Guidelines

```css
/* Transition Classes */
.transition-colors    /* Color transitions */
.transition-transform /* Transform transitions */
.transition-opacity   /* Opacity transitions */
.duration-200        /* 200ms duration */
.ease-in-out         /* Easing function */
```

### Accessibility Considerations

1. **Keyboard Navigation**: Tab order, focus indicators
2. **Screen Readers**: ARIA labels, semantic HTML
3. **Color Contrast**: WCAG AA compliance
4. **Touch Targets**: Minimum 44px for mobile
5. **Motion**: Respect prefers-reduced-motion

### Performance Considerations

1. **Code Splitting**: Lazy load pages
2. **Image Optimization**: Responsive images
3. **Bundle Size**: Tree shaking, minimal dependencies
4. **Rendering**: Avoid unnecessary re-renders
5. **Memory**: Cleanup event listeners and subscriptions