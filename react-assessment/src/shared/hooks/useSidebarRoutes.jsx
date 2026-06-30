import { useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSidebar } from '@/shared/context/SidebarContext'

/**
 * Matches a URL splat against a set of route configs and syncs the sidebar stack.
 *
 * Each route config has:
 *   - pattern: string with `:param` placeholders (e.g. ':postId/comments/new')
 *   - title: string | string[] — sidebar title(s) for each stack level
 *   - render: (params) => ReactElement | ReactElement[] — one per stack level
 *   - closeUrl: (params) => string — the URL to navigate to when this sidebar level is closed
 *
 * For multi-level sidebars, title and render return arrays (one per stack entry).
 *
 * @param {string} basePath - The base path for this page (e.g. '/posts')
 * @param {Array} routeConfigs - Array of route config objects
 */
export function useSidebarRoutes(basePath, routeConfigs) {
  const { '*': splat = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { replaceStack, closeAllSidebars } = useSidebar()
  const prevSplatRef = useRef(null)

  useEffect(() => {
    // Don't re-run if splat hasn't changed
    if (prevSplatRef.current === splat) return
    prevSplatRef.current = splat

    if (!splat) {
      closeAllSidebars()
      return
    }

    // Try to match against route configs (longest pattern first)
    const sorted = [...routeConfigs].sort(
      (a, b) => b.pattern.split('/').length - a.pattern.split('/').length
    )

    for (const config of sorted) {
      const params = matchPattern(config.pattern, splat)
      if (params) {
        const titles = Array.isArray(config.title) ? config.title : [config.title]
        const elements = config.render(params)
        const renders = Array.isArray(elements) ? elements : [elements]

        const closeUrl = config.closeUrl ? config.closeUrl(params) : basePath

        const entries = titles.map((t, i) => ({
          title: t,
          content: renders[i],
          closeUrl: i === 0 ? basePath : config.closeUrl ? config.closeUrl(params) : basePath,
        }))

        // For multi-level, compute intermediate close URLs
        // The last entry's closeUrl pops to its parent level
        if (entries.length > 1) {
          entries[entries.length - 1].closeUrl = closeUrl
        }

        replaceStack(entries)
        return
      }
    }

    // No match — close everything
    closeAllSidebars()
  }, [splat, basePath, routeConfigs, replaceStack, closeAllSidebars])

  // Provide navigation helpers
  function navigateToBase() {
    navigate(basePath + location.search)
  }

  return { navigateToBase }
}

/**
 * Match a pattern like ':postId/edit' against a splat like '5/edit'.
 * Returns an object of extracted params or null if no match.
 */
function matchPattern(pattern, splat) {
  const patternParts = pattern.split('/')
  const splatParts = splat.split('/')

  if (patternParts.length !== splatParts.length) return null

  const params = {}

  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i]
    const sp = splatParts[i]

    if (pp.startsWith(':')) {
      params[pp.slice(1)] = sp
    } else if (pp !== sp) {
      return null
    }
  }

  return params
}
