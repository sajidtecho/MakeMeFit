import kagglehub
import pandas as pd
import os

# Download latest version
path = kagglehub.dataset_download("aakashjoshi123/exercise-and-fitness-metrics-dataset")
print(f"Path to dataset files: {path}")

# List files in the path
files = os.listdir(path)
print(f"Files found: {files}")

# Assuming there is a CSV, let's find it.
csv_files = [f for f in files if f.endswith('.csv')]
if csv_files:
    data_path = os.path.join(path, csv_files[0])
    df = pd.read_csv(data_path)
    print("\n--- Dataset Info ---")
    print(df.info())
    print("\n--- Head ---")
    print(df.head())
    print("\n--- Columns ---")
    print(df.columns.tolist())
else:
    print("No CSV files found in the dataset.")
