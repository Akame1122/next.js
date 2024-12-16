import type { PagesDevOverlayProps } from '../types'
import { useCallback } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { usePagesReactDevOverlay } from './hooks'
import { ShadowPortal } from '../internal/components/ShadowPortal'
import { BuildError } from '../internal/container/BuildError'
import { Errors } from '../internal/container/Errors'
import { Base } from '../internal/styles/Base'
import { ComponentStyles } from '../internal/styles/ComponentStyles'
import { CssReset } from '../internal/styles/CssReset'

export default function ReactDevOverlay({
  children,
  preventDisplay,
  globalOverlay,
}: PagesDevOverlayProps) {
  const {
    isMounted,
    displayPrevented,
    hasBuildError,
    hasRuntimeErrors,
    state,
  } = usePagesReactDevOverlay(preventDisplay)

  const onComponentError = useCallback(
    (_error: Error, _componentStack: string | null) => {
      // TODO: special handling
    },
    []
  )

  const renderErrorContent = () => {
    if (displayPrevented) {
      return null
    }

    if (hasBuildError) {
      return (
        <BuildError
          message={state.buildError!}
          versionInfo={state.versionInfo}
        />
      )
    }

    if (hasRuntimeErrors) {
      return (
        <Errors
          isAppDir={false}
          errors={state.errors}
          versionInfo={state.versionInfo}
          initialDisplayState="fullscreen"
        />
      )
    }

    return undefined
  }

  return (
    <>
      <ErrorBoundary
        globalOverlay={globalOverlay}
        isMounted={isMounted}
        onError={onComponentError}
      >
        {children ?? null}
      </ErrorBoundary>
      {isMounted ? (
        <ShadowPortal>
          <CssReset />
          <Base />
          <ComponentStyles />

          {renderErrorContent()}
        </ShadowPortal>
      ) : undefined}
    </>
  )
}
