from flask import Flask, jsonify, request, Response, make_response, redirect, url_for
from flask_cors import CORS
import csv, uuid
import json
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

#validate session based on given tokenid
def session_validate():
    response = requests.get("http://localhost:8000/sso/login?service=http://localhost:5173/login", cookies = request.cookies.to_dict())
    print("=== Kết quả kiểm tra redirect SSO ===")
    print(f"Mã trạng thái cuối cùng: {response.status_code}")
    print(f"URL cuối cùng sau tất cả các redirect: {response.url}")
    print(f"Số lần redirect: {len(response.history)}")
    found = False
    if response.history:
        print("\nLịch sử redirect:")
        for i, r in enumerate(response.history):
            print(f"{i+1}. {r.status_code} {r.url}")
            if r.status_code == 302:
                found = True
                break
    else:
        return None
    if not found:
        return None
    return request.cookies.to_dict()

def identification(id = None):
    cookie_val = session_validate()
    if cookie_val is None:
        return {
            "selfid" : None,
            "name": None,
            "role": None,
            "state": None,
            "major": None
        }
    key = ""
    if id is not None:
        key = str(id).strip()
    else:
        key = str(cookie_val["user_id"]).strip()
    try:
        response = requests.get("http://127.0.0.1:7999/user?user_id=" + key)
        if response.status_code == 200:
            data = response.json()
            print(data["name"])
            return {
                    "selfid": data.get("user_id", None),
                    "name": data.get("name", None),
                    "role": data.get("role", None),
                    "state": data.get("status", None),
                    "major": data.get("major", None)
                }
        else:
            return {
                "selfid": None,
                "name": None,
                "role": None,
                "state": None,
                "major": None
            }
    except requests.exceptions.RequestException:
        return {
                "selfid": None,
                "name": None,
                "role": None,
                "state": None,
                "major": None
            }
    
