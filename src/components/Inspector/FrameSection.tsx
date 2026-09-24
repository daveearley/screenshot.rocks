import React, {useRef} from "react";
import {view} from "@risingstack/react-easy-state";
import {css} from "emotion";
import {FiImage, FiMonitor, FiSmartphone} from "react-icons/fi";
import {app} from "../../stores/appStore";
import {browserStore, IBrowserStyles} from "../../stores/browserStore";
import {phoneFinishes, phoneStore, PhoneThemes} from "../../stores/phoneStore";
import {noFrameStore} from "../../stores/noFrameStore";
import {historyStore} from "../../stores/historyStore";
import {BrowserThemes, browserThemes} from "../common/Frames/Browser/styles";
import {ScreenshotType} from "../../types";
import {fieldStyles, Row, Section, Segmented, SliderRow, Toggle} from "../ui/controls";
import {ColorWell} from "../ui/ColorWell";

const checkpoint = () => historyStore.saveState();

const styles = css`
  .options { margin-top: 14px; }

  .themes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px 8px; }
  .theme { min-width: 0; padding: 0; border: 0; background: none; color: var(--label-2); font-size: 11px; cursor: default; }
  .theme .chrome {
    display: flex;
    flex-direction: column;
    height: 36px;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .1);
    transition: box-shadow .15s;
  }
  .theme .bar { display: flex; align-items: center; gap: 3px; height: 12px; padding: 0 5px; }
  .theme .bar i { width: 4px; height: 4px; border-radius: 50%; }
  .theme .page { flex: 1; background: linear-gradient(#f2f2f4, #e5e5ea); }
  .theme .name { display: block; margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .theme[aria-pressed="true"] .chrome { box-shadow: 0 0 0 2px var(--bg-sidebar), 0 0 0 4px var(--accent); }
  .theme[aria-pressed="true"] .name { color: var(--label); }
  .theme.custom .chrome {
    align-items: center;
    justify-content: center;
    background: conic-gradient(from 90deg, #ff453a, #ffd60a, #30d158, #64d2ff, #5e5ce6, #bf5af2, #ff453a);
  }

  .address { width: 150px; height: 24px; }

  .finish-heading { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: var(--label-2); }
  .finish-heading span:last-child { color: var(--label); }
  .finishes { display: flex; gap: 12px; padding-left: 2px; }
  .finish {
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    cursor: default;
    transition: transform .12s var(--ease);
  }
  .finish:hover { transform: scale(1.08); }
  .finish[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--bg-sidebar), 0 0 0 4px var(--accent); }

  .divider { height: 1px; margin: 12px 0; background: var(--separator); }
`;

const browserThemeOptions: {theme: BrowserThemes, name: string}[] = [
    {theme: BrowserThemes.Default, name: 'Light'},
    {theme: BrowserThemes.Dark, name: 'Dark'},
    {theme: BrowserThemes.Darker, name: 'Black'},
    {theme: BrowserThemes.Rounder, name: 'Soft'},
    {theme: BrowserThemes.Square, name: 'Square'},
    {theme: BrowserThemes.Weird, name: 'Plum'},
];

const customColorLabels: {key: keyof IBrowserStyles, label: string}[] = [
    {key: 'browserChromeBgColor', label: 'Toolbar'},
    {key: 'browserControlsBgColor', label: 'Address bar'},
    {key: 'browserControlsTextColor', label: 'Address text'},
    {key: 'closeButtonColor', label: 'Close button'},
    {key: 'minimizeButtonColor', label: 'Minimize button'},
    {key: 'maximizeButtonColor', label: 'Zoom button'},
];

const Appearance = view(({corners = true}: {corners?: boolean}) => <>
    {corners && <SliderRow id="corner-radius" label="Corners" value={app.canvasStyles.borderRadius} min={0} max={60} defaultValue={10}
                           onStart={checkpoint} onChange={value => app.canvasStyles.borderRadius = value}/>}
    <SliderRow id="shadow" label="Shadow" value={app.canvasStyles.shadowSize} min={0} max={100} defaultValue={4}
               onStart={checkpoint} onChange={value => app.canvasStyles.shadowSize = value}/>
</>);

