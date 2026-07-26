/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // Gerzso identity — warm olive-black ground, parchment, ochre gold,
                // pale slate, one hot terracotta. See DESIGN.md.
                ink: {
                    DEFAULT: '#16150F',
                    soft: '#2A2823',
                    line: '#3A382F',
                },
                paper: {
                    DEFAULT: '#E7E2CE',
                    raised: '#F3EFE2',
                    line: '#DCD7C4',
                },
                gold: '#C9A24E', // gilt — accent on dark, CTA
                ochre: '#A98B4B', // brand primary fill (the mark)
                mint: '#7E9E88', // verified / minted — Gerzso sage
                muted: '#6B6858', // secondary text on light grounds
                slate: '#B3C2C1',
                pine: '#3C4A46',
                terracotta: '#B4471F',
                // token-type coding — all in the Gerzso family
                token: {
                    attendance: '#C9A24E',
                    score: '#79A39C',
                    help: '#8FA86B',
                    instructor: '#B08678',
                },
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'SF Mono', 'monospace'],
            },
            fontSize: {
                display: ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.02', fontWeight: '600', letterSpacing: '-0.02em' }],
                h1: ['clamp(2rem, 4vw, 2.75rem)', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.015em' }],
                h2: ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.01em' }],
                h3: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
                eyebrow: ['0.75rem', { lineHeight: '1', fontWeight: '500', letterSpacing: '0.18em' }],
            },
            spacing: {
                '4.5': '1.125rem',
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
            },
            maxWidth: {
                container: '1200px',
                narrow: '760px',
            },
            borderRadius: {
                card: '4px',
                'card-lg': '6px',
            },
            boxShadow: {
                card: '0 1px 0 rgba(22,21,15,0.05), 0 8px 28px -18px rgba(22,21,15,0.45)',
                seal: '0 0 0 1px rgba(201,162,78,0.35), 0 0 40px -12px rgba(201,162,78,0.5)',
            },
            backgroundImage: {
                'ink-grad': 'radial-gradient(120% 120% at 15% 0%, #2A2823 0%, #16150F 55%)',
            },
        },
    },
    plugins: [],
};
