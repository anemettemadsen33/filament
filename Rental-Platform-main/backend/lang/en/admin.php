<?php

return [
    // Navigation
    'navigation' => [
        'users' => 'Users',
        'properties' => 'Properties',
        'bookings' => 'Bookings',
        'reviews' => 'Reviews',
        'settings' => 'Settings',
        'activity_log' => 'Activity Log',
    ],

    // User Management
    'users' => [
        'title' => 'Users',
        'create' => 'Create User',
        'edit' => 'Edit User',
        'delete' => 'Delete User',
        'export' => 'Export to Excel',
        'fields' => [
            'name' => 'Name',
            'email' => 'Email',
            'password' => 'Password',
            'role' => 'Role',
            'phone' => 'Phone',
            'locale' => 'Language',
            'verified' => 'Verified',
            'profile_photo' => 'Profile Photo',
        ],
        'roles' => [
            'guest' => 'Guest',
            'owner' => 'Owner',
            'admin' => 'Admin',
            'super_admin' => 'Super Admin',
        ],
    ],

    // Property Management
    'properties' => [
        'title' => 'Properties',
        'create' => 'Create Property',
        'edit' => 'Edit Property',
        'delete' => 'Delete Property',
        'export' => 'Export to Excel',
        'fields' => [
            'title' => 'Title',
            'description' => 'Description',
            'price_per_night' => 'Price per Night',
            'price_per_month' => 'Price per Month',
            'bedrooms' => 'Bedrooms',
            'bathrooms' => 'Bathrooms',
            'city' => 'City',
            'status' => 'Status',
        ],
    ],

    // Dashboard
    'dashboard' => [
        'welcome' => 'Welcome to Admin Panel',
        'stats' => [
            'total_users' => 'Total Users',
            'admin_users' => 'Admin Users',
            'verified_users' => 'Verified Users',
            'new_this_month' => 'New This Month',
            'total_properties' => 'Total Properties',
            'recent_properties' => 'Recent Properties',
        ],
    ],

    // Common
    'common' => [
        'save' => 'Save',
        'cancel' => 'Cancel',
        'delete' => 'Delete',
        'edit' => 'Edit',
        'view' => 'View',
        'search' => 'Search',
        'filter' => 'Filter',
        'export' => 'Export',
        'import' => 'Import',
        'actions' => 'Actions',
        'created_at' => 'Created At',
        'updated_at' => 'Updated At',
    ],

    // Messages
    'messages' => [
        'saved_successfully' => 'Saved successfully',
        'deleted_successfully' => 'Deleted successfully',
        'error_occurred' => 'An error occurred',
        'confirm_delete' => 'Are you sure you want to delete this?',
        'no_permission' => 'You do not have permission to perform this action',
        'cannot_edit_super_admin' => 'You cannot edit a Super Admin',
    ],
];
