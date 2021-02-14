import assert from 'assert';
import React from 'react';

import {sequentialSynth} from './synth';
import {getChord, getMajorScale, ChordType, Note} from './chord';
import {GamePanel} from './gamePanel';
import { RichButton } from './component/richButton';
import { isThisTypeNode } from 'typescript';

enum AutomatonState {
    Title, Main, PlayingScale, PlayingChord,
}

function isGameState(state: AutomatonState): boolean {
    return state === AutomatonState.Main || state === AutomatonState.PlayingScale || state === AutomatonState.PlayingChord;
}

type ChordGameState = {
    automaton: AutomatonState;

    score: number;
    numTrials: number;
    baseKey: Note;

    chordType: ChordType;
    chordBase: Note;
}

export class ChordGame extends React.Component<{}, ChordGameState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            automaton: AutomatonState.Title,

            score: 0,
            numTrials: 0,
            baseKey: 2,

            chordType: ChordType.MajorTriad,
            chordBase: 0,
        };
    }

    startGame() {
        assert(this.state.automaton === AutomatonState.Title);
        this.setState({
            automaton: AutomatonState.Main,
            score: 0,
            numTrials: 0
        }, () => this.renewKey());
    }

    backToTitle() {
        assert(this.state.automaton === AutomatonState.Main);
        this.setState({ automaton: AutomatonState.Title });
    }

    async playScale() {
        assert(this.state.automaton === AutomatonState.Main);
        this.setState({ automaton: AutomatonState.PlayingScale });
        await sequentialSynth(getMajorScale(this.state.baseKey, 8), new Array<number>(8).fill(250));
        this.setState({ automaton: AutomatonState.Main });
    }

    async playChord() {
        assert(this.state.automaton === AutomatonState.Main);
        this.setState({ automaton: AutomatonState.PlayingChord });

        const {chordType, chordBase, baseKey} = this.state;
        await sequentialSynth([getChord(baseKey, chordBase, chordType)], [1000]);
        this.setState({ automaton: AutomatonState.Main });
    }

    selectNextKey(): Promise<void> {
        const candidates = [0, 2, 4, 5, 7, 9, 11];  // TODO
        return new Promise((resolve, reject) => this.setState({
            baseKey: candidates[Math.floor(Math.random() * candidates.length)]
        }, () => resolve()));
    }

    async renewKey() {
        await this.selectNextKey();
        await this.playScale();
        await this.selectNextChord();
        await this.playChord();
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
        const nextScore = this.state.score + (type === this.state.chordType && base === this.state.chordBase ? 100 : 0);
        const nextNumTrials = this.state.numTrials + 1;

        this.setState({
            score: nextScore,
            numTrials: nextNumTrials
        });

        if (nextNumTrials % 10 === 0) {
            await this.renewKey();
        } else {
            await this.selectNextChord();
            this.playChord();
        }
    }

    render() {
        const {automaton, score} = this.state;
        const soundPlaying = automaton === AutomatonState.PlayingChord || automaton === AutomatonState.PlayingScale;

        return (
            <div>
                { automaton === AutomatonState.Title &&
                    <div style={{height: 300, width: 500, borderStyle: "solid", borderWidth: 2, borderColor: "#c0c0c0", borderRadius: 10,
                    position: "relative", backgroundColor: "#f5f5ff"}}>
                        <div style={{textAlign: "center", position: "absolute", top: 80, width: "100%", fontSize: 50}}>
                            guessChord
                        </div>
                        <RichButton text="Start" height={40} width={100} textSize={20} style={{position: "absolute", top: 180, left: 200 }}
                                    onClick={() => this.startGame()} />
                    </div>
                }
                { isGameState(automaton) &&
                    <GamePanel baseKey={this.state.baseKey} score={score} soundPlaying={soundPlaying}
                           backToTitle={() => this.backToTitle()} playScale={() => this.playScale()} playChord={() => this.playChord()}
                           answer={this.answer.bind(this)} />
                }
            </div>
        );
    }
}
