var ongoing_sched_table;

$(document).ready(function () {
    ongoing_sched_table = new DataTable('#ongoing_sched_table', {
        //table tools
        responsive:true,
        stateSave: true,
        paging: true,
        scrollCollapse: true,
        scrollX: true,
        scrollY: '50vh',
        select: true,

        layout: {
            top1Start: 'pageLength',
            top1End: 'search',
            topStart: 'info',
            topEnd: 'paging',
            bottomStart: 'pageLength',
            bottomEnd: 'search',
            bottom2Start: 'info',
            bottom2End: 'paging', 

            top3Start: {
                buttons: [{
                    extend: 'collection',
                    text: 'Export',
                    buttons: [
                        {extend: 'copy',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            exportOptions: {columns: ':visible',rows: ':visible'},
                            },
                            
                        {extend: 'print',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            autoPrint: false,
                            exportOptions: {columns: ':visible',rows: ':visible'}
                            }, 

                        {extend: 'excel',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            exportOptions: {columns: ':visible',rows: ':visible'},
                            },   

                        {extend: 'csv',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            exportOptions: {columns: ':visible',rows: ':visible'},
                            },

                        {extend: 'pdf',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            orientation: 'protrait',
                            pageSize: 'LEGAL',
                            exportOptions: {columns: ':visible',rows: ':visible'},
                            },      
                ]},

                    {
                    extend: 'collection',
                    text: 'Export All Page',
                    buttons: [
                        {extend: 'copy',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    page: 'all',
                                    search: 'none'   
                                    },
                                },
                        },
                            
                        {extend: 'print',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            autoPrint: false,
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    page: 'all',
                                    search: 'none'   
                                    },
                                },
                            }, 

                        {extend: 'excel',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    page: 'all',
                                    search: 'none'   
                                    },
                                },
                            },   

                        {extend: 'csv',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    page: 'all',
                                    search: 'none'   
                                    },
                                },
                            },

                        {extend: 'pdf',
                            title: 'EVENT SCHEDULE',
                            footer: false,
                            orientation: 'protrait',
                            pageSize: 'LEGAL',
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    page: 'all',
                                    search: 'none'   
                                    },
                                },
                            },

                    ]},
                    'colvis'  // Column visibility button
                ]
            }
        }, 
        columnDefs: [
            {
                targets: -1,  // Hide the last column (Action buttons)
                visible: false
            }
        ],
        columnDefs: [
                    {
                        "targets": [4,5], // Target the first column (index 0)
                        "orderable": false // Disable ordering for this column
                    }
                ],

        //table fetch data
        ajax: '/render_schedule_data_ongoing', 
        columns: [
            { data: 'event_name' },
            { data: 'scheduled_date'},
            { data: 'fees',
                render: function(data, type, row) {
                    return `
                       
                        <p>&#8369;${data}</p>
                       
                    `;
                }
            },
            { data: 'id', 
                    render: function(data, type, row) {
                        return `
                        <button class="view_activities-btn btn btn-light btn-sm" 
                            data-id="${data}"
                            data-event_name="${row.event_name}" 
                            style="display:inline;">
                            <i class="fa-regular fa-clock"></i> View Activities
                        </button>

                        `;
                    } 
            },
            {
                data: 'id', // Maps to the key 'id' in the JSON
                render: function(data, type, row) {
                    return `
                        Started <i class="fa-solid fa-hourglass-start"></i>
                    `;
                }
            },             

            {
                data: 'id', // Maps to the key 'id' in the JSON
                render: function(data, type, row) {
                    return `
                        <button class="update_schedule-btn btn btn-warning btn-sm" 
                            data-id="${data}" 
                            data-event_name="${row.event_name}"
                            data-scheduled_date="${row.scheduled_date}">
                            <i class="fa-solid fa-calendar-day"></i>
                        </button>
                        <button class="delete_schedule-btn btn btn-danger btn-sm" 
                            data-id="${data}" style="display:inline;">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </button>
                    `;
                }
            },   
        ]
    });
    
});

$(document).ready(function() {
    // Listen for clicks on tabs
    $('#ongoing-tab').on('click', function(event) {
        ongoing_sched_table.ajax.reload(null, false);
    });
});