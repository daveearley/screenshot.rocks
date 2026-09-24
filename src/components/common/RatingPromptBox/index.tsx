import React from "react";
import {view} from "@risingstack/react-easy-state";
import {getBrowserExtensionInfo} from "../../../utils/misc";
import {app} from "../../../stores/appStore";
import {styles} from "./styles";

export const RatingPromptBox = view(() => {
    if (!app.shouldShowRatingPrompt) {
        return null;
    }

    const {link, name} = getBrowserExtensionInfo();

    return (
        <aside className={styles()} aria-label="Leave a review">
            <strong>Enjoying the {name}?</strong>
            <p>A quick review helps other people find it.</p>
            <a href={link} target="_blank" rel="noopener noreferrer" onClick={() => localStorage.setItem('hasReviewed', 'true')}>
                Leave a review
            </a>
        </aside>
    );
});
