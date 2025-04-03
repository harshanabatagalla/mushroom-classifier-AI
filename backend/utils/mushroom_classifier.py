import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

class MushroomClassifier:
    def __init__(self, model_path='sporocarp_classifier.h5', confidence_threshold=0.6):
        # Get the absolute path of the current script's directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Combine the script's directory with the model file name
        model_file_path = os.path.join(script_dir, model_path)
        
        # Load the model using the absolute file path
        self.model = load_model(model_file_path)
        
        # Class labels
        self.class_labels = [
            'edible_mushroom_sporocarp', 
            'edible_sporocarp', 
            'poisonous_mushroom_sporocarp', 
            'poisonous_sporocarp'
        ]
        
        # Confidence threshold to distinguish between mushroom and non-mushroom
        self.confidence_threshold = confidence_threshold
    
    def preprocess_image(self, img_path, target_size=(224, 224)):
        img = image.load_img(img_path, target_size=target_size)
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    
    def predict(self, img_path):
        try:
            # Preprocess the image before prediction
            processed_image = self.preprocess_image(img_path)
            
            # Get predictions from the model
            predictions = self.model.predict(processed_image)
            
            # Get the maximum prediction probability
            max_confidence = np.max(predictions[0])
            
            # If confidence is below threshold, classify as "not_a_mushroom"
            if max_confidence < self.confidence_threshold:
                return {
                    'class': 'not_a_mushroom',
                    'confidence': float(max_confidence),
                    'details': 'The image does not appear to be a mushroom or is not clearly identifiable'
                }
            
            # Get the predicted class and confidence
            predicted_class_index = np.argmax(predictions[0])
            predicted_class = self.class_labels[predicted_class_index]
            confidence = float(predictions[0][predicted_class_index])
            
            # Return the result
            return {
                'class': predicted_class,
                'confidence': confidence
            }
        except Exception as e:
            return {
                'error': str(e),
                'class': 'unknown',
                'confidence': 0.0
            }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'error': 'No image path provided',
            'class': 'unknown',
            'confidence': 0.0
        }))
        sys.exit(1)
    
    # Get the image path from the command-line argument
    image_path = sys.argv[1]
    
    # Create an instance of the MushroomClassifier
    classifier = MushroomClassifier()
    
    # Get the prediction result
    result = classifier.predict(image_path)
    
    # Print the result as JSON (no extra logging output)
    print(json.dumps(result))

if __name__ == '__main__':
    main()
