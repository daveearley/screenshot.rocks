import React from "react";
import {ICanvasProps} from "../../Canvas";
import {view} from "@risingstack/react-easy-state";
import {styles} from "./styles";

export const TwitterFrame = view((props: ICanvasProps) => {
    return (
        <div className={styles(props)}>
            <img className="twitter-logo" src="images/twitter/logo.png"/>
            <div className="flex-shrink-0 d-flex">
                <img src="https://pbs.twimg.com/profile_images/1606271575656960002/ueSKi8FF_x96.jpg"
                     className="rounded-circle mb-4 mb-lg-0 shadow-2" alt="woman avatar" width="70"
                     height="70"/>
                <div className="flex-grow-1 d-flex flex-column justify-content-center ml-2">
                    <div className="tweet-author-name">
                        Dave Earley
                    </div>
                    <div className="tweet-author-handle">
                        @daveearley
                    </div>
                </div>
            </div>
            <div className="flex-grow-1 mb-3 mt-3">
                <div className="m-0">
                    <p>
                        <i className="fas fa-quote-left fa-lg text-warning me-2"/>
                        <span className="tweet-content">Lorem ipsum dolor sit amet consectetur adipisicing
                                  elit. Pariatur sint nesciunt ad itaque aperiam expedita officiis incidunt
                                  minus facere, molestias quisquam impedit inventore.</span>
                    </p>
                    <div className="tweet-date">
                        20th February 2023
                    </div>
                    <div className="tweet-metrics">
                        <div className="metric">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <g>
                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
                                </g>
                            </svg>
                            <div>20</div>
                        </div>
                        <div className="metric">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <g>
                                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
                                </g>
                            </svg>
                            <div>20</div>
                        </div>
                        <div className="metric">
                            <svg viewBox="0 0 24 24">
                                <g>
                                    <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                                </g>
                            </svg>
                            <div>35</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});