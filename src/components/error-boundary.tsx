"use client";

import { Component, type ReactNode } from "react";

import {
  isChunkLoadError,
  reloadOnceForChunkError,
  clearChunkErrorReloadFlag,
} from "../lib/chunk-error";
import { ErrorFallback } from "./error-fallback";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Generic error boundary for routers without a route-level errorElement
 * (wouter, react-router's classic <Routes> tree — see react-router-dom's
 * data router + errorElement/useRouteError for that case instead). Catches
 * render errors anywhere in `children`, auto-reloads once for a stale chunk
 * after a deploy, and falls back to `ErrorFallback` otherwise.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error)) {
      reloadOnceForChunkError();
    }
  }

  handleRetry = () => {
    clearChunkErrorReloadFlag();
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          chunkError={isChunkLoadError(this.state.error)}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
