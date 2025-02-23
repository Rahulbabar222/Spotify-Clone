import os
import json

# Define the base directory
songs_dir = "Songs"

# Dictionary to store songs by folder
songs_data = {}

# Traverse the Songs directory
for folder in os.listdir(songs_dir):
    folder_path = os.path.join(songs_dir, folder)

    # Check if it's a directory
    if os.path.isdir(folder_path):
        songs_data[folder] = []

        # Get all MP3 files in the folder
        for file in os.listdir(folder_path):
            if file.endswith(".mp3"):
                songs_data[folder].append(f"{songs_dir}/{folder}/{file}")

# Save the data to a JSON file
with open("newsongs.json", "w") as json_file:
    json.dump(songs_data, json_file, indent=4)

print("✅ songs.json file has been generated successfully!")