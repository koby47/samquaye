import {
  useEffect,
  useRef,
} from 'react'

import {
  env,
} from '../../config/env.js'

const SCRIPT_ID =
  'cloudflare-turnstile-script'

const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadTurnstileScript() {
  return new Promise(
    (resolve, reject) => {
      if (window.turnstile) {
        resolve(
          window.turnstile,
        )
        return
      }

      const existingScript =
        document.getElementById(
          SCRIPT_ID,
        )

      if (existingScript) {
        existingScript.addEventListener(
          'load',
          () =>
            resolve(
              window.turnstile,
            ),
          {
            once: true,
          },
        )

        existingScript.addEventListener(
          'error',
          reject,
          {
            once: true,
          },
        )

        return
      }

      const script =
        document.createElement(
          'script',
        )

      script.id = SCRIPT_ID
      script.src = SCRIPT_URL
      script.async = true
      script.defer = true

      script.onload = () => {
        resolve(window.turnstile)
      }

      script.onerror = reject

      document.head.appendChild(
        script,
      )
    },
  )
}

function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  resetKey,
  theme = 'auto',
}) {
  const containerRef =
    useRef(null)

  const widgetIdRef =
    useRef(null)

  useEffect(() => {
    let active = true

    if (
      !env.turnstileSiteKey ||
      !containerRef.current
    ) {
      return undefined
    }

    async function renderWidget() {
      try {
        const turnstile =
          await loadTurnstileScript()

        if (
          !active ||
          !turnstile ||
          !containerRef.current
        ) {
          return
        }

        if (
          widgetIdRef.current !==
          null
        ) {
          turnstile.remove(
            widgetIdRef.current,
          )

          widgetIdRef.current =
            null
        }

        widgetIdRef.current =
          turnstile.render(
            containerRef.current,
            {
              sitekey:
                env.turnstileSiteKey,

              theme,

              callback(token) {
                onVerify(token)
              },

              'expired-callback'() {
                onExpire?.()
              },

              'error-callback'() {
                onError?.()
              },
            },
          )
      } catch {
        onError?.()
      }
    }

    renderWidget()

    return () => {
      active = false

      if (
        window.turnstile &&
        widgetIdRef.current !==
          null
      ) {
        window.turnstile.remove(
          widgetIdRef.current,
        )

        widgetIdRef.current =
          null
      }
    }
  }, [
    onVerify,
    onExpire,
    onError,
    resetKey,
    theme,
  ])

  if (!env.turnstileSiteKey) {
    return (
      <div
        className="
          rounded-xl
          border
          border-amber-200
          bg-amber-50
          p-4
          text-sm
          text-amber-800
          dark:border-amber-900
          dark:bg-amber-950/30
          dark:text-amber-300
        "
      >
        Contact verification has
        not yet been configured.
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-h-16.5"
    />
  )
}

export default TurnstileWidget