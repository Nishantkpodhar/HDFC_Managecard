/**
 * @banking360/design-system - Design System Components
 * 
 * This package provides the core design system components used across all micro-frontends.
 * Built with React, TypeScript, and Tailwind CSS following shadcn/ui architecture.
 */

export * from './utils';
export { cn } from './utils';

// Components
export { Button } from './components/Button';
export { Avatar } from './components/Avatar';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './components/DropdownMenu';
export { LoadingSpinner } from './components/LoadingSpinner';
export { Input, Textarea } from './components/Input';
export { Separator } from './components/Separator';

export const DESIGN_SYSTEM_VERSION = '1.0.0';