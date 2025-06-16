import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import resnet18
from PIL import Image
from werkzeug.utils import secure_filename
import time

app = Flask(__name__)
CORS(app, origins=["https://medical-waste-classify-p8s8.vercel.app"])  

# Configuration
UPLOAD_FOLDER = 'uploads'
HISTORY_FOLDER = 'history'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = os.path.join("model", "protonet_medical_waste.pth")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(HISTORY_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['HISTORY_FOLDER'] = HISTORY_FOLDER

# Medical waste categories
CATEGORIES = [
    "Chemical waste",
    "Infectious Waste",
    "Sharps",
    "Pharmaceutical Waste",
    "General Medical Waste",
    
]

# ---- ProtoNet model definition ----
class ProtoNet(nn.Module):
    def __init__(self, output_dim=256):  # match the checkpoint
        super().__init__()
        backbone = resnet18(weights=None)
        self.encoder = nn.Sequential(*list(backbone.children())[:-1])
        self.output = nn.Linear(backbone.fc.in_features, output_dim)

    def forward(self, x):
        x = self.encoder(x).squeeze()
        x = self.output(x)
        return x


# ---- Load the PyTorch model ----
def load_model():
    try:
        model = ProtoNet(output_dim=256)
        checkpoint = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
        model.load_state_dict(checkpoint)
        model.eval()
        print("✅ ProtoNet loaded.")
        return model
    except Exception as e:
        print(f"❌ Could not load ProtoNet: {e}")
        return None


# Initialize model
model = load_model()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])
# transform = transforms.Compose([
#     transforms.Resize((184, 184)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
# ])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
        image_tensor = transform(image)
        return image_tensor.unsqueeze(0)
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def classify_image(file_path):
    try:
        input_tensor = preprocess_image(file_path)
        if input_tensor is None:
            return None

        with torch.no_grad():
            embedding = model(input_tensor)
            print(f"Model raw output shape: {embedding.shape}")

            classifier_head = nn.Linear(256, len(CATEGORIES))  # Replace with trained head if available
            output = classifier_head(embedding)
            # if len(output.shape) < 2 or output.shape[1] != len(CATEGORIES):

            #     print(f"⚠️ Output shape mismatch: {output.shape}")
            #     return None

            probabilities = torch.nn.functional.softmax(output, dim=-1)
            probabilities = probabilities.squeeze().numpy()
            
           
        results = []
        for i, pred in enumerate(probabilities):
            results.append({
                "category": CATEGORIES[i],
                "confidence": float(pred)
            })

        results.sort(key=lambda x: x["confidence"], reverse=True)

        # Save image to history folder
        timestamp = str(int(time.time()))
        history_path = os.path.join(app.config['HISTORY_FOLDER'], f"{timestamp}_{os.path.basename(file_path)}")
        Image.open(file_path).save(history_path)

        return {
            "top_category": results[0]["category"],
            "confidence": results[0]["confidence"],
            "all_predictions": results,
            "timestamp": time.time(),
            "filename": os.path.basename(file_path),
            "image_path": history_path
        }
    except Exception as e:
        print(f"Error during classification: {e}")
        return None

