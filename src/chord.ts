export type Note = number;
export type Chord = Note[];

export const numPitches: number = 12;

// TODO: Support more chord types
export enum ChordType {
    MajorTriad,        // C
    MinorTriad,        // Cm
    DominantSeventh,   // C7
    MajorSeventh,      // CM7
    MinorSeventh,      // Cm7
    MinorMajorSeventh, // CmM7
}

export function pitchName(key: Note, note: Note): string {
    const actualNote = (key + note) % numPitches;

    // TODO: consider enharmonics
    const pitchNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return pitchNames[actualNote];
}

export function keyName(key: Note): string {
    return pitchName(key, 0);
}

export function chordTypeName(type: ChordType): string {
    switch (type) {
        case ChordType.MajorTriad:
            return "";
        case ChordType.MinorTriad:
            return "m";
        case ChordType.DominantSeventh:
            return "7";
        case ChordType.MajorSeventh:
            return "M7";
        case ChordType.MinorSeventh:
            return "m7";
        case ChordType.MinorMajorSeventh:
            return "mM7";
    }
}

export function chordName(key: Note, note: Note, type: ChordType): string {
    return pitchName(key, note) + chordTypeName(type);
}

export function chordPitchDifferences(type: ChordType): Chord {
    switch (type) {
        case ChordType.MajorTriad:
            return [0, 4, 7];
        case ChordType.MinorTriad:
            return [0, 3, 7];
        case ChordType.DominantSeventh:
            return [0, 4, 7, 10];
        case ChordType.MajorSeventh:
            return [0, 4, 7, 11];
        case ChordType.MinorSeventh:
            return [0, 3, 7, 10];
        case ChordType.MinorMajorSeventh:
            return [0, 3, 7, 11];
    }
}

export function getChord(key: Note, note: Note, type: ChordType): Chord {
    const diffs = chordPitchDifferences(type);
    return diffs.map(d => (key + note) % numPitches + d);
}

export function getMajorScale(key: Note, length: number): Chord[] {
    const diffs = [0, 2, 4, 5, 7, 9, 11];
    let ret = [];
    for (let i = 0; i < length; ++i) {
        ret.push([key + diffs[i % diffs.length] + numPitches * Math.floor(i / diffs.length)]);
    }
    return ret;
}
