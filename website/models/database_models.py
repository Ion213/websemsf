from website import db
from sqlalchemy.sql import func
from pytz import timezone
from datetime import datetime,time
from flask_login import UserMixin

manila_tz = timezone('Asia/Manila')

#------------create event model---------------------
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event = db.Column(db.String(255),nullable=False)
    event_description = db.Column(db.String(500))
    date_created = db.Column(db.DateTime)
    date_updated= db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20),nullable=True)
    event_activities = db.relationship('Activities', backref='event', lazy=True)
    event_fees = db.relationship('Fees', backref='event', lazy=True)

class Activities(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activity_name = db.Column(db.String(255),nullable=False)
    start_time = db.Column(db.Time,nullable=False)
    end_time = db.Column(db.Time,nullable=False)
    fines = db.Column(db.Float,nullable=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

class Fees (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fees_name = db.Column(db.String(255),nullable=False)
    fees_amount =  db.Column(db.Float, nullable=False) 
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)


#------------schedule models---------------  
class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name=  db.Column(db.String(255),nullable=False)
    scheduled_date = db.Column(db.DateTime,nullable=False)
    scheduled_activities= db.relationship('Sched_activities', backref='schedule', lazy=True)
    scheduled_fees= db.relationship('Sched_fees', backref='schedule', lazy=True)


class Sched_activities(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activity_name = db.Column(db.String(255),nullable=False)
    start_time = db.Column(db.DateTime,nullable=False)
    end_time = db.Column(db.DateTime,nullable=False)
    fines = db.Column(db.Float,nullable=True)
    sched_id= db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)
    attendances = db.relationship('Attendance', backref='sched_activities', lazy=True)

class Sched_fees (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fees_name = db.Column(db.String(255),nullable=False)
    fees_amount =  db.Column(db.Float, nullable=False) 
    sched_id = db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time_in = db.Column(db.DateTime,nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('sched_activities.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
 #------------------------  

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(100), nullable=False)
    section = db.Column(db.String(100), nullable=True)
    user = db.relationship('User', backref='department', lazy=True)

    
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=True)
    password = db.Column(db.String(150), nullable=False)
    student_ID = db.Column(db.String(20), unique=True, nullable=True)  # Only for students
    first_name = db.Column(db.String(100), nullable=True)             # Only for students
    last_name = db.Column(db.String(100), nullable=True)              # Only for students
    date_registered = db.Column(db.DateTime, nullable=True)
    date_updated = db.Column(db.DateTime, nullable=True)
    role = db.Column(db.String(50), nullable=False, default='student')  # 'student' or 'admin'
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=True)  # Only for students
    attendances = db.relationship('Attendance', backref='user', lazy=True) # Only for students

