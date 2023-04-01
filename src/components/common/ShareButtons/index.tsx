import {SocialProviders} from "../../../types";
import {FaWhatsapp, RiFacebookCircleLine, RiTwitterLine} from "react-icons/all";
import React from "react";
import {css} from "emotion";

const styles = css`
  text-align: center;

  button {
    background: none;
    border: none;
  }

  svg {
    fill: #fff;
    width: 30px;
    height: 30px;
    margin: 0 10px;
  }
`

export const ShareButtons = () => {
    const handleShareClick = (provider: SocialProviders) => {
        switch (provider) {
            case SocialProviders.WhatsApp:
                window.location.href = 'whatsapp://send?text=Create%20beautiful%20browser%20mockups%20in%20seconds+https%3A%2F%2Fscreenshot.rocks';
                break
            case SocialProviders.Facebook:
                window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fscreenshot.rocks%20');
                break;
            case SocialProviders.Twitter:
                window.open('https://twitter.com/intent/tweet?url=https%3A%2F%2Fscreenshot.rocks%20&text=Create%20beautiful%20browser%20mockups%20in%20seconds');
                break;
        }
    }

    return (
        <div className={styles}>
            <button onClick={() => handleShareClick(SocialProviders.Facebook)}>
                <RiFacebookCircleLine/>
            </button>
            <button onClick={() => handleShareClick(SocialProviders.Twitter)}>
                <RiTwitterLine/>
            </button>
            <button onClick={() => handleShareClick(SocialProviders.WhatsApp)}>
                <FaWhatsapp/>
            </button>
        </div>
    )
};