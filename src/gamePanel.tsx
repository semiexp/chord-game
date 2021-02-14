import assert from 'assert';
import React from 'react';
import { RichButton } from './component/richButton';

import {Note, keyName, ChordType} from './chord'

type GamePanelProps = {
    baseKey: Note;
    score: number;
    soundPlaying: boolean;

    answer: (type: ChordType, base: Note) => void;
    backToTitle: () => void;
    playScale: () => void;
    playChord: () => void;

    highlightChordType?: ChordType;
    highlightChordBase?: Note;
}

export class GamePanel extends React.Component<GamePanelProps, {}> {
    constructor(props: GamePanelProps) {
        super(props);
    }

    render() {
        const {baseKey, score, soundPlaying, answer, backToTitle, playScale, playChord, highlightChordBase, highlightChordType} = this.props;

        const buttons = [
            { text: "I", top: 60, left: 10, base: 0, type: ChordType.MajorTriad },
            { text: "IIm", top: 60, left: 80, base: 2, type: ChordType.MinorTriad },
            { text: "IIIm", top: 60, left: 150, base: 4, type: ChordType.MinorTriad },
            { text: "IV", top: 60, left: 220, base: 5, type: ChordType.MajorTriad },
            { text: "V", top: 60, left: 290, base: 7, type: ChordType.MajorTriad },
            { text: "VIm", top: 60, left: 360, base: 9, type: ChordType.MinorTriad },
            { text: "VIIm-5", top: 60, left: 430, size: 20, base: 11, type: ChordType.MajorTriad }  // TODO
        ];
        let buttonElements = [];
        for (let i = 0; i < buttons.length; ++i) {
            const {text, top, left, base, type, size} = buttons[i];
            const highlight = base === highlightChordBase && type === highlightChordType;
            buttonElements.push(<RichButton text={text} height={50} width={60} textSize={size || 30}
                                            style={{position: "absolute", top, left}} disabled={soundPlaying}
                                            highlight={highlight} onClick={() => answer(type, base)} />);
        }

        return (
            <div style={{height: 300, width: 500, borderStyle: "solid", borderWidth: 2, borderColor: "#c0c0c0", borderRadius: 10,
                         position: "relative", backgroundColor: "#f5f5ff"}}>
                <span style={{position: "absolute", top: 8, left: 5, fontSize: 20}}> Key: {keyName(baseKey)} </span>
                <span style={{position: "absolute", top: 8, left: 100, fontSize: 20}}> Score: {score} </span>

                <RichButton text="Replay" height={30} width={90} textSize={20} style={{position: "absolute", top: 5, left: 290}} disabled={soundPlaying} onClick={() => playChord()} />
                <RichButton text="Play Scale" height={30} width={100} textSize={20} style={{position: "absolute", top: 5, left: 390}} disabled={soundPlaying} onClick={() => playScale()} />

                { buttonElements }

                <RichButton text="Back" height={30} width={60} textSize={20} style={{position: "absolute", top: 260, left: 10}} disabled={soundPlaying} onClick={() => backToTitle()}/>
            </div>
        );
    }
}
