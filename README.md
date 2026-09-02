# Sajjad Ali & Ayesha Siddiqua — Wedding Invitation Website

A premium, luxury Muslim wedding invitation website built with pure HTML5, CSS3, and Vanilla JavaScript.

## Structure

```
sajjad-ayesha-invitation/
├── index.html              # Main HTML file
├── css/
│   ├── style.css           # Main styles, variables, sections
│   ├── responsive.css      # Media queries (320px → 1440px+)
│   └── animations.css      # AOS-like scroll animations, keyframes
├── js/
│   ├── main.js             # Gate/loading screen, nav, music player
│   ├── countdown.js        # Live countdown to the Nikah/Reception
│   └── animations.js       # Scroll reveal, parallax, gallery lightbox, RSVP
├── assets/
│   ├── images/
│   │   ├── couple.jpg       # Couple portrait (gate + opening section)
│   │   ├── hero-bg.jpg      # Background photo (hero/countdown/events)
│   │   └── og-image.png     # Social sharing image
│   └── music.mp3
├── og-image.jpg / og-image.png  # WhatsApp / social preview image
└── README.md
```

## Couple Details

- **Groom:** Sajjad Ali, S/o Mr. SK Abbas Ali & Mrs. Zuhara Abbas Ali
  (Ameen Manzil, Chalakkunnu, Vidya Nagar, Kasaragod)
- **Bride:** Ayesha Siddiqua, D/o Mr. Muneer Ahmed & Mrs. Nishath Fathima
  (Sahara Kitchenware, Hassan, Karnataka)

## Events

| Event      | Date                        | Time              | Venue                                     |
|------------|-----------------------------|-------------------|--------------------------------------------|
| Nikah      | Thursday, 17 September 2026 | 12:30 PM          | Nandagokula Convention Centre, Hassan       |
| Reception  | Sunday, 20 September 2026   | 4:00 PM onwards   | Wind Valley Resort, Cherkala                |

Hijri dates: Nikah — 1448, Rabi al-Akhir 6 · Reception — 1448, Rabi al-Akhir 9

## Colors

| Token    | Value     |
|----------|-----------|
| Cream    | `#FAF6F0` |
| Rose     | `#C9385C` |
| Gold     | `#D4A017` |
| Blue     | `#3D6B99` |

## Fonts

- **Script (names):** Great Vibes
- **Serif (headings):** Playfair Display
- **Content (body):** Cormorant Garamond / Lato
- **Arabic:** Amiri

## Features

- ✅ Luxury tap-to-open gate with Bismillah + English translation
- ✅ Hero with parallax & entrance animations
- ✅ Live countdown to the Nikah, then to the Reception
- ✅ Bride & Groom / Family section
- ✅ Events card with Google Maps links for both venues
- ✅ Wedding programme timeline
- ✅ Quote section (Quran verse)
- ✅ Gallery with lightbox (ready to enable — add photos to `assets/images/gallery-*.jpg`)
- ✅ Background music player with mute toggle
- ✅ Scroll-reveal animations
- ✅ Fully responsive (320px → 1440px+)
- ✅ SEO meta tags, Open Graph & Twitter Card

## Notes

- Countdown targets are set in `js/config.js` under `countdown.nikkah.target` /
  `countdown.reception.target`, and mirrored in `js/countdown.js`'s fallback defaults.
- Google Maps links use search-query URLs for "Nandagokula Convention Centre, Hassan"
  and "Wind Valley Resort, Cherkala" — swap in exact share links once available
  (in `index.html` and `js/config.js`).
- `og:url` / `canonical` use a placeholder domain `https://sajjad-ayesha.wedding/` —
  update once the site is deployed to its real address.
