import assert from 'assert';
import {Note, Chord} from './chord'

function getFrequency(note: Note): number {
    return Math.pow(2, (note - 9) / 12) * 440;
}

export class Synth {
    audioCtx: AudioContext;
    oscillators: OscillatorNode[];

    constructor(chord: Chord) {
        this.audioCtx = new AudioContext();
        this.oscillators = [];

        for (const note of chord) {
            let oscillator = new OscillatorNode(this.audioCtx, {
                type: "sawtooth",
                frequency: getFrequency(note)
            });
            oscillator.connect(this.audioCtx.destination);
            this.oscillators.push(oscillator);
        }
    }

    start() {
        for (const oscillator of this.oscillators) {
            oscillator.start();
        }
    }

    stop() {
        for (const oscillator of this.oscillators) {
            oscillator.stop();
        }
    }
}

export function sequentialSynth(chords: Chord[], durations: number[], onFinish?: () => void) {
    assert(chords.length === durations.length);
    if (chords.length === 0) {
        return;
    }
    let synths: Synth[] = [];
    for (let i = 0; i < chords.length; ++i) {
        synths.push(new Synth(chords[i]));
    }
    synths[0].start();

    let elapsed = 0;
    for (let i = 0; i < chords.length; ++i) {
        elapsed += durations[i];
        setTimeout(() => {
            synths[i].stop();
            if (i + 1 < chords.length) {
                synths[i + 1].start();
            } else {
                if (onFinish) {
                    onFinish();
                }
            }
        }, elapsed);
    }
}
