from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data/materials.csv"
USER_FILE = "data/user_info.csv"

def load_data():
    with open(DATA_FILE, newline='', encoding='utf-8') as file:
        # Strip whitespace from all CSV values
        return [
            {k: v.strip() if v else "" for k, v in row.items()}
            for row in csv.DictReader(file)
        ]

@app.get("/subject/{subject_code}")
def get_subject_info(subject_code: str):
    data = load_data()
    for row in data:
        if row["subject_code"] == subject_code:
            return {
                "subject_name": row["subject_name"],
                "subject_code": subject_code
            }
    return {"subject_name": "Không tìm thấy", "subject_code": subject_code}

@app.get("/subjects")
def get_subjects(search: str = "", category: str = "", lecturer: str = ""):
    data = load_data()

    # Collect filter values from all rows
    all_categories = set()
    all_lecturers = set()
    subjects_list = []

    for row in data:
        subject_name = row["subject_name"]
        subject_code = row["subject_code"]
        row_category = row["category"]
        row_lecturer = row["lecturer"]

        # Add to filter sets
        if row_category:
            all_categories.add(row_category)
        if row_lecturer:
            all_lecturers.add(row_lecturer)

        # Apply filters
        if search and search.lower() not in subject_name.lower():
            continue
        if category and category != "All" and row_category != category:
            continue
        if lecturer and lecturer != "All" and row_lecturer != lecturer:
            continue

        subjects_list.append({
            "subject_name": subject_name,
            "subject_code": subject_code,
            "category": row_category,
            "lecturer": row_lecturer,
        })

    # Deduplicate subjects by code
    unique_subjects = {}
    for s in subjects_list:
        if s["subject_code"] not in unique_subjects:
            unique_subjects[s["subject_code"]] = s

    return {
        "subjects": list(unique_subjects.values()),
        "categories": sorted(all_categories),
        "lecturers": sorted(all_lecturers),
    }


@app.get("/materials/{subject_code}")
def get_materials(subject_code: str):
    data = load_data()
    grouped = {}

    for row in data:
        if row["subject_code"] == subject_code:
            category = row["category"]
            grouped.setdefault(category, []).append({
                "title": row["title"],
                "type": row["type"],
                "file_url": row["file_url"]
            })

    return grouped

def load_users():
    with open(USER_FILE, newline='', encoding='utf-8') as file:
        return [
            {k: v.strip() if v else "" for k, v in row.items()}
            for row in csv.DictReader(file)
        ]

@app.get("/user")
def get_user(user_id: str):
    users = load_users()

    for row in users:
        if row["User_ID"] == user_id:
            return {
                "user_id": user_id,
                "name": row.get("Name", ""),
                "status": row.get("Status", ""),
                "role": row.get("Role", ""),
                "major": row.get("Major", "")  
            }

    return {
        "user_id": user_id,
        "name": "Không tìm thấy",
        "status": "",
        "role": "",
        "major": ""
    }

@app.get("/user/full")
def get_user_full(user_id: str):
    users = load_users()
    for row in users:
        if row["User_ID"] == user_id:
            return row  # return the full row
    return {"User_ID": user_id, "Name": "Không tìm thấy"}

# use: uvicorn libcore_server:app --reload --port 7999