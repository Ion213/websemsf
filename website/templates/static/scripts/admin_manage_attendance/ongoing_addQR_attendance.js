$(document).ready(function(){
    const html5QrCode = new Html5Qrcode("reader");
    let selectedCameraId = null;
    let isScanning = false; // Track scanner state
    let scanCooldown = false; // Prevent multiple scans

    // Populate the camera dropdown
    function populateCameraDropdown() {
        Html5Qrcode.getCameras().then(devices => {
            if (devices.length > 0) {
                let cameraSelect = $("#camera-select");
                cameraSelect.empty();
                devices.forEach(device => {
                    cameraSelect.append(`<option value="${device.id}">${device.label || `Camera ${device.id}`}</option>`);
                });
                selectedCameraId = devices[0].id; // Default to first camera
            } else {
                alert("No cameras found.");
            }
        }).catch(err => console.error("Error fetching cameras:", err));
    }

    // Fetch cameras when the page loads
    populateCameraDropdown();

    // Scanner configuration
    const config = {
        fps: 10,
        aspectRatio: 1,
        disableFlip: true,
        qrbox: function(viewfinderWidth, viewfinderHeight) {
            const minSize = Math.min(viewfinderWidth, viewfinderHeight);
            return { width: Math.floor(minSize * 0.9), height: Math.floor(minSize * 0.9) };
        },
    };

        function showNotification(type, message) {
            let notification = $(`
                <div class="notification alert alert-${type}" style="
                    display: inline-block;
                    padding: 10px;
                    margin-bottom: 5px;
                    border-radius: 5px;
                    box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
                    background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
                    color: ${type === 'success' ? '#155724' : '#721c24'};
                    font-weight: bold;
                ">
                    ${message}
                </div>
            `);
        
            $("#notification-container").append(notification);
        
            setTimeout(() => {
                notification.fadeOut(500, function() {
                    $(this).remove();
                });
            }, 3000); // Disappear after 3 seconds
        }

    // QR scan success callback
    const qrCodeSuccessCallback = (decodedText) => {
        if (scanCooldown) return;
        
        let activity_Id = $("#activityComboBox").val();
        if (!activity_Id) {
            showNotification('danger', 'Please select an activity before scanning.');
            return;
        }

        scanCooldown = true; // Prevent multiple scans
        html5QrCode.pause(true, false); // Pause scanner

        $.ajax({
            type: 'POST',
            url: `/add_attendeesQR/${activity_Id}/${decodedText}`,
            success: function(response) {
                ongoing_attendance_table.ajax.reload(null, false);
                showNotification(response.success ? 'success' : 'danger', response.message);
            },
            error: function(xhr) {
                showNotification('danger', 'An error occurred: ' + xhr.responseText);
            },
            complete: function() {
                setTimeout(() => {
                    scanCooldown = false;
                    html5QrCode.resume(); // Resume scanning after a delay
                }, 1000);
            }
        });
    };

    // Function to start scanner
    function startScanner() {
        if (!selectedCameraId) {
            alert("No camera selected.");
            return;
        }
        html5QrCode.start(selectedCameraId, config, qrCodeSuccessCallback)
            .then(() => {
                isScanning = true;
                $("#scan-btn").text("Stop Scanning");
            })
            .catch(err => console.error("Unable to start scanning:", err));
    }

    // Function to stop scanner
    function stopScanner() {
        return html5QrCode.stop().then(() => {
            isScanning = false;
            $("#scan-btn").text("Start Scanning");
        }).catch(err => console.error("Error stopping scanner:", err));
    }

    // Toggle scanner when clicking the button
    $("#scan-btn").on("click", function () {
        if (isScanning) {
            stopScanner();
        } else {
            startScanner();
        }
    });

    // Restart scanner when camera is changed
    $("#camera-select").on("change", function() {
        selectedCameraId = $(this).val();
        if (isScanning) {
            stopScanner().then(startScanner); // Restart scanner with the new camera
        }
    });
});


