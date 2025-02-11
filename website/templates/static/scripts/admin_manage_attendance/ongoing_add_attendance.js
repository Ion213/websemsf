$(document).ready(function() {
    // ADD attendees
    $('#user-list').on('click', '.add-btn', function(e) {
        e.preventDefault();  // Prevent the default action

        var activity_Id = $("#activityComboBox").val();  // Get selected activity ID
        var user_Id = $(this).data('id');
        var name = $(this).data('name');

        if (!activity_Id) { // Corrected syntax
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No Ongoing Event and Activity',
                confirmButtonText: 'OK',
                timer: 1500,
                timerProgressBar: true
            });
            return;  // Exit function if no activity is selected
        }

        $.ajax({
            type: 'POST',
            url: `/add_attendees/${activity_Id}/${user_Id}`, 
            success: function(response) {
                if (response.success) {
                    if (typeof ongoing_attendance_table !== "undefined") {
                        ongoing_attendance_table.ajax.reload(null, false);  // Reload table if defined
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `${name} added successfully!`,
                        confirmButtonText: 'OK',
                        timer: 1500,
                        timerProgressBar: true
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Already Attended',
                        text: response.message,
                        confirmButtonText: 'OK',
                        timer: 1500,
                        timerProgressBar: true
                    });
                }
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred: ' + error,
                    confirmButtonText: 'OK',
                    timer: 1500,
                    timerProgressBar: true
                });
            }
        });
    });
});
