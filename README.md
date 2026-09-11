# RedlibRedirect

Firefox extension that redirects `reddit.com` to a [redlib](https://github.com/redlib-org/redlib) instance, and optionally auto-applies your redlib settings there.

## Features

- **Redirect to redlib** : any `reddit.com` (and subdomain) page is redirected to your chosen redlib instance. Direct media links (`redd.it`, `i.redd.it`, `v.redd.it`, `preview.redd.it`) are left alone since redlib has no route for them.
- **Private windows by default** : redirection only happens in private/incognito windows unless you opt in to regular windows too, so normal browsing is unaffected out of the box.
- **Auto-apply redlib settings** : since private windows don't keep cookies between sessions, the extension can re-apply an exported redlib settings string on your behalf so your preferences (theme, layout, etc.) are restored automatically each time.

## Menu options

Click the toolbar icon to open the settings popup:

- **Redirect target** : pick which redlib instance `reddit.com` redirects to (`safereddit.com`, `redlib.catsarch.com`, `red.artemislena.eu`, or `redlib.privadency.com`).
- **Windows** : check "Also redirect in regular (non-private) windows" to extend the redirect (and settings auto-apply) beyond private windows.
- **Auto-apply settings** : paste a redlib "export settings" string here to have it restored automatically after redirecting.

Click **Save** to persist your changes.
