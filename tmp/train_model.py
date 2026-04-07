import pandas as pd
from sklearn.linear_model import LinearRegression

# Load dataset
df = pd.read_csv('C:/Users/Shakil Ahmad/.cache/kagglehub/datasets/aakashjoshi123/exercise-and-fitness-metrics-dataset/versions/1/exercise_dataset.csv')

# Preprocessing
features = ['Actual Weight', 'Duration', 'Heart Rate', 'BMI']
target = 'Calories Burn'

# Clean data
df = df.dropna(subset=[target] + features)

X = df[features]
y = df[target]

# Train
model = LinearRegression()
model.fit(X, y)

# Output
print("--- Coefficients ---")
for f, c in zip(features, model.coef_):
    print(f"{f}: {c}")

print(f"Intercept: {model.intercept_}")

# Let's see some samples
print("\n--- Sample Prediction ---")
sample = X.iloc[0].values.reshape(1, -1)
print(f"Features: {X.iloc[0].to_dict()}")
print(f"Actual: {y.iloc[0]}")
print(f"Predicted: {model.predict(sample)[0]}")
