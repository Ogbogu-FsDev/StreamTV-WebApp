from flask import Flask, render_template, request, redirect, url_for, jsonify, session, flash
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key'

def init_db():
    with sqlite3.connect('D:/StreamTV-WebApp/User-Accounts.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL,
                            email TEXT UNIQUE NOT NULL)''')
        conn.commit()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    # Expecting data as JSON (including username, password, and email)
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']  # Get the email from the request data
    
    # Insert into database
    with sqlite3.connect('D:/StreamTV-WebApp/User-Accounts.db') as conn:
        cursor = conn.cursor()
        try:
            # Insert username, password, and email into the users table
            cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, password))
            conn.commit()
            return jsonify({'status': 'success'})
        except sqlite3.IntegrityError:
            return jsonify({'status': 'error', 'message': 'Username or email already taken'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    with sqlite3.connect('D:/StreamTV-WebApp/User-Accounts.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        if user:
            session['user'] = username
            return jsonify({'status': 'success', 'redirect': url_for('dashboard')})
        return jsonify({'status': 'error', 'message': 'Invalid credentials'})

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

# TV Guide Route
@app.route('/tv-guide')
def tv_guide():
    return render_template('tv-guide.html')

# Watch TV Route
@app.route('/watchTV')
def watch():
    return render_template('watchTV.html')

# Contact Page Route
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        email = request.form['email']
        subject = request.form['subject']
        message = request.form['message']
        flash("Message sent successfully!", "success")
        return redirect(url_for('contact'))

    return render_template('contact.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