@app.route('/api/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            if model is None:
                return jsonify({"error": "Model not loaded"}), 500

            result = classify_image(file_path)

            if result is None:
                return jsonify({"error": "Classification failed"}), 500

            result["timestamp"] = time.time()
            result["filename"] = filename

            return jsonify(result)

        except Exception as e:
            return jsonify({"error": f"Error processing image: {str(e)}"}), 500

    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        history = []
        history_files = os.listdir(app.config['HISTORY_FOLDER'])
        history_files.sort(reverse=True)  # Sort by timestamp (newest first)
        
        for filename in history_files:
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                timestamp = int(filename.split('_')[0])
                image_path = os.path.join(app.config['HISTORY_FOLDER'], filename)
                
                # Read and encode image
                with open(image_path, 'rb') as img_file:
                    img_data = base64.b64encode(img_file.read()).decode('utf-8')
                
                history.append({
                    "timestamp": timestamp,
                    "filename": filename.split('_', 1)[1],
                    "image": img_data
                })
        
        return jsonify({"history": history})
    except Exception as e:
        return jsonify({"error": f"Error retrieving history: {str(e)}"}),500
    return jsonify({"error": "Failed to retrieve history"}), 500



@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify({
        "categories": [
             {
                "name": "Chemical Waste",
                "description": "Disinfectants, solvents, reagents, and other chemicals used in medical procedures."
            },
            {
                "name": "Infectious Waste",
                "description": "Waste contaminated with blood and other bodily fluids, cultures and stocks of infectious agents."
            },
            
            {
                "name": "Sharps",
                "description": "Needles, syringes, scalpels, and other sharp objects that can cause cuts or puncture wounds."
            },

            {
                "name": "Pharmaceutical Waste",
                "description": "Unused, expired, or contaminated drugs and vaccines."
            },
            {
                "name": "General Medical Waste",
                "description": "Disposable medical supplies and materials that are not contaminated with infectious agents or bodily fluids."
            }   
           
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Render provides PORT
    app.run(debug=False, host='0.0.0.0', port=port)
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import numpy as np
# import torch
# from torchvision import transforms
# from PIL import Image
# from werkzeug.utils import secure_filename
# import time

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configuration
# UPLOAD_FOLDER = 'uploads'
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
# import os

# MODEL_PATH = os.path.join("backend", "model", "protonet_medical_waste.pth")

# # MODEL_PATH = r'backend\model\protonet_medical_waste.pth'  # Path to your saved model
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # Medical waste categories
# CATEGORIES = [
#     "Infectious Waste",
#     "Sharps",
#     "Pharmaceutical Waste",
#     "Chemical Waste",
    
# ]

# # Load the PyTorch model
# def load_model():
#     try:
#         model = YourModelClass()  # Define your model class
#         model.load_state_dict(torch.load(MODEL_PATH))
#         model.eval()

#         model = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
#         model.eval()
#         return model
#     except Exception as e:
#         print(f"Error loading model: {e}")
#         return None

# # Initialize model
# model = load_model()

# # Image preprocessing
# transform = transforms.Compose([
#     transforms.Resize((184, 184)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
# ])

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def preprocess_image(image_path):
#     try:
#         image = Image.open(image_path).convert('RGB')
#         image_tensor = transform(image)
#         return image_tensor.unsqueeze(0)  # Add batch dimension
#     except Exception as e:
#         print(f"Error preprocessing image: {e}")
#         return None

# def classify_image(file_path):
#     try:
#         # Preprocess the image
#         input_tensor = preprocess_image(file_path)
#         if input_tensor is None:
#             return None

#         # Perform inference
#         with torch.no_grad():
#             output = model(input_tensor)
#             print(f"Model raw output: {output}")
#             print(f"Output shape: {output.shape}")

            
#             # Convert output to probabilities
#             probabilities = torch.nn.functional.softmax(output, dim=1)
#             probabilities = probabilities.squeeze().numpy()

#         # Create results list
#         results = []
#         for i, pred in enumerate(probabilities):
#             results.append({
#                 "category": CATEGORIES[i],
#                 "confidence": float(pred)
#             })
        
#         # Sort by confidence (descending)
#         results.sort(key=lambda x: x["confidence"], reverse=True)
        
#         return {
#             "top_category": results[0]["category"],
#             "confidence": results[0]["confidence"],
#             "all_predictions": results
#         }
#     except Exception as e:
#         print(f"Error during classification: {e}")
#         return None

# @app.route('/api/classify', methods=['POST'])
# def classify():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image part"}), 400
    
#     file = request.files['image']
    
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400
    
#     if file and allowed_file(file.filename):
#         try:
#             filename = secure_filename(file.filename)
#             file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             file.save(file_path)
            
#             # Check if model is loaded
#             if model is None:
#                 return jsonify({"error": "Model not loaded"}), 500
            
#             # Classify the image
#             result = classify_image(file_path)
            
#             if result is None:
#                 return jsonify({"error": "Classification failed"}), 500
            
#             # Add timestamp and filename to result
#             result["timestamp"] = time.time()
#             result["filename"] = filename
            
#             return jsonify(result)
            
#         except Exception as e:
#             return jsonify({"error": f"Error processing image: {str(e)}"}), 500
        
#     return jsonify({"error": "File type not allowed"}), 400

# @app.route('/api/categories', methods=['GET'])
# def get_categories():
#     return jsonify({
#         "categories": [
#             {
#                 "name": "Infectious Waste",
#                 "description": "Waste contaminated with blood and other bodily fluids, cultures and stocks of infectious agents."
#             },
#             {
#                 "name": "Pathological Waste",
#                 "description": "Human tissues, organs, body parts, bodily fluids, and specimens."
#             },
#             {
#                 "name": "Sharps",
#                 "description": "Needles, syringes, scalpels, and other sharp objects that can cause cuts or puncture wounds."
#             },
#             {
#                 "name": "Pharmaceutical Waste",
#                 "description": "Unused, expired, or contaminated drugs and vaccines."
#             },
#             {
#                 "name": "Chemical Waste",
#                 "description": "Disinfectants, solvents, reagents, and other chemicals used in medical procedures."
#             },
           
            
#         ]
#     })

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)