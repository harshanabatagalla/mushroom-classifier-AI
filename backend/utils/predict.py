#!/usr/bin/env python3
"""
Mushroom classifier script that outputs in a format compatible with the existing Node.js API
"""

import sys
import json
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Constants
IMG_HEIGHT = 224
IMG_WIDTH = 224

# Get the script directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, 'mushroom_classifier.h5')

CLASS_NAMES = ['conditionally_edible', 'deadly', 'edible', 'poisonous']

CLASS_DETAILS = {
    'edible': 'This mushroom appears to be from an edible variety, though always consult an expert before consumption.',
    'poisonous': 'This mushroom appears to have characteristics consistent with poisonous varieties. Do not consume.',
    'deadly': 'This mushroom appears to be from a deadly variety. Do not consume under any circumstances.',
    'conditionally_edible': 'This mushroom may be edible under certain conditions, but always consult an expert before consumption.',
}

def is_mushroom(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

    model = tf.keras.applications.MobileNetV2(weights='imagenet')
    predictions = model.predict(img_array, verbose=0)
    decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=5)[0]

    fungi_related = ['mushroom', 'fungus', 'agaric', 'bolete', 'earthstar', 'stinkhorn']
    is_mush = any(any(fungus in pred[1].lower() for fungus in fungi_related) for pred in decoded_predictions)
    top_pred_score = decoded_predictions[0][2]

    return is_mush, top_pred_score

def classify_mushroom(image_path, model_path=MODEL_PATH):
    is_mush, confidence = is_mushroom(image_path)
    if not is_mush:
        return {
            "class": "not_a_mushroom",
            "confidence": f"{confidence:.2f}",
            "is_mushroom": False,
            "details": "The image does not appear to be a mushroom or is not clearly identifiable."
        }

    try:
        result = {
            "is_mushroom": True,
            "classification": "",
            "class": "",
            "confidence": "",
            "details": ""
        }

        mushroom_model = tf.keras.models.load_model(model_path)
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(IMG_HEIGHT, IMG_WIDTH))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        prediction = mushroom_model.predict(img_array, verbose=0)
        class_index = np.argmax(prediction)
        predicted_class = CLASS_NAMES[class_index]
        confidence = float(prediction[0][class_index]) * 100

        result["class"] = predicted_class
        result["classification"] = predicted_class
        result["confidence"] = float(confidence) / 100
        result["details"] = CLASS_DETAILS.get(predicted_class, "This mushroom has been identified. Always consult an expert before handling or consuming any wild mushroom.")

        return result

    except Exception as e:
        print(f"Error during classification: {str(e)}", file=sys.stderr)
        return {
            "class": "error",
            "classification": "error",
            "confidence": 0,
            "is_mushroom": True,
            "details": f"An error occurred during classification: {str(e)}"
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            "class": "error",
            "confidence": 0,
            "details": "Invalid usage. Please provide an image path."
        }))
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.isfile(image_path):
        print(json.dumps({
            "class": "error",
            "confidence": 0,
            "details": f"File not found: {image_path}"
        }))
        sys.exit(1)

    try:
        result = classify_mushroom(image_path)
        print(json.dumps(result))  # Output only the JSON result
    except Exception as e:
        print(json.dumps({
            "class": "error",
            "confidence": 0,
            "details": f"Unexpected error: {str(e)}"
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
