  #libraries needed
from flask import (
    Blueprint, 
    render_template, 
    request, 
    redirect, 
    url_for, 
    flash,
    jsonify
)
from flask_login import (
                        LoginManager,
                         login_user,
                         logout_user,
                         login_required,
                         current_user
                         )

from werkzeug.security import generate_password_hash

from website.models.database_models import User
#create blueprint/routes
user_auth = Blueprint('user_auth', __name__)
#login user
@user_auth.route('/admin_login_render_template', methods=['GET','POST'])
def admin_login_render_template():
    if request.method == 'POST':
            try:
                email = request.form.get('emailT')
                password = request.form.get('passwordT')
                
                if not email or not password:
                    flash(f'Email and Password Cannot be empty', category='login_error')
                #hashed_password = generate_password_hash(password, method='sha256')
                valid_user= User.query.filter_by(
                    email=email,
                    password=password
                ).first()

                if valid_user:  # Replace with hashed password check
                    login_user(valid_user)
                    if valid_user.role == 'admin':
                        flash('Log in successfully!', category='login_success')
                        return redirect(url_for('admin_manage_event.manage_event_render_template'))
                    elif valid_user.role == 'ssg':
                        flash('Log in successfully!', category='login_success')
                        return redirect(url_for('admin_manage_event.manage_event_render_template'))
                    else:
                        flash('Log in successfully!', category='login_success')
                else:
                    flash('Please input a valid User account', category='login_error')
            except Exception as e:
                flash(f'{e}', category='login_error')

    return render_template('public_user_auth.html')

#logout user
@user_auth.route('/user_logout', methods=['POST'])  # Ensure this is POST, not GET
@login_required
def user_logout():
    logout_user()  # Example if using Flask-Login
    return jsonify({
        'success': True,
        'redirect_url': url_for('user_auth.admin_login_render_template')
    })