def read_notifications():
    cookie_val = session_validate()
    if cookie_val is None:
        return None
    key = cookie_val["user_id"]
    notifications = []
    try:
        with open("notifications.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["userid"] == str(key):
                    notifications.append({
                        "id": row["notifid"],
                        "message": row["message"],
                        "date": row["date"]
                    })
        return notifications
    except FileNotFoundError:
        return []
    
def read_messages():
    cookie_val = session_validate()
    if cookie_val is None:
        return None
    key = cookie_val["user_id"]
    messages = []
    usermap = {}
    try:
        with open("roles.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                usermap[row["userid"]] = row["name"]
    except FileNotFoundError:
        return None
    try:
        with open("messages.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["userid"] == str(key):
                    messages.append({
                        "id": row["messageid"],
                        "to": usermap[row["receiverid"]],
                        "message": row["message"],
                        "date": row["date"]
                    })
            return messages
    except FileNotFoundError:
        return []
    

def read_events(all=False):
    cookie_val = session_validate()
    if cookie_val is None:
        return []
    
    key = cookie_val["user_id"]
    events = []
    
    try:
        if all:
            with open("sessions.csv", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                with open("events.csv", newline="", encoding="utf-8") as csvfile2:
                    reader2 = csv.DictReader(csvfile2)
                    with open("roomcapacity.csv", newline="", encoding="utf-8") as csvfile3:
                        reader3 = csv.DictReader(csvfile3)
                        roommap = {row3["room"]: row3["capacity"] for row3 in reader3}
                        csvfile3.seek(0)
                        joined_event_ids = {row2["eventid"] for row2 in reader2 if row2["userid"] == str(key)}
                        csvfile2.seek(0)
                        for row in reader:
                            data = identification(row["tutorid"])
                            events.append({
                                "id": row["eventid"],
                                "title": row["title"],
                                "date": row["date"],
                                "timestart": row["timestart"],
                                "timeend": row["timeend"],
                                "room": row["room"],
                                "capacity": roommap.get(row["room"], "Unknown"),
                                "num_joined": len([1 for r in reader2 if r["eventid"] == row["eventid"]]),
                                "status": "joined" if row["eventid"] in joined_event_ids and row["status"]=="upcoming" else "completed" if row["status"]=="completed" else "available",
                                "tutorname": data.get("name", "Unknown"),
                                "major": data.get("major", "Unknown")
                            })
                            csvfile2.seek(0)
        else:
            with open("sessions.csv", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                with open("events.csv", newline="", encoding="utf-8") as csvfile2:
                    reader2 = csv.DictReader(csvfile2)
                    joined_event_ids = {row2["eventid"] for row2 in reader2 if row2["userid"] == str(key)}
                    csvfile2.seek(0)
                    for row in reader:
                        if row["eventid"] in joined_event_ids or row["tutorid"] == str(key):
                            events.append({
                                "id": row["eventid"],
                                "title": row["title"],
                                "date": row["date"],
                                "timestart": row["timestart"],
                                "timeend": row["timeend"],
                                "room": row["room"],
                                "status": row["status"],
                                "tutor": identification(row["tutorid"]).get("name", "unknown")
                            })
                
        return events
    except FileNotFoundError:
        return []
    
def fetch_sessions():
    cookie_val = session_validate()
    if cookie_val is None:
        return []
    
    key = cookie_val["user_id"]
    sessions = []
    room_map = {}
    session_map = {}
    try:
        #get room cap
        with open("roomcapacity.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                room_map[row["room"]] = row["capacity"]

        #map event with current joined
        with open("events.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if session_map.get(row["eventid"]) is None:
                    session_map[row["eventid"]] = 1
                else:
                    session_map[row["eventid"]] += 1

        with open("sessions.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["tutorid"] == str(key) and row["status"] == "upcoming":
                    sessions.append({
                        "sessionid": row["eventid"],
                        "room": row["room"],
                        "capacity": room_map[row["room"]],
                        "joined": session_map.get(row["eventid"]) if session_map.get(row["eventid"]) is not None else 0,
                        "title": row["title"],
                        "timestart": row["timestart"],
                        "timeend": row["timeend"]
                    })
            
            return sessions

    except FileNotFoundError:
        return []
        

#set cookie for error checking (gonna delete later)
@app.route("/set-cookie")
def set_cookie():
    resp = make_response(jsonify({"status": "cookie set"}))
    cookie_value = json.dumps({
        "token_type": "refresh",
        "exp": 1764492775, # Thời gian hết hạn (Unix timestamp)
        "iat": 1764406375, # Thời gian tạo (Issued At)
        "jti": "93e37f741c954dcdb9ba07de80fbbb71", # ID token duy nhất
        "user_id": 6
    })
    resp.set_cookie("session", cookie_value, httponly=True, samesite="None", secure=True)

    #then add the tokenid into the database
    with open("ticket.csv", "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, ["ticketid"])
        writer.writerow({"ticketid" : "93e37f741c954dcdb9ba07de80fbbb71"})
    return resp

@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    data = read_notifications()
    if data is None:
        return redirect(url_for("get_identity"))
    return jsonify(data)

@app.route("/api/messages", methods=["GET"])
def get_messages():
    data = read_messages()
    if data is None:
        return redirect(url_for("get_identity"))
    return jsonify(data)

@app.route("/api/identity", methods=["GET"])
def get_identity():
    data = identification()
    return jsonify(data)

@app.route("/api/user", methods=["GET"])
def get_user():
    
    user_id = request.args.get("id")

    if not user_id:
        # Xử lý trường hợp không có ID được cung cấp
        return jsonify({"error": "Missing 'id' query parameter"}), 400

    data = identification(user_id)

    return jsonify(data)

@app.route("/api/events", methods=["GET"])
def get_events():
    data = read_events()
    return jsonify(data)

@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    data = read_events(all=True)
    return jsonify(data)

@app.route("/api/sessions/<eventid>", methods=["POST"])
def subscribe_session(eventid):
    cookie_val = session_validate()
    if cookie_val is None:
        return redirect(url_for("get_identity"))
    key = cookie_val["user_id"]
    print("Subscribing user:", key, "to event:", eventid)
    if not eventid:
        return jsonify({"error": "Missing 'eventid' in request body"}), 400
    #add entry in events.csv
    row = {
        "eventid": eventid,
        "userid": str(key)
    }
    with open("events.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        if f.tell() == 0:
            writer.writeheader()
        writer.writerow(row)
    return jsonify({"status": "subscribed"})

@app.route("/api/sessions/<eventid>", methods=["DELETE"])
def unsubscribe_session(eventid):
    cookie_val = session_validate()
    if cookie_val is None:
        return redirect(url_for("get_identity"))
    key = cookie_val["user_id"]
    if not eventid:
        return jsonify({"error": "Missing 'eventid' in request body"}), 400
    #remove entry in events.csv
    keep = []
    try:
        with open("events.csv", "r", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if not (row["eventid"] == eventid and row["userid"] == str(key)):
                    keep.append(row)
        with open("events.csv", "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, ["eventid", "userid"])
            writer.writeheader()
            writer.writerows(keep)
    except FileNotFoundError:
        pass
    return jsonify({"status": "unsubscribed"})

@app.route("/logout")
def logout():
    resp = make_response(jsonify({
        "status": "success",
        "message": "Logged out successfully"
    }))

    requests.get("http://localhost:8000/sso/logout", cookies = request.cookies.to_dict())
    return resp

@app.route("/api/create-event", methods=["POST"])
def create_event():
    data = request.json
    eventid = str(uuid.uuid4())

    new_row = {
        "eventid": eventid,
        "title": data.get("title", ""),
        "date": str(data.get("start")).split("T")[0],  # YYYY-MM-DD
        "timestart": data.get("start", ""),
        "timeend": data.get("end", ""),
        "room": data.get("room", ""),
        "status": "upcoming",
        "tutorid": data.get("userid", "")
    }

    #check for time overlap
    room_map = {}
    with open("roomcapacity.csv", newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            room_map[row["room"]] = row["capacity"]

    with open("sessions.csv", newline="", encoding="utf-8") as csvfile:
        fmt = "%Y-%m-%dT%H:%M:%S.%fZ"
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row["room"] == new_row["room"]:
                s1 = datetime.strptime(row["timestart"], fmt)
                e1 = datetime.strptime(row["timeend"], fmt)
                s2 = datetime.strptime(new_row["timestart"], fmt)
                e2 = datetime.strptime(new_row["timeend"], fmt)

                if s2 > e2:
                    return jsonify({"success": False, "ErrorCode": "1"})
                elif s2 < e1 and e2 > s1:
                    return jsonify({"success": False, "ErrorCode": "2"})
            elif room_map.get(new_row["room"]) is None:
                return jsonify({"success": False, "ErrorCode": "3"})

    with open("sessions.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=new_row.keys())
        if f.tell() == 0:
            writer.writeheader()
        writer.writerow(new_row)

    return jsonify({"success": True, "ErrorCode": "0"})

@app.route("/api/fetch-sessions", methods=["GET"])
def get_session():
    data = fetch_sessions()
    return jsonify(data)

@app.route("/api/delete-session/<sessionid>", methods=["DELETE"])
def delete_session(sessionid):
    you = identification()
    if you["selfid"] is None or you["role"] != "tutor":
        return jsonify({"success": False, "ErrorCode": "Unauthenticated attempt"})
    else:
        try:
            #Delete session
            sessionlist = []
            header = []
            with open("sessions.csv", "r", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                header = reader.fieldnames
                sessionlist = list(reader)
            sessionlist = [row for row in sessionlist if row["eventid"] != str(sessionid)]
            with open("sessions.csv", "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=header)
                writer.writeheader()
                writer.writerows(sessionlist)

            #Delete Events
            eventlist = []
            header = []
            with open("events.csv", "r", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                header = reader.fieldnames
                eventlist = list(reader)
            
            eventlist = [row for row in eventlist if row["eventid"] != str(sessionid)]
            with open("events.csv", "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=header)
                writer.writeheader()
                writer.writerows(eventlist)

            return jsonify({"success": True, "ErrorCode": "Delete successfully!"})
        except Exception as e:
            return jsonify({"success": False, "ErrorCode": str(e)})


if __name__ == "__main__":
    app.run(debug=True, port=8080)