import glob
import pickle
import numpy
import sys
from music21 import converter, instrument, note, chord , instrument, note, stream
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from keras.layers import Input
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import LSTM
from keras.layers import Activation
from keras.layers import BatchNormalization as BatchNorm
from keras.utils import to_categorical
from keras.callbacks import ModelCheckpoint

jrpgModelPath = r"../ai/model/MusicGen_100.keras"
jrpgNotePath = r"../ai/midi_songs/jrpg_note.txt"

# def get_notes():
#     """ Get all the notes and chords from the midi files in the midi_songs directory """
#     notes = []

#     for file in glob.glob(r"../ai/midi_songs/*.mid"):
#         midi = converter.parse(file)

#         # print("Parsing %s" % file)

#         notes_to_parse = None

#         try:  # file has instrument parts
#             s2 = instrument.partitionByInstrument(midi)
#             notes_to_parse = s2.parts[0].recurse()
#         except:  # file has notes in a flat structure
#             notes_to_parse = midi.flat.notes

#         for element in notes_to_parse:
#             if isinstance(element, note.Note):
#                 notes.append(str(element.pitch))
#             elif isinstance(element, chord.Chord):
#                 notes.append('.'.join(str(n) for n in element.normalOrder))

#     with open(r'../ai/data/notes', 'wb') as filepath:
#         pickle.dump(notes, filepath)

#     return notes


def prepare_sequences(notes, pitchnames, n_vocab):
    """ Prepare the sequences used by the Neural Network """
    # Map between notes and integers and back
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    sequence_length = 100
    network_input = []
    output = []
    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]
        network_input.append([note_to_int[char] for char in sequence_in])
        output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)

    # Reshape the input into a format compatible with LSTM layers
    normalized_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1))
    # Normalize input
    normalized_input = normalized_input / float(n_vocab)

    return (network_input, normalized_input)

def create_network(network_input, n_vocab):
    """ create the structure of the neural network """
    model = Sequential()
    model.add(Input(shape=(network_input.shape[1], network_input.shape[2])))
    model.add(LSTM(512, recurrent_dropout=0.3, return_sequences=True))
    model.add(LSTM(512, return_sequences=True, recurrent_dropout=0.3))
    model.add(LSTM(512))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(BatchNorm())
    model.add(Dropout(0.3))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))

    return model

def generate_notes(model, network_input, pitchnames, n_vocab, noteAmount):
    """ Generate notes from the neural network based on a sequence of notes """
    # Pick a random sequence from the input as a starting point for the prediction
    start = numpy.random.randint(0, len(network_input) - 1)

    int_to_note = dict((number, note) for number, note in enumerate(pitchnames))

    pattern = network_input[start]
    prediction_output = []

    # Generate 500 notes
    for note_index in range(noteAmount*240):
        prediction_input = numpy.reshape(pattern, (1, len(pattern), 1))
        prediction_input = prediction_input / float(n_vocab)

        prediction = model.predict(prediction_input, verbose=0)

        index = numpy.argmax(prediction)
        result = int_to_note[index]
        prediction_output.append(result)

        pattern.append(index)
        pattern = pattern[1:len(pattern)]

    return prediction_output

def create_midi(prediction_output, instrumentType):
    """ Convert the output from the prediction to notes and create a midi file from the notes """
    offset = 0
    output_notes = []
    if instrumentType == "piano" :
        chosen_instrument = instrument.Piano()
    elif instrumentType == "guitar" :
        chosen_instrument = instrument.Guitar()
    elif instrumentType == "saxophone" :
        chosen_instrument = instrument.SopranoSaxophone()
    else : chosen_instrument = instrument.Piano()

    # Open a text file to write the notes and chords
    with open('../ai/output_notes.txt', 'w') as text_file:

        # Create note and chord objects based on the values generated by the model
        for pattern in prediction_output:
            # Pattern is a chord
            if ('.' in pattern) or pattern.isdigit():
                notes_in_chord = pattern.split('.')
                notes = []
                for current_note in notes_in_chord:
                    new_note = note.Note(int(current_note))
                    new_note.storedInstrument = chosen_instrument
                    notes.append(new_note)
                new_chord = chord.Chord(notes)
                new_chord.offset = offset
                output_notes.append(new_chord)
                # Write chord to text file
                text_file.write(f"Chord: {pattern} at offset {offset}\n")
            # Pattern is a note
            else:
                new_note = note.Note(pattern)
                new_note.offset = offset
                new_note.storedInstrument = chosen_instrument
                output_notes.append(new_note)
                # Write note to text file
                text_file.write(f"Note: {pattern} at offset {offset}\n")

            # Increase offset each iteration so that notes do not stack
            offset += 0.5

    midi_stream = stream.Stream(output_notes)
    midi_stream.insert(0, chosen_instrument)
    midi_stream.write('midi', fp='../ai/test_output.mid')

def MusicTypeSelector(musicType):
    if musicType == "jrpg":
        return jrpgModelPath, readMusicNote(jrpgNotePath)
    else : 
        print("Incorrect Type")
        exit()

def readMusicNote(path) :
    with open(path, 'r') as file:
        note_string = file.read()
    return note_string.split(',')

def GenerateMusic(duration, musicType, instrumentType):
    # notes = readMusicNote("../ai/midi_songs/jrpg_note.txt")
    checkpoint_path, notes = MusicTypeSelector(musicType)
    n_vocab = len(set(notes))
    pitchnames = sorted(set(item for item in notes))
    network_input, network_output = prepare_sequences(notes, pitchnames, n_vocab)
    model = create_network(network_output, n_vocab)

    model.load_weights(checkpoint_path)
    model.compile(optimizer='rmsprop', loss='categorical_crossentropy')

    prediction_output = generate_notes(model, network_input, pitchnames, n_vocab, duration)
    create_midi(prediction_output, instrumentType)

if __name__ == "__main__":
    # Ensure the function name and parameters are passed
    if len(sys.argv) == 4 :
        duration = int(sys.argv[1])
        music_Type = sys.argv[2]
        instrument_Type = sys.argv[3]
        # duration = 1
        # music_Type = "jrpg"
        # instrument_Type = "piano"

        try:
            GenerateMusic(duration, music_Type, instrument_Type)
        except Exception as e:
            print(f"Error executing function: {str(e)}")
    else:
        print("No function specified")