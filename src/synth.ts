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

function timedSynch(chord: Chord, duration: number): Promise<void> {
    let synth = new Synth(chord);
    synth.start();
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            synth.stop();
            resolve();
        }, duration);
    });
}

export async function sequentialSynth(chords: Chord[], durations: number[]): Promise<void> {
    assert(chords.length === durations.length);
    for (let i = 0; i < chords.length; ++i) {
        await timedSynch(chords[i], durations[i]);
    }
}
