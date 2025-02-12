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
                     return jsonify({'success': False, 'message': 'Please input email and password'})
                #hashed_password = generate_password_hash(password, method='sha256')
                valid_user= User.query.filter_by(
                    email=email,
                    password=password
                ).first()

                if valid_user:  # Replace with hashed password check
                    login_user(valid_user)
                    if valid_user.role == 'admin':
                        return jsonify({
                            'success': True, 
                            'message': 'Login Successfully',
                            'redirect_url': url_for('admin_manage_event.manage_event_render_template')
                            })
                    elif valid_user.role == 'ssg':
                        return jsonify({
                            'success': True, 
                            'message': 'Login Successfully',
                            'redirect_url': url_for('admin_manage_event.manage_event_render_template')
                            })
                    else:
                        return jsonify({
                            'success': True, 
                            'message': 'Login Successfully',
                            'redirect_url': url_for('user_side.user_side_render_template')
                            })
                else:
                    return jsonify({'success': False, 'message': 'Invalid credentials'})
            except Exception as e:
                return jsonify({'success': False, 'message': f'Error {e}'})

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