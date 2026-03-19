import sqlite3
import os

db_path = r'f:\Live-Weather-Dashboard\instance\db.sqlite'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name, email FROM user")
        rows = cursor.fetchall()
        print("User Data (Name, Email):")
        for row in rows:
            print(f"Name: {row[0]}, Email: {row[1]}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print("Database not found")
