#libraries needed
from flask import (
    Blueprint, 
    render_template, 
    request, 
    redirect, 
    url_for, 
    flash
)
from flask_login import (
                        LoginManager,
                         login_user,
                         logout_user,
                         login_required,
                         current_user
                         )


from website.security.limiter import limiter 

public_views = Blueprint('public_views', __name__)

# ✅ Function to handle role-based redirection
def redirect_user_based_on_role(role):
    if role in ['admin', 'ssg']:
        return redirect(url_for('admin_manage_event.manage_event_render_template'))
    elif role == 'student':
        return redirect(url_for('user_side.user_side_render_template'))
    return redirect(url_for('user_auth.admin_login_render_template'))

@public_views.route('/', methods=['GET', 'POST'])
@limiter.limit("100 per minute")
def home():
    if current_user.is_authenticated:
        return redirect_user_based_on_role(current_user.role)
    
    return render_template('public_home.html', )

@public_views.route('/about', methods=['GET', 'POST'])
@limiter.limit("100 per minute")
def about():
    if current_user.is_authenticated:
        return redirect_user_based_on_role(current_user.role)
    
    return render_template('public_about.html', )

