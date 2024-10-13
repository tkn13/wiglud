from midi2audio import FluidSynth
from pydub import AudioSegment

# Function to convert MIDI to MP3
def midi_to_mp3(midi_file, soundfont_file, output_mp3):
    # Convert MIDI to WAV using FluidSynth
    fs = FluidSynth(soundfont_file)
    wav_output = 'output.wav'
    fs.midi_to_audio(midi_file, wav_output)

    # Convert WAV to MP3 using pydub
    audio = AudioSegment.from_wav(wav_output)
    audio.export(output_mp3, format="mp3")
    print(f"Conversion completed: {output_mp3}")

# Usage
midi_file = "b0c2701e7d45.mid"  # Replace with your MIDI file path
soundfont_file = ""  # Replace with your SoundFont file (.sf2) path
output_mp3 = "b0c2701e7d45.mp3"

midi_to_mp3(midi_file, soundfont_file, output_mp3)
