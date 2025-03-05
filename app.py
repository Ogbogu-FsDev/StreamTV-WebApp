from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import sqlite3
import hashlib

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Used for session management
DATABASE = "/Giru-TV/data/GTVusers.db"

# Function to connect to database
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route for the Contact page
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Extract form data
        email = request.form['email']
        subject = request.form['subject']
        message = request.form['message']

        # You can add your email handling logic here (send the message, save it, etc.)

        # Redirect to a thank you page or display a success message
        return redirect(url_for('thank_you'))

    return render_template('contact.html')

# Route to render the login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get("email")  # Get email from form
        password = request.form.get("password")  # Get password from form
        hashed_password = hashlib.sha256(password.encode()).hexdigest()  # Hash input password

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, hashed_password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['user_id'] = user['id']
            session['username'] = user['name']
            return redirect(url_for('dashboard'))  # Redirect to dashboard on success
        else:
            return render_template('login.html', error="Invalid email or password")  # Show error message

    return render_template('login.html')

# Protected dashboard route (only logged-in users can access)
@app.route('/dashboard')
def dashboard():
    if 'user_id' in session:
        return f"Welcome, {session['username']}! <br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for('login'))

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# Route to handle registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = hashlib.sha256(data.get("password").encode()).hexdigest()  # Hash password

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()
        response = {"success": True}
    except sqlite3.IntegrityError:
        response = {"success": False, "message": "Email already exists. Please try another one."}

    conn.close()
    return jsonify(response)

# Route for the TV Guide page
@app.route('/tv-guide')
def tv_guide():
    return render_template('tv-guide.html')

if __name__ == '__main__':
    app.run(debug=True)
