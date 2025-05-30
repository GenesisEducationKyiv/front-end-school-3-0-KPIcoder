# ADR 01: Custom Music Player Implementation

**Date:** 2025-05-29

Nowadays typical music apps set high expectations, Therefore, our app must support playlists, gapless playback, fades, and global volume control. HTML5 audio behaves inconsistently across browsers and mobile devices—autoplay locks, event quirks and codec fallbacks all require custom workarounds. Our current use of native <audio> element isn't even a touch close to the expected player, meaning we should implement a real-world player from scratch. Using external tools is highly preferrable. Any chosen library must be lightweight (ideally under 20 KB gzipped) and allow lazy loading.

---

## Decision

We will adopt **Howler.js** as our core audio engine, accessed via a small abstraction layer. Howler.js will handle:

1. **Volume & Fading**

   - Use Howler’s `volume()` and `fade()` APIs for smooth fade-ins/outs and a global master volume.

2. **Cross-Platform Reliability**

   - Leverage Howler’s Web Audio API implementation with HTML5 Audio fallback for consistent desktop and mobile behavior, including automatic mobile unlock on first interaction.

3. **Event Lifecycle Management**

   - Subscribe to Howler’s `onload`, `onplay`, `onend`, and error callbacks to drive UI state without tangled callbacks.

4. **Lazy Loading**

   - Dynamically import Howler.js in components to keep initial bundle size small.

---

## Rationale

1. **Feature Coverage**

   - Howler.js ships with built-in sprite maps, fades, positional audio, and global controls that would require extensive custom work with the raw HTML5 API.

2. **Developer Productivity**

   - A clean, promise-friendly API lets us load and play sounds in a few lines; wrapping it in the custom abstactions that wraps the original implementation, yields idiomatic integration.

3. **Performance & Footprint**

   - At \~17 KB gzipped, Howler.js is lightweight. Sprite support cuts network overhead by bundling multiple clips.

4. **Consistency**

   - Abstracts away dozens of browser and mobile edge cases, giving us one stable API surface instead of patching individual quirks.

---

## Status

**Proposed**.

---

## Consequences

### Positive

- Rich audio feature set (sprites, fades, spatial audio) with minimal custom code.
- Consistent, light, cross-platform playback without manual hacks.
- Faster and easier implementation / maintainance than building a custom player from scratch.

### Negative

- Introduces a third-party dependency.
- Slight increase in client bundle size and need to manage lazy loading.
- Future migration away from Howler.js would require rewriting the audio layer.
