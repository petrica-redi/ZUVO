"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackBody?: string;
};

type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <ErrorBoundaryFallback
        title={this.props.fallbackTitle}
        body={this.props.fallbackBody}
        onReset={this.reset}
      />
    );
  }
}

function ErrorBoundaryFallback({
  title,
  body,
  onReset,
}: {
  title?: string;
  body?: string;
  onReset: () => void;
}) {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");
  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-wider text-rose-700">
              {title ?? t("boundaryTitle")}
            </div>
            <p className="mt-0.5 text-sm leading-relaxed text-rose-800/90">
              {body ?? t("boundaryBody")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white shadow-md shadow-rose-500/25 transition active:scale-[0.97]"
        >
          <RotateCw className="h-4 w-4" /> {tCommon("tryAgain")}
        </button>
      </div>
    </div>
  );
}
