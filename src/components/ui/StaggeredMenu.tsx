import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
    label: string;
    ariaLabel?: string;
    link?: string;
    action?: () => void;
}
export interface StaggeredMenuSocialItem {
    label: string;
    link: string;
}
export interface StaggeredMenuProps {
    position?: 'left' | 'right';
    colors?: string[];
    items?: StaggeredMenuItem[];
    socialItems?: StaggeredMenuSocialItem[];
    displaySocials?: boolean;
    displayItemNumbering?: boolean;
    className?: string;
    logoUrl?: string;
    menuButtonColor?: string;
    openMenuButtonColor?: string;
    accentColor?: string;
    isFixed?: boolean;
    changeMenuColorOnOpen?: boolean;
    closeOnClickAway?: boolean;
    isCompact?: boolean;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    inlineTrigger?: boolean;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
    position = 'right',
    colors = ['#B19EEF', '#5227FF'],
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    logoUrl = '/logo.png',
    menuButtonColor = '#5C3A1A',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    accentColor = '#5C3A1A',
    isFixed = false,
    closeOnClickAway = true,
    isCompact = false,
    onMenuOpen,
    onMenuClose,
    inlineTrigger = false
}: StaggeredMenuProps) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);

    const panelRef = useRef<HTMLDivElement | null>(null);
    const preLayersRef = useRef<HTMLDivElement | null>(null);
    const preLayerElsRef = useRef<HTMLElement[]>([]);

    const iconRef = useRef<HTMLSpanElement | null>(null);

    const openTlRef = useRef<gsap.core.Timeline | null>(null);
    const closeTweenRef = useRef<gsap.core.Tween | null>(null);
    const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
    const colorTweenRef = useRef<gsap.core.Tween | null>(null);

    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
    const busyRef = useRef(false);

    const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const icon = iconRef.current;

            if (!panel || !icon) return;

            // preLayers logic removed
            preLayerElsRef.current = [];

            const offscreen = position === 'left' ? -100 : 100;
            gsap.set(panel, { xPercent: offscreen, autoAlpha: 0 });

            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

            if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
        });
        return () => ctx.revert();
    }, [menuButtonColor, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        const numberEls = Array.from(
            panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

        // Start state for panel
        const panelStart = position === 'left' ? -100 : 100;

        // Reset elements for entrance animation
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        // Ensure visible before animating in
        gsap.set(panel, { autoAlpha: 1 });

        const tl = gsap.timeline({ paused: true });

        // Simple panel slide in
        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: 0.5, ease: 'power4.out' },
            0
        );

        if (itemEls.length) {
            // Start items slightly after panel starts moving
            const itemsStart = 0.2;

            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 0.8, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
                itemsStart
            );

            if (numberEls.length) {
                tl.to(
                    numberEls,
                    { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08, from: 'start' } },
                    itemsStart + 0.1
                );
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = 0.35;

            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' },
                        onComplete: () => {
                            gsap.set(socialLinks, { clearProps: 'opacity' });
                        }
                    },
                    socialsStart + 0.04
                );
            }
        }

        openTlRef.current = tl;
        return tl;
    }, [position]);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;
        itemEntranceTweenRef.current?.kill();

        const panel = panelRef.current;
        if (!panel) return;

        closeTweenRef.current?.kill();

        const offscreen = position === 'left' ? -100 : 100;

        closeTweenRef.current = gsap.to(panel, {
            xPercent: offscreen,
            duration: 0.35,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                // Reset internal state
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

                // Hide to prevent overflow
                gsap.set(panel, { autoAlpha: 0 });

                busyRef.current = false;
            }
        });
    }, [position]);

    const animateIcon = useCallback((opening: boolean) => {
        const icon = iconRef.current;
        if (!icon) return;

        spinTweenRef.current?.kill();

        if (opening) {
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power4.out' } })
                .to(icon, { rotate: 90, duration: 0.5 });
        } else {
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power3.inOut' } })
                .to(icon, { rotate: 0, duration: 0.5 });
        }
    }, []);

    const animateColor = useCallback(
        (opening: boolean) => {
            const btn = toggleBtnRef.current;
            if (!btn) return;
            colorTweenRef.current?.kill();
            if (changeMenuColorOnOpen) {
                const targetColor = opening ? openMenuButtonColor : menuButtonColor;
                colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
            } else {
                gsap.set(btn, { color: menuButtonColor });
            }
        },
        [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
    );

    React.useEffect(() => {
        if (toggleBtnRef.current) {
            if (changeMenuColorOnOpen) {
                const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
                gsap.set(toggleBtnRef.current, { color: targetColor });
            } else {
                gsap.set(toggleBtnRef.current, { color: menuButtonColor });
            }
        }
    }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }

        animateIcon(target);
        animateColor(target);
    }, [playOpen, playClose, animateIcon, animateColor, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            openRef.current = false;
            setOpen(false);
            onMenuClose?.();
            playClose();
            animateIcon(false);
            animateColor(false);
        }
    }, [playClose, animateIcon, animateColor, onMenuClose]);

    React.useEffect(() => {
        if (!closeOnClickAway || !open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                toggleBtnRef.current &&
                !toggleBtnRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeOnClickAway, open, closeMenu]);

    const wrapperClass = inlineTrigger
        ? 'staggered-menu-wrapper relative z-50 inline-block'
        : `staggered-menu-wrapper pointer-events-none relative w-full h-full z-50`;

    const scopeClass = inlineTrigger
        ? `sm-scope z-50 inline-block`
        : `sm-scope z-50 ${isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden' : 'absolute top-0 right-0 w-auto h-auto'}`;

    const headerClass = inlineTrigger
        ? 'staggered-menu-header inline-flex items-center justify-center p-0 bg-transparent relative z-[60]'
        : `staggered-menu-header absolute top-0 right-0 w-auto flex items-center justify-end p-4 bg-transparent pointer-events-none z-[60]`;

    return (
        <div
            className={scopeClass}
        >
            <div
                className={
                    (className ? className + ' ' : '') + wrapperClass
                }
                style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
                data-position={position}
                data-open={open || undefined}
            >
                {/* Header containing the toggle and logo. Positioned absolutely to overlay correctly. */}
                <header
                    className={headerClass}
                    aria-label="Main navigation header"
                >
                    <button
                        ref={toggleBtnRef}
                        className={`sm-toggle relative inline-flex items-center justify-center bg-transparent border-0 cursor-pointer overflow-visible pointer-events-auto`}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        aria-controls="staggered-menu-panel"
                        onClick={toggleMenu}
                        type="button"
                        style={{ padding: 0, margin: 0 }}
                    >
                        <span
                            ref={iconRef}
                            className="sm-icon relative flex items-center justify-center [will-change:transform]"
                            aria-hidden="true"
                            style={{ flexDirection: 'column', gap: '5px' }}
                        >
                            <span style={{ width: '24px', height: '3px', backgroundColor: open ? openMenuButtonColor : menuButtonColor, display: 'block', borderRadius: '2px' }} />
                            <span style={{ width: '24px', height: '3px', backgroundColor: open ? openMenuButtonColor : menuButtonColor, display: 'block', borderRadius: '2px' }} />
                            <span style={{ width: '24px', height: '3px', backgroundColor: open ? openMenuButtonColor : menuButtonColor, display: 'block', borderRadius: '2px' }} />
                        </span>
                    </button>
                    {/* Inline overrides for styles */}
                    {inlineTrigger && (
                        <style>{`
                            .sm-scope .staggered-menu-header { position: relative !important; top: auto !important; left: auto !important; width: auto !important; }
                         `}</style>
                    )}
                </header>

                <aside
                    id="staggered-menu-panel"
                    ref={panelRef}
                    className="staggered-menu-panel fixed top-0 right-0 h-full bg-white flex flex-col overflow-y-auto z-[50] backdrop-blur-[12px] pointer-events-auto shadow-2xl"
                    style={{
                        WebkitBackdropFilter: 'blur(12px)',
                        width: isCompact ? 'clamp(250px, 30vw, 380px)' : 'clamp(300px, 40vw, 450px)',
                        padding: isCompact ? '5em 1.5em 2em 1.5em' : '6em 2em 2em 2em'
                    }}
                    aria-hidden={!open}
                >
                    {/* Logo Inside Panel for branding */}
                    <div className="absolute top-8 left-8 sm-logo flex items-center select-none pointer-events-auto" aria-label="Logo">
                        <img
                            src={logoUrl}
                            alt="Logo"
                            className="sm-logo-img block h-8 w-auto object-contain"
                            draggable={false}
                            width={110}
                            height={24}
                        />
                    </div>

                    <div className="sm-panel-inner flex-1 flex flex-col gap-5 mt-8">
                        <ul
                            className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
                            role="list"
                            data-numbering={displayItemNumbering || undefined}
                            style={isCompact ? { gap: '0.75rem' } : {}}
                        >
                            {items && items.length ? (
                                items.map((it, idx) => {
                                    const content = (
                                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform" style={isCompact ? { textTransform: 'capitalize' } : {}}>
                                            {it.label}
                                        </span>
                                    );

                                    if (it.action) {
                                        return (
                                            <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                                                <button
                                                    className="sm-panel-item relative text-black font-semibold text-left cursor-pointer leading-none transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em] bg-transparent border-none p-0"
                                                    style={isCompact ? { fontSize: '1.5rem', textTransform: 'capitalize', letterSpacing: '0' } : { fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '-2px' }}
                                                    onClick={() => {
                                                        it.action?.();
                                                        closeMenu();
                                                    }}
                                                    aria-label={it.ariaLabel}
                                                    data-index={idx + 1}
                                                >
                                                    {content}
                                                </button>
                                            </li>
                                        )
                                    }

                                    return (
                                        <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                                            <a
                                                className="sm-panel-item relative text-black font-semibold cursor-pointer leading-none transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]"
                                                style={isCompact ? { fontSize: '1.5rem', textTransform: 'capitalize', letterSpacing: '0' } : { fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '-2px' }}
                                                href={it.link}
                                                aria-label={it.ariaLabel}
                                                data-index={idx + 1}
                                            >
                                                {content}
                                            </a>
                                        </li>
                                    )
                                })
                            ) : (
                                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                                    <span className="sm-panel-item relative text-black font-semibold text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                            No items
                                        </span>
                                    </span>
                                </li>
                            )}
                        </ul>

                        {displaySocials && socialItems && socialItems.length > 0 && (
                            <div className="sm-socials mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">
                                <h3 className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">Socials</h3>
                                <ul
                                    className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                                    role="list"
                                >
                                    {socialItems.map((s, i) => (
                                        <li key={s.label + i} className="sm-socials-item">
                                            <a
                                                href={s.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sm-socials-link text-[1.2rem] font-medium text-[#111] no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear"
                                            >
                                                {s.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 50; pointer-events: none; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: flex-end; padding: 2em; background: transparent; pointer-events: none; z-index: 60; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { position: fixed; top: 0; right: 0; height: 100vh; background: white; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; overflow-y: auto; z-index: 50; box-shadow: -10px 0 30px rgba(0,0,0,0.1); }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { display: none; }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 600; font-size: 3rem; cursor: pointer; line-height: 1; letter-spacing: -1px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
@media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
      `}</style>
        </div>
    );
};

export default StaggeredMenu;
