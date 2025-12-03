'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line
    FB: any
    fbAsyncInit: () => void
  }
}

export function FacebookSDK() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: process.env.NEXT_PUBLIC_META_API_VERSION,
      })

      window.FB.AppEvents.logPageView()
    }
    ;(function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0] // Get first existing script tag
      if (d.getElementById(id)) return
      const js = d.createElement(s) as HTMLScriptElement // Create new script element
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode?.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }, [])

  return null // This component doesn't render anything
}
