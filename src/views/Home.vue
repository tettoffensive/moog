<template lang="pug">
  .kbd
    .key(
    @mouseover="handleMouseOver"
    @mousedown="handleMouseDown"
    :class="note.classes"
    :id="note.name"
    @mouseleave="handleMouseLeave"
    @mouseup="handleMouseUp"
    v-for="note in notes"
    v-bind:key="note.name")
</template>

<script>
import Envelope from 'envelope-generator';

const context = new AudioContext();
const gain = context.createGain();

let oscillators = null;
let env = null;

export default {
  name: 'home',
  data() {
    return {
      oscillatorBank: [
        {
          range: 2,
          waveform: 'sawtooth',
          sync: false,
          offset: 0,
          on: true,
        },
        {
          range: 8,
          waveform: 'sawtooth',
          offset: -3,
          on: true,
        },
        {
          range: 8,
          waveform: 'sawtooth',
          offset: 0,
          on: false,
        },
      ],
      loudnessContour: {
        attackTime: 0,
        decayTime: 0,
        sustainLevel: 0,
        releaseTime: 0,
      },
      isMouseDown: false,
      octaves: [2, 3, 4, 5],
    };
  },
  computed: {
    notes() {
      const baseArray = [
        {
          name: 'C',
          classes: '',
        },
        {
          name: 'C#',
          classes: 'sharp',
        },
        {
          name: 'D',
          classes: '',
        },
        {
          name: 'D#',
          classes: 'sharp',
        },
        {
          name: 'E',
          classes: '',
        },
        {
          name: 'F',
          classes: '',
        },
        {
          name: 'F#',
          classes: 'sharp',
        },
        {
          name: 'G',
          classes: '',
        },
        {
          name: 'G#',
          classes: 'sharp',
        },
        {
          name: 'A',
          classes: '',
        },
        {
          name: 'A#',
          classes: 'sharp',
        },
        {
          name: 'B',
          classes: '',
        }];
      /* eslint-disable max-len */
      return this.octaves.map(o => baseArray.map(e => ({ name: e.name + o, classes: e.classes }))).flat();
    },
  },
  methods: {
    handleMouseDown(event) {
      this.isMouseDown = true;
      this.playNote(event);
    },
    handleMouseUp() {
      this.isMouseDown = false;
      this.stopNote();
    },
    handleMouseOver(event) {
      if (this.isMouseDown) {
        this.playNote(event);
      }
    },
    handleMouseLeave() {
      this.stopNote();
    },
    getFrequencyOfNote(note) {
      const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
      let octave = 1;

      let keyNumber = notes.indexOf(note.slice(0, -1));

      if (note.length === 3) {
        octave = note.charAt(2);
      } else {
        octave = note.charAt(1);
      }

      if (keyNumber < 3) {
        keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
      } else {
        keyNumber = keyNumber + ((octave - 1) * 12) + 1;
      }

      return 440 * (2 ** ((keyNumber - 49) / 12));
    },
    playNote(event) {
      const frequency = this.getFrequencyOfNote(event.target.id);
      if (!frequency) return;
      if (!this.oscillatorBank) return;

      env = new Envelope(context, this.loudnessContour);
      env.connect(gain.gain);

      oscillators = this.oscillatorBank.flatMap((config) => {
        if (!config.on) return null;
        const oscillator = context.createOscillator();
        oscillator.frequency.value = (frequency * config.range + config.offset) || 440;
        oscillator.type = config.waveform;
        oscillator.connect(context.destination);
        oscillator.start(context.currentTime);
        return oscillator;
      });

      env.start(context.currentTime);
    },
    stopNote() {
      if (!oscillators) return;
      env.release(context.currentTime);
      const stopTime = env.getReleaseCompleteTime();
      oscillators.forEach((oscillator) => {
        if (oscillator) {
          oscillator.stop(stopTime);
          oscillator.disconnect();
        }
      });
      env.stop(stopTime);
      oscillators = null;
      env = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.kbd {
  display: flex;
}

.key {
  width: 50px;
  height: 300px;
  background-color: white;
  margin: 1px 1px;
  z-index: 50;
}

.key.sharp {
  position: relative;
  width: 40px;
  height: 200px;
  margin: 0 -20px;
  color: white;
  background: #343434;
  z-index: 100;
}

</style>
