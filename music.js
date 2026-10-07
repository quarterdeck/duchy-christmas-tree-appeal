// 8-bit Christmas music made with the Web Audio API. No audio files.
// Melodies are public domain. Each note is [name, beats]. 'R' is a rest.

const SONGS = [
  {
    name: 'Jingle Bells',
    tempo: 200,
    beatsPerBar: 4,
    melody: [
      ['E4', 1], ['E4', 1], ['E4', 2], ['E4', 1], ['E4', 1], ['E4', 2],
      ['E4', 1], ['G4', 1], ['C4', 1.5], ['D4', 0.5], ['E4', 4],
      ['F4', 1], ['F4', 1], ['F4', 1.5], ['F4', 0.5], ['F4', 1], ['E4', 1], ['E4', 1], ['E4', 0.5], ['E4', 0.5],
      ['E4', 1], ['D4', 1], ['D4', 1], ['E4', 1], ['D4', 2], ['G4', 2],
      ['E4', 1], ['E4', 1], ['E4', 2], ['E4', 1], ['E4', 1], ['E4', 2],
      ['E4', 1], ['G4', 1], ['C4', 1.5], ['D4', 0.5], ['E4', 4],
      ['F4', 1], ['F4', 1], ['F4', 1.5], ['F4', 0.5], ['F4', 1], ['E4', 1], ['E4', 1], ['E4', 0.5], ['E4', 0.5],
      ['G4', 1], ['G4', 1], ['F4', 1], ['D4', 1], ['C4', 4],
    ],
    bassRoots: ['C3', 'C3', 'C3', 'C3', 'F2', 'C3', 'D3', 'G2', 'C3', 'C3', 'C3', 'C3', 'F2', 'C3', 'G2', 'C3'],
  },
  {
    name: 'We Wish You a Merry Christmas',
    tempo: 170,
    beatsPerBar: 3,
    pickupBeats: 1,
    melody: [
      ['D4', 1],
      ['G4', 1], ['G4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F#4', 0.5],
      ['E4', 1], ['E4', 1], ['E4', 1],
      ['A4', 1], ['A4', 0.5], ['B4', 0.5], ['A4', 0.5], ['G4', 0.5],
      ['F#4', 1], ['D4', 1], ['D4', 1],
      ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['B4', 0.5], ['A4', 0.5],
      ['G4', 1], ['E4', 1], ['D4', 0.5], ['D4', 0.5],
      ['E4', 1], ['A4', 1], ['F#4', 1],
      ['G4', 3],
    ],
    bassRoots: ['G2', 'C3', 'A2', 'D3', 'E3', 'C3', 'D3', 'G2'],
  },
  {
    name: 'Deck the Halls',
    tempo: 180,
    beatsPerBar: 4,
    melody: [
      ['G4', 1.5], ['F4', 0.5], ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
      ['D4', 0.5], ['E4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 1.5], ['D4', 0.5], ['C4', 1], ['B3', 1], ['C4', 2],
      ['G4', 1.5], ['F4', 0.5], ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
      ['D4', 0.5], ['E4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 1.5], ['D4', 0.5], ['C4', 1], ['B3', 1], ['C4', 2],
      ['D4', 1.5], ['E4', 0.5], ['F4', 1], ['D4', 1], ['E4', 1.5], ['F4', 0.5], ['G4', 1], ['D4', 1],
      ['E4', 0.5], ['F#4', 0.5], ['G4', 1], ['A4', 0.5], ['B4', 0.5], ['C5', 1], ['B4', 1], ['A4', 1], ['G4', 2],
      ['G4', 1.5], ['F4', 0.5], ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
      ['D4', 0.5], ['E4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 1.5], ['D4', 0.5], ['C4', 1], ['B3', 1], ['C4', 2],
    ],
    bassRoots: ['C3', 'C3', 'G2', 'C3', 'C3', 'C3', 'G2', 'C3', 'G2', 'C3', 'D3', 'G2', 'C3', 'C3', 'G2', 'C3'],
  },
];

const NOTE_OFFSETS = { C: -9, 'C#': -8, D: -7, 'D#': -6, E: -5, F: -4, 'F#': -3, G: -2, 'G#': -1, A: 0, 'A#': 1, B: 2 };

function frequency(noteName) {
  const [, letter, octave] = noteName.match(/^([A-G]#?)(\d)$/);
  const semitonesFromA4 = NOTE_OFFSETS[letter] + (Number(octave) - 4) * 12;
  return 440 * 2 ** (semitonesFromA4 / 12);
}

// Oom-pah bass: root on the first beat, the fifth on the other beats.
function bassLine(song) {
  const rest = song.pickupBeats ? [['R', song.pickupBeats]] : [];
  const bars = song.bassRoots.map((root) => [
    [frequency(root), 1],
    ...Array.from({ length: song.beatsPerBar - 1 }, () => [frequency(root) * 1.5, 1]),
  ]);
  return [...rest, ...bars.flat()];
}

let audioContext = null;
let masterVolume = null;
let songIndex = 0;

function playNote(frequencyInHz, startTime, duration, waveType, volume) {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = waveType;
  oscillator.frequency.value = frequencyInHz;
  envelope.gain.setValueAtTime(volume, startTime);
  envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.95);
  oscillator.connect(envelope).connect(masterVolume);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
  return oscillator;
}

function playTrack(notes, startTime, secondsPerBeat, waveType, volume) {
  let time = startTime;
  let lastOscillator = null;
  for (const [note, beats] of notes) {
    const duration = beats * secondsPerBeat;
    if (note !== 'R') {
      const hz = typeof note === 'number' ? note : frequency(note);
      lastOscillator = playNote(hz, time, duration, waveType, volume);
    }
    time += duration;
  }
  return lastOscillator;
}

function playNextSong() {
  const song = SONGS[songIndex];
  songIndex = (songIndex + 1) % SONGS.length;
  const secondsPerBeat = 60 / song.tempo;
  const startTime = audioContext.currentTime + 0.1;
  const lastMelodyNote = playTrack(song.melody, startTime, secondsPerBeat, 'square', 0.12);
  playTrack(bassLine(song), startTime, secondsPerBeat, 'triangle', 0.25);
  // `onended` follows the audio clock, so a suspended (muted) context also pauses the playlist.
  lastMelodyNote.onended = () => setTimeout(playNextSong, 600);
}

export function startMusic() {
  if (audioContext) {
    audioContext.resume();
    return;
  }
  audioContext = new AudioContext();
  masterVolume = audioContext.createGain();
  masterVolume.gain.value = 0.5;
  masterVolume.connect(audioContext.destination);
  playNextSong();
}

export function stopMusic() {
  audioContext?.suspend();
}
