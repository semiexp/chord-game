import assert from 'assert';
import React from 'react';

import {sequentialSynth} from './synth'
import {getChord, getMajorScale, ChordType, Note} from './chord'
import {GamePanel} from './gamePanel'

enum AutomatonState {
    Main, PlayingScale,
}

type ChordGameState = {
    score: number;
    automaton: AutomatonState;
    baseKey: Note;

    soundPlaying: boolean;

    chordType: ChordType;
    chordBase: Note;
}

export class ChordGame extends React.Component<{}, ChordGameState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            score: 0,
            automaton: AutomatonState.Main,
            baseKey: 2,
            soundPlaying: false,

            chordType: ChordType.MajorTriad,
            chordBase: 0,
        };
    }

    async playScale() {
        assert(!this.state.soundPlaying);
        this.setState({
            soundPlaying: true
        });
        await sequentialSynth(getMajorScale(this.state.baseKey, 8), new Array<number>(8).fill(250));
        this.setState({ soundPlaying: false });
    }

    async playChord() {
        assert(!this.state.soundPlaying);
        this.setState({
            soundPlaying: true
        });

        const {chordType, chordBase, baseKey} = this.state;
        console.log("play ", chordType, chordBase);
        await sequentialSynth([getChord(baseKey, chordBase, chordType)], [1000]);
        this.setState({ soundPlaying: false });
    }

    selectNextKey() {
        const candidates = [0, 2, 4, 5, 7, 9, 11];  // TODO
        this.setState({
            baseKey: candidates[Math.floor(Math.random() * candidates.length)]
        });
    }

    selectNextChord(): Promise<void> {
        const candidates = [
            [ChordType.MajorTriad, 0],  // I
            [ChordType.MinorTriad, 2],  // IIm
            [ChordType.MinorTriad, 4],  // IIIm
            [ChordType.MajorTriad, 5],  // IV
            [ChordType.MajorTriad, 7],  // V
            [ChordType.MinorTriad, 9],  // VIm
        ];
        const chord = candidates[Math.floor(Math.random() * candidates.length)];
        return new Promise((resolve, reject) => {this.setState({
            chordType: chord[0],
            chordBase: chord[1]
        }, () => resolve())});
    }

    async answer(type: ChordType, base: Note) {
        console.log(this.state.chordType, this.state.chordBase);
        if (type === this.state.chordType && base === this.state.chordBase) {
            this.setState({
                score: this.state.score + 100
            });
        }
        await this.selectNextChord();
        this.playChord();
    }

    render() {
        const {score, soundPlaying} = this.state;

        return (
            <div>
                <GamePanel baseKey={this.state.baseKey} score={score} soundPlaying={soundPlaying}
                           playScale={() => this.playScale()} playChord={() => this.playChord()}
                           answer={this.answer.bind(this)} />
            </div>
        );
    }
}
