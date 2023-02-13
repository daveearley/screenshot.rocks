import {getBrowserExtensionInfo} from "../../../utils/misc";
import React from "react";
import {styles} from "./styles";
import {view} from "@risingstack/react-easy-state";
import {app} from "../../../stores/appStore";

export const RatingPromptBox = view(() => {
    if (!app.shouldShowRatingPrompt) {
        return null;
    }

    const {link, name} = getBrowserExtensionInfo();

    const handleReviewClick = (() => {
        localStorage.setItem('hasReviewed', 'true');
        window.location.href = link
    });

    return (
        <div className={styles()}>
            <div className={'emoji'}>
                <span aria-label={'star'} role={'img'}>🙌</span>
            </div>
            <h3>Thanks for using our {name}!</h3>
            We'd love if you could <a href={'#!'} onClick={handleReviewClick}>leave a review</a>.
        </div>
    );
});