const BrowserOptions = view(() => {
    const settings = browserStore.settings;
    const addressEdited = useRef(false);
    const active = Number(settings.activeTheme);
    const selectTheme = (theme: BrowserThemes) => { checkpoint(); browserStore.setBrowserTheme(theme); };
    const toggle = (key: 'showWindowControls' | 'showNavigationButtons' | 'showAddressBar' | 'showSettingsButton') =>
        (checked: boolean) => { checkpoint(); settings[key] = checked; };

    return <>
        <div className="themes" role="group" aria-label="Browser style">
            {browserThemeOptions.map(({theme, name}) => {
                const colors = browserThemes[theme as keyof typeof browserThemes];
                return <button key={theme} type="button" className="theme" aria-pressed={active === theme} onClick={() => selectTheme(theme)}>
                    <span className="chrome" style={{borderRadius: Math.min(colors.browserBorderRadius, 6) || 1}}>
                        <span className="bar" style={{background: colors.browserChromeBgColor}}>
                            {[colors.closeButtonColor, colors.minimizeButtonColor, colors.maximizeButtonColor].map((color, i) => <i key={i} style={{background: color}}/>)}
                        </span>
                        <span className="page"/>
                    </span>
                    <span className="name">{name}</span>
                </button>;
            })}
            <button type="button" className="theme custom" aria-pressed={active === BrowserThemes.Custom}
                    onClick={() => selectTheme(BrowserThemes.Custom)}>
                <span className="chrome" style={{borderRadius: 6}}/>
                <span className="name">Custom</span>
            </button>
        </div>

        {active === BrowserThemes.Custom && <>
            <div className="divider"/>
            {customColorLabels.map(({key, label}) => (
                <Row key={key} label={label}>
                    <ColorWell label={`${label} color`} value={String(browserStore.customStyles[key])} onStart={checkpoint}
                               onChange={hex => (browserStore.customStyles as any)[key] = hex}/>
                </Row>
            ))}
        </>}

        <div className="divider"/>
        <Toggle id="window-controls" label="Window buttons" checked={settings.showWindowControls} onChange={toggle('showWindowControls')}/>
        <Toggle id="navigation-buttons" label="Back & forward" checked={settings.showNavigationButtons} onChange={toggle('showNavigationButtons')}/>
        <Toggle id="menu-button" label="Menu button" checked={settings.showSettingsButton} onChange={toggle('showSettingsButton')}/>
        <Toggle id="address-bar" label="Address bar" checked={settings.showAddressBar} onChange={toggle('showAddressBar')}/>
        {settings.showAddressBar && <Row label="Address" htmlFor="address-text">
            <input id="address-text" className={`${fieldStyles} address`} value={settings.addressBarUrl} placeholder="example.com"
                   spellCheck={false} onFocus={() => { addressEdited.current = false; }}
                   onChange={event => {
                       if (!addressEdited.current) { addressEdited.current = true; checkpoint(); }
                       settings.addressBarUrl = event.target.value;
                       settings.showAddressBarUrl = true;
                   }}/>
        </Row>}
        <div className="divider"/>
        <Appearance/>
    </>;
});

const PhoneOptions = view(() => {
    const settings = phoneStore.settings;
    return <>
        <div className="finish-heading"><span>Finish</span><span>{phoneStore.finish.name}</span></div>
        <div className="finishes" role="group" aria-label="iPhone finish">
            {phoneFinishes.map(finish => (
                <button key={finish.id} type="button" className="finish" title={finish.name} aria-label={finish.name}
                        aria-pressed={settings.finish === finish.id}
                        style={{background: `linear-gradient(135deg, ${finish.edge}, ${finish.body})`}}
                        onClick={() => { checkpoint(); settings.finish = finish.id; }}/>
            ))}
        </div>
        <div className="divider"/>
        <Toggle id="dynamic-island" label="Dynamic Island" checked={settings.showDynamicIsland}
                onChange={checked => { checkpoint(); settings.showDynamicIsland = checked; }}/>
        <Row label="Align screenshot">
            <Segmented label="Screen alignment" value={settings.alignment} className="alignment"
                       options={[{value: 'top', label: 'Top'}, {value: 'center', label: 'Middle'}]}
                       onChange={value => { checkpoint(); settings.alignment = value as 'top' | 'center'; }}/>
        </Row>
        <div className="divider"/>
        <Appearance corners={false}/>
    </>;
});

const ImageOptions = view(() => <>
    <Toggle id="image-outline" label="Hairline outline" checked={noFrameStore.settings.showOutline}
            onChange={checked => { checkpoint(); noFrameStore.settings.showOutline = checked; }}/>
    <div className="divider"/>
    <Appearance/>
</>);

const frameOptions = [
    {value: ScreenshotType.Browser, label: 'Browser', icon: <FiMonitor/>},
    {value: ScreenshotType.Device, label: 'iPhone', icon: <FiSmartphone/>},
    {value: ScreenshotType.None, label: 'Image', icon: <FiImage/>},
];

export const FrameSection = view(() => {
    const setFrame = (frame: ScreenshotType) => {
        if (frame === app.frameType) return;
        checkpoint();
        app.frameType = frame;
        if (frame === ScreenshotType.Device) phoneStore.activeTheme = PhoneThemes.Minimal;
    };
    return (
        <Section id="frame" title="Frame">
            <div className={styles}>
                <Segmented label="Frame type" size="large" options={frameOptions} value={app.frameType} onChange={setFrame}/>
                <div className="options">
                    {app.frameType === ScreenshotType.Browser && <BrowserOptions/>}
                    {app.frameType === ScreenshotType.Device && <PhoneOptions/>}
                    {app.frameType === ScreenshotType.None && <ImageOptions/>}
                </div>
            </div>
        </Section>
    );
